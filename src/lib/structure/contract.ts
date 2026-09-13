import { z } from "zod";

// =====================================================================
// Contrato ESTRUCTURAL de un reto.
//
// Existe porque la salida correcta no prueba el aprendizaje de POO: un
// programa procedural dentro de `Main` puede imprimir exactamente lo mismo
// que un diseño con clases. Cuando el objetivo declarado de un reto es
// estructural (UML, encapsulamiento, relaciones, herencia, polimorfismo,
// `static`), aprobar exige comportamiento correcto **y** la estructura
// mínima que el enunciado pide.
//
// NO es un analizador universal de diseño: describe el constructo explícito
// de cada reto publicado y nada más. Los retos sin contrato (todo C++) se
// siguen evaluando sólo por comportamiento.
// =====================================================================

export const VISIBILITIES = [
  "public",
  "private",
  "protected",
  "internal",
] as const;

export type Visibility = (typeof VISIBILITIES)[number];

const visibilitySchema = z.enum(VISIBILITIES);

const fieldSchema = z.object({
  name: z.string().min(1),
  visibility: visibilitySchema.optional(),
  /** Tipo declarado. `List<Bicicleta>` satisface el requisito `Bicicleta`. */
  type: z.string().min(1).optional(),
  static: z.boolean().optional(),
  readonly: z.boolean().optional(),
});

const propertySchema = z.object({
  name: z.string().min(1),
  visibility: visibilitySchema.optional(),
  type: z.string().min(1).optional(),
  static: z.boolean().optional(),
  /**
   * Visibilidad exigida del accessor `get`. Rara vez se usa: por defecto
   * un `get` hereda la visibilidad de la propiedad.
   */
  getVisibility: visibilitySchema.optional(),
  /**
   * Visibilidad exigida del accessor `set` (o `init`), p. ej. `"private"`
   * para exigir `{ get; private set; }`. Una propiedad `{ get; set; }`
   * pública NO satisface `setVisibility: "private"`, y una propiedad sin
   * setter (sólo `{ get; }` o cuerpo de expresión `=>`) tampoco: el
   * requisito pide un setter que EXISTA y sea privado, no la ausencia de
   * uno público.
   */
  setVisibility: visibilitySchema.optional(),
});

const genericConstraintSchema = z.object({
  /** Nombre del parámetro de tipo, p. ej. `"T"`. */
  param: z.string().min(1),
  /**
   * Lo que exige el `where`, tal como aparece: `["Entidad"]` para
   * `where T : Entidad`, o `["class"]`, `["struct"]`, `["new()"]`. Se
   * compara por texto (sin genéricos anidados) contra cada cláusula
   * `where <param> : ...` que el código realmente declare.
   */
  types: z.array(z.string().min(1)).min(1),
});

const genericSchema = z.object({
  /** Aridad exacta de parámetros de tipo: `1` para `Clase<T>`. */
  arity: z.number().int().min(1).optional(),
  /** Restricciones `where` que el tipo debe declarar. */
  constraints: z.array(genericConstraintSchema).optional(),
});

const methodSchema = z.object({
  name: z.string().min(1),
  visibility: visibilitySchema.optional(),
  static: z.boolean().optional(),
  virtual: z.boolean().optional(),
  override: z.boolean().optional(),
  abstract: z.boolean().optional(),
  returnType: z.string().min(1).optional(),
  paramCount: z.number().int().min(0).optional(),
  /**
   * Aridad de parámetros de tipo PROPIOS del método (distintos de los de
   * su clase): `{ arity: 1 }` exige `Primero<T>(...)`, no una sobrecarga
   * no genérica por tipo.
   */
  generic: z.object({ arity: z.number().int().min(1).optional() }).optional(),
});

const constructorSchema = z.object({
  visibility: visibilitySchema.optional(),
  paramCount: z.number().int().min(0).optional(),
  /** Debe encadenar con `: base(...)`. */
  callsBase: z.boolean().optional(),
});

const classSchema = z.object({
  name: z.string().min(1),
  /** Clase base requerida: `class Ahorro : Cuenta`. */
  extends: z.string().min(1).optional(),
  abstract: z.boolean().optional(),
  fields: z.array(fieldSchema).optional(),
  properties: z.array(propertySchema).optional(),
  methods: z.array(methodSchema).optional(),
  constructors: z.array(constructorSchema).optional(),
  /**
   * Relación ALMACENADA: un campo o propiedad cuyo tipo es la clase
   * indicada. Es la diferencia entre "recibe un `Bicicleta` por parámetro"
   * (dependencia) y "guarda un `Bicicleta`" (asociación).
   */
  stores: z
    .array(z.object({ type: z.string().min(1), as: z.string().optional() }))
    .optional(),
  /**
   * Relación que la clase NO debe almacenar. Es el otro lado de `stores`:
   * una DEPENDENCIA usa el objeto como parámetro y no lo conserva. Sin
   * esto, "no guardes la referencia" sería una instrucción sin evaluar.
   */
  notStores: z.array(z.object({ type: z.string().min(1) })).optional(),
  /** Aridad y restricciones `where` cuando la clase/tipo es genérico. */
  generic: genericSchema.optional(),
  /**
   * Tokens que DEBEN aparecer, como palabra completa, dentro del cuerpo
   * de ESTA clase (comentarios y literales ya neutralizados). Existe para
   * exigir el uso real de un constructo que la salida no puede probar por
   * sí sola: p. ej. `["Thread", "Join"]` o `["lock"]`. No es un chequeo
   * semántico — sólo confirma que el texto está ahí, y sólo dentro del
   * cuerpo de la clase indicada (así "el candado es de `Inventario`, no
   * de `Program`" es verificable: exige `lock` dentro de `Inventario`,
   * no en cualquier parte del archivo).
   */
  requiresConstructs: z.array(z.string().min(1)).optional(),
});

const sqlContractSchema = z.object({
  /**
   * Palabras clave que el SQL ENVIADO por el alumno debe usar de verdad
   * (comentarios y strings ya neutralizados), p. ej. `["BEGIN", "ROLLBACK"]`.
   *
   * Existe para lo que NINGÚN post-check contra el estado final de la base
   * puede probar: un `ROLLBACK` real y un cambio que nunca se intentó
   * terminan en el MISMO estado final de la base — no hay forma de
   * distinguir "lo revirtió" de "nunca lo intentó" inspeccionando sólo el
   * resultado. La única evidencia posible de que el alumno usó la
   * transacción de verdad está en el texto de su envío, no en el estado
   * final.
   */
  requiresKeywords: z.array(z.string().min(1)).min(1),
});

export const structureContractSchema = z
  .object({
    /** Clases que el código DEBE declarar (C#), con sus miembros mínimos. */
    classes: z.array(classSchema).optional(),
    /** Requisitos sobre el SQL enviado (curso `bases-de-datos`). */
    sql: sqlContractSchema.optional(),
  })
  .refine((c) => (c.classes && c.classes.length > 0) || c.sql !== undefined, {
    message: "El contrato estructural debe declarar `classes` o `sql`.",
  });

export type StructureContract = z.infer<typeof structureContractSchema>;
export type ClassRequirement = z.infer<typeof classSchema>;
export type PropertyRequirement = z.infer<typeof propertySchema>;
export type GenericRequirement = z.infer<typeof genericSchema>;
export type SqlContractRequirement = z.infer<typeof sqlContractSchema>;

export interface StructureCheck {
  /** `true` cuando no hay contrato o cuando el código lo satisface. */
  satisfied: boolean;
  /** Un mensaje por requisito incumplido, en es-MX y accionable. */
  failures: string[];
}

/**
 * Lee un contrato guardado en la base (columna `Json?`). Un contrato
 * inválido se trata como AUSENTE en vez de reventar el envío del alumno:
 * un error de contenido no puede convertirse en un reto imposible.
 */
export function parseStructureContract(value: unknown): StructureContract | null {
  if (value === null || value === undefined) return null;
  const parsed = structureContractSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
