import { Prisma } from "@prisma/client";

/**
 * Doble de prueba de Prisma + PostgreSQL con la propiedad que nos importa:
 * **emula el aborto de transacción de Postgres**.
 *
 * En Postgres, cualquier error dentro de un bloque de transacción (incluida
 * una violación de UNIQUE) deja la transacción en estado `aborted`. Aunque
 * JavaScript atrape el P2002, toda consulta posterior dentro de esa misma
 * transacción falla con:
 *
 *   PostgresError code "25P02" — current transaction is aborted,
 *   commands ignored until end of transaction block
 *
 * Un mock ingenuo (que sólo lanza P2002 y sigue tan campante) NO reproduce el
 * bug de producción y haría que los tests de regresión pasaran incluso con el
 * código roto. Este doble sí lo reproduce: ver `fake-prisma.test.ts`.
 *
 * Alcance deliberadamente chico: sólo las operaciones que usan las Server
 * Actions bajo prueba. No es un Prisma completo.
 */

export type Row = Record<string, unknown>;

interface TableState {
  rows: Row[];
  uniques: string[][];
}

/** Índices UNIQUE por modelo (además del `id`, que se agrega siempre). */
const UNIQUES: Record<string, string[][]> = {
  userExerciseCompletion: [["userId", "exerciseId"]],
  userPracticeCompletion: [["userId", "exerciseId"]],
  userStepProgress: [["userId", "stepId"]],
  userLessonProgress: [["userId", "lessonId"]],
  userStreak: [["userId"]],
  friendship: [["requesterId", "addresseeId"]],
  practiceExercise: [["courseId", "slug"]],
  unit: [["courseId", "slug"]],
  productEvent: [["userId", "dedupeKey"]],
  studySession: [["userId", "clientKey"]],
  userHintViewed: [
    ["userId", "exerciseId", "hintIndex"],
    ["userId", "practiceExerciseId", "hintIndex"],
  ],
};

/** Valores por defecto que aplica el schema y que algún test podría leer. */
const DEFAULTS: Record<string, Row> = {
  userStepProgress: { completionCount: 1 },
  userLessonProgress: { status: "in_progress", xpEarned: 0, completedAt: null },
  userStreak: { currentStreak: 0, longestStreak: 0, totalXp: 0, lastActiveDate: null },
};

function uniqueViolation(model: string, op: string, fields: string[]): Error {
  return new Prisma.PrismaClientKnownRequestError(
    `\nInvalid \`prisma.${model}.${op}()\` invocation:\n\n` +
      `Unique constraint failed on the fields: (\`${fields.join("`,`")}\`)`,
    { code: "P2002", clientVersion: "fake", meta: { target: fields } },
  );
}

function abortedTransaction(model: string, op: string): Error {
  return new Prisma.PrismaClientUnknownRequestError(
    `\nInvalid \`prisma.${model}.${op}()\` invocation:\n\n` +
      "Error occurred during query execution:\n" +
      "ConnectorError(ConnectorError { kind: QueryError(PostgresError { " +
      'code: "25P02", message: "current transaction is aborted, commands ' +
      'ignored until end of transaction block", severity: "ERROR" }) })',
    { clientVersion: "fake" },
  );
}

function notFound(model: string, op: string): Error {
  return new Prisma.PrismaClientKnownRequestError(
    `\nInvalid \`prisma.${model}.${op}()\` invocation:\n\nRecord to update not found.`,
    { code: "P2025", clientVersion: "fake" },
  );
}

function isPlainObject(v: unknown): v is Row {
  return typeof v === "object" && v !== null && !Array.isArray(v) && !(v instanceof Date);
}

function sameValue(a: unknown, b: unknown): boolean {
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  return a === b;
}

export interface FakeDb {
  /** Ejecuta una transacción interactiva (serializada, ver nota abajo). */
  $transaction<T>(fn: (tx: FakeDb) => Promise<T>): Promise<T>;
  /**
   * Stub de SQL crudo: NO ejecuta nada, sólo registra la sentencia y sus
   * parámetros en `rawQueries` para que los tests puedan afirmar sobre los
   * guardas (ej. `WHERE "endedAt" IS NULL`).
   */
  $executeRaw(query: unknown, ...values: unknown[]): Promise<number>;
  /** Sentencias crudas registradas por `$executeRaw`. */
  rawQueries: { sql: string; values: unknown[] }[];
  /** Vacía todas las tablas y el registro de consultas abortadas. */
  reset(): void;
  /** Inserta filas crudas sin validar (setup de tests). */
  seed(model: string, rows: Row[]): void;
  /** Filas actuales de un modelo. */
  table(model: string): Row[];
  /**
   * Consultas que se intentaron con la transacción ya abortada. Si esto no
   * está vacío, el código bajo prueba reventaría con 25P02 en producción.
   */
  abortedQueries: string[];
  [model: string]: unknown;
}

type ModelApi = Record<string, (args?: Row) => Promise<unknown>>;

class FakeDbImpl {
  private tables = new Map<string, TableState>();
  private modelApis = new Map<string, ModelApi>();
  private ids = 0;
  private inTx = false;
  private aborted = false;
  /** Cola para serializar transacciones concurrentes. */
  private txQueue: Promise<unknown> = Promise.resolve();
  self: FakeDb | null = null;

  abortedQueries: string[] = [];
  rawQueries: { sql: string; values: unknown[] }[] = [];

  $executeRaw(query: unknown, ...values: unknown[]): Promise<number> {
    const sql = readSql(query);
    this.rawQueries.push({ sql, values: readSqlValues(query, values) });
    return Promise.resolve(0);
  }

  reset(): void {
    this.tables.clear();
    this.modelApis.clear();
    this.abortedQueries = [];
    this.rawQueries = [];
    this.ids = 0;
    this.inTx = false;
    this.aborted = false;
    this.txQueue = Promise.resolve();
  }

  seed(model: string, rows: Row[]): void {
    const t = this.tableState(model);
    for (const r of rows) t.rows.push({ ...r });
  }

  table(model: string): Row[] {
    return this.tableState(model).rows;
  }

  /**
   * Transacción interactiva. Se serializa contra otras transacciones en
   * vuelo: dos escrituras que compiten por el mismo índice UNIQUE también
   * se serializan en Postgres, así que para lo que probamos (quién gana el
   * "primer aprobado") el orden total es una simplificación válida.
   *
   * Si el callback lanza, se restaura el snapshot previo → rollback.
   */
  $transaction<T>(fn: (tx: FakeDb) => Promise<T>): Promise<T> {
    const run = async (): Promise<T> => {
      const snapshot = this.snapshot();
      this.inTx = true;
      this.aborted = false;
      try {
        const result = await fn(this.self as FakeDb);
        return result;
      } catch (err) {
        this.restore(snapshot);
        throw err;
      } finally {
        this.inTx = false;
        this.aborted = false;
      }
    };
    const next = this.txQueue.then(run, run);
    // La cola no debe romperse si una tx falla.
    this.txQueue = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  }

  modelApi(model: string): ModelApi {
    const cached = this.modelApis.get(model);
    if (cached) return cached;
    const api: ModelApi = {
      create: (args = {}) => this.op(model, "create", () => this.create(model, args)),
      createMany: (args = {}) =>
        this.op(model, "createMany", () => this.createMany(model, args)),
      findUnique: (args = {}) =>
        this.op(model, "findUnique", () => this.findFirst(model, args)),
      findFirst: (args = {}) =>
        this.op(model, "findFirst", () => this.findFirst(model, args)),
      findMany: (args = {}) => this.op(model, "findMany", () => this.findMany(model, args)),
      count: (args = {}) =>
        this.op(model, "count", () => this.findMany(model, args).length),
      update: (args = {}) => this.op(model, "update", () => this.update(model, args)),
      updateMany: (args = {}) =>
        this.op(model, "updateMany", () => this.updateMany(model, args)),
      upsert: (args = {}) => this.op(model, "upsert", () => this.upsert(model, args)),
      delete: (args = {}) => this.op(model, "delete", () => this.deleteOne(model, args)),
      deleteMany: (args = {}) =>
        this.op(model, "deleteMany", () => this.deleteMany(model, args)),
    };
    this.modelApis.set(model, api);
    return api;
  }

  // ------------------------------------------------------------------
  // Núcleo: guardia de transacción abortada + marcado de aborto.
  // ------------------------------------------------------------------
  private async op<T>(model: string, name: string, run: () => T): Promise<T> {
    if (this.inTx && this.aborted) {
      this.abortedQueries.push(`${model}.${name}`);
      throw abortedTransaction(model, name);
    }
    try {
      return run();
    } catch (err) {
      // Igual que Postgres: el error deja la transacción inservible.
      if (this.inTx) this.aborted = true;
      throw err;
    }
  }

  // ------------------------------------------------------------------
  // Operaciones
  // ------------------------------------------------------------------
  private create(model: string, args: Row): Row {
    const data = (args.data ?? {}) as Row;
    return this.insert(model, "create", data);
  }

  private createMany(model: string, args: Row): { count: number } {
    const raw = args.data;
    const rows = Array.isArray(raw) ? (raw as Row[]) : [(raw ?? {}) as Row];
    const skipDuplicates = args.skipDuplicates === true;
    let count = 0;
    for (const data of rows) {
      if (skipDuplicates && this.conflictOf(model, data)) continue;
      this.insert(model, "createMany", data);
      count++;
    }
    return { count };
  }

  private insert(model: string, op: string, data: Row): Row {
    const conflict = this.conflictOf(model, data);
    if (conflict) throw uniqueViolation(model, op, conflict);
    const t = this.tableState(model);
    const row: Row = {
      id: `${model}_${++this.ids}`,
      ...DEFAULTS[model],
      ...data,
    };
    t.rows.push(row);
    return { ...row };
  }

  /**
   * Devuelve las columnas del índice UNIQUE violado, o `null`.
   *
   * Igual que Postgres: si alguna columna del índice es NULL, la fila NO
   * compite por ese índice (dos NULL no son iguales entre sí). De eso
   * depende, por ejemplo, que `product_event` permita muchos eventos sin
   * `dedupeKey`.
   */
  private conflictOf(model: string, data: Row): string[] | null {
    const t = this.tableState(model);
    for (const cols of t.uniques) {
      if (cols.some((c) => data[c] === undefined || data[c] === null)) continue;
      const hit = t.rows.some((r) => cols.every((c) => sameValue(r[c], data[c])));
      if (hit) return cols;
    }
    return null;
  }

  private findFirst(model: string, args: Row): Row | null {
    const found = this.findMany(model, args)[0];
    return found ? { ...found } : null;
  }

  private findMany(model: string, args: Row): Row[] {
    const where = (args.where ?? {}) as Row;
    return this.tableState(model).rows.filter((r) => this.matches(model, r, where));
  }

  private update(model: string, args: Row): Row {
    const target = this.findMany(model, args)[0];
    if (!target) throw notFound(model, "update");
    applyData(target, (args.data ?? {}) as Row);
    return { ...target };
  }

  private updateMany(model: string, args: Row): { count: number } {
    const targets = this.findMany(model, args);
    for (const t of targets) applyData(t, (args.data ?? {}) as Row);
    return { count: targets.length };
  }

  private upsert(model: string, args: Row): Row {
    const target = this.findMany(model, args)[0];
    if (target) {
      applyData(target, (args.update ?? {}) as Row);
      return { ...target };
    }
    return this.insert(model, "upsert", (args.create ?? {}) as Row);
  }

  private deleteOne(model: string, args: Row): Row {
    const t = this.tableState(model);
    const idx = t.rows.findIndex((r) => this.matches(model, r, (args.where ?? {}) as Row));
    if (idx < 0) throw notFound(model, "delete");
    const [removed] = t.rows.splice(idx, 1);
    return { ...removed };
  }

  private deleteMany(model: string, args: Row): { count: number } {
    const t = this.tableState(model);
    const before = t.rows.length;
    const where = (args.where ?? {}) as Row;
    t.rows = t.rows.filter((r) => !this.matches(model, r, where));
    return { count: before - t.rows.length };
  }

  // ------------------------------------------------------------------
  // WHERE: igualdad, `in`, `OR`/`AND` y claves compuestas de UNIQUE
  // (ej. `userId_stepId: { userId, stepId }`).
  // ------------------------------------------------------------------
  private matches(model: string, row: Row, where: Row): boolean {
    return Object.entries(where).every(([key, value]) => {
      if (key === "OR") {
        return (value as Row[]).some((w) => this.matches(model, row, w));
      }
      if (key === "AND") {
        return (value as Row[]).every((w) => this.matches(model, row, w));
      }
      const compound = this.tableState(model).uniques.find((c) => c.join("_") === key);
      if (compound && isPlainObject(value)) {
        return compound.every((c) => sameValue(row[c], value[c]));
      }
      if (isPlainObject(value)) {
        if ("in" in value) return (value.in as unknown[]).some((v) => sameValue(row[key], v));
        if ("not" in value) return !sameValue(row[key], value.not);
        if ("equals" in value) return sameValue(row[key], value.equals);
        // Comparadores numéricos (ej. `completionCount: { gt: 0 }`).
        if ("gt" in value) return Number(row[key]) > Number(value.gt);
        if ("gte" in value) return Number(row[key]) >= Number(value.gte);
        if ("lt" in value) return Number(row[key]) < Number(value.lt);
        if ("lte" in value) return Number(row[key]) <= Number(value.lte);
        // Filtro sobre una relación anidada (ej. `unit: { slug }`): la fila
        // sembrada trae el objeto embebido y comparamos recursivamente.
        const nested = row[key];
        if (isPlainObject(nested)) return this.matches(model, nested, value);
        return false;
      }
      return sameValue(row[key], value);
    });
  }

  private tableState(model: string): TableState {
    let t = this.tables.get(model);
    if (!t) {
      t = { rows: [], uniques: [["id"], ...(UNIQUES[model] ?? [])] };
      this.tables.set(model, t);
    }
    return t;
  }

  private snapshot(): Map<string, Row[]> {
    const snap = new Map<string, Row[]>();
    for (const [name, t] of this.tables) snap.set(name, structuredClone(t.rows));
    return snap;
  }

  private restore(snap: Map<string, Row[]>): void {
    for (const [name, t] of this.tables) {
      t.rows = snap.get(name) ?? [];
    }
  }
}

/** Texto de una plantilla SQL de Prisma (`Prisma.sql`) o de un tagged template. */
function readSql(query: unknown): string {
  if (typeof query === "string") return query;
  if (Array.isArray(query)) return query.join("?");
  if (query && typeof query === "object") {
    const q = query as { sql?: unknown; text?: unknown; strings?: unknown };
    if (typeof q.sql === "string") return q.sql;
    if (typeof q.text === "string") return q.text;
    if (Array.isArray(q.strings)) return q.strings.join("?");
  }
  return "";
}

function readSqlValues(query: unknown, values: unknown[]): unknown[] {
  if (query && typeof query === "object" && "values" in query) {
    const v = (query as { values?: unknown }).values;
    if (Array.isArray(v)) return v;
  }
  return values;
}

function applyData(row: Row, data: Row): void {
  for (const [key, value] of Object.entries(data)) {
    if (isPlainObject(value) && "increment" in value) {
      row[key] = ((row[key] as number) ?? 0) + (value.increment as number);
    } else if (isPlainObject(value) && "decrement" in value) {
      row[key] = ((row[key] as number) ?? 0) - (value.decrement as number);
    } else if (isPlainObject(value) && "set" in value) {
      row[key] = value.set;
    } else {
      row[key] = value;
    }
  }
}

/** Crea un cliente falso. Los modelos se materializan al primer acceso. */
export function createFakeDb(): FakeDb {
  const impl = new FakeDbImpl();
  const proxy = new Proxy(impl, {
    get(target, prop, receiver) {
      if (typeof prop === "string" && !(prop in target)) {
        return target.modelApi(prop);
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as unknown as FakeDb;
  impl.self = proxy;
  return proxy;
}
