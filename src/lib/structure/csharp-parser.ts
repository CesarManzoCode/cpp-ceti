// =====================================================================
// Lector estructural de C#.
//
// No es un compilador ni un analizador semántico: reconoce declaraciones
// de tipos y de miembros, que es exactamente lo que los retos de POO
// declaran como objetivo. Trabaja sobre el código con los COMENTARIOS Y
// LITERALES neutralizados, para que escribir "class Contador" dentro de un
// string o de un comentario no apruebe nada.
// =====================================================================

export type MemberKind = "field" | "property" | "method" | "constructor";

/** Un accessor de propiedad (`get`/`set`/`init`) y su visibilidad explícita. */
export interface ParsedAccessor {
  kind: "get" | "set" | "init";
  /** `undefined` cuando el accessor no lleva modificador propio (hereda la visibilidad de la propiedad). */
  visibility?: string;
}

export interface ParsedMember {
  kind: MemberKind;
  name: string;
  /** Tipo declarado tal cual (`int`, `List<Bicicleta>`); vacío en ctor. */
  type: string;
  modifiers: string[];
  /** Sólo métodos y constructores. */
  paramCount: number;
  /** El constructor encadena con `: base(...)`. */
  callsBase: boolean;
  /** Sólo propiedades: accessors detectados (`get`/`set`/`init`) con su visibilidad. */
  accessors?: ParsedAccessor[];
  /** Sólo métodos: parámetros de tipo propios (`["T"]` para `Primero<T>(...)`). Vacío si el método no es genérico. */
  typeParams?: string[];
}

/** Restricción `where <param> : <types>` declarada por un tipo genérico. */
export interface ParsedGenericConstraint {
  param: string;
  types: string[];
}

export interface ParsedClass {
  name: string;
  kind: "class" | "interface" | "struct" | "record";
  modifiers: string[];
  /** Tipos tras los dos puntos: base y/o interfaces, en orden. */
  bases: string[];
  /** Parámetros de tipo declarados entre `<...>` tras el nombre (`["T"]` para `Repositorio<T>`). Vacío si no es genérico. */
  typeParams: string[];
  /** Cláusulas `where` del tipo, si las declara. */
  constraints: ParsedGenericConstraint[];
  members: ParsedMember[];
  /** Cuerpo de la clase ya con comentarios/literales neutralizados (incluye tipos anidados). */
  body: string;
}

/**
 * Sustituye comentarios y literales por espacios del mismo largo.
 *
 * Conserva las posiciones (los índices siguen siendo válidos) y garantiza
 * que nada escrito dentro de `"..."`, `'c'`, `@"..."`, `//` o `/* *​/`
 * pueda parecer una declaración.
 */
export function stripCommentsAndLiterals(source: string): string {
  const out = source.split("");
  const blank = (from: number, to: number) => {
    for (let k = from; k < to && k < out.length; k++) {
      if (out[k] !== "\n") out[k] = " ";
    }
  };

  let i = 0;
  while (i < source.length) {
    const c = source[i];
    const next = source[i + 1];

    if (c === "/" && next === "/") {
      let j = i + 2;
      while (j < source.length && source[j] !== "\n") j++;
      blank(i, j);
      i = j;
      continue;
    }
    if (c === "/" && next === "*") {
      let j = i + 2;
      while (j < source.length && !(source[j] === "*" && source[j + 1] === "/")) {
        j++;
      }
      j = Math.min(source.length, j + 2);
      blank(i, j);
      i = j;
      continue;
    }
    // Verbatim: @"..." — las comillas se escapan duplicándolas.
    if (c === "@" && next === '"') {
      let j = i + 2;
      while (j < source.length) {
        if (source[j] === '"') {
          if (source[j + 1] === '"') {
            j += 2;
            continue;
          }
          j++;
          break;
        }
        j++;
      }
      blank(i, j);
      i = j;
      continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === "\\") {
          j += 2;
          continue;
        }
        if (source[j] === c) {
          j++;
          break;
        }
        if (source[j] === "\n") break;
        j++;
      }
      blank(i, j);
      i = j;
      continue;
    }
    i++;
  }

  return out.join("");
}

// Captura todo lo que hay entre el nombre del tipo y su `{` de apertura:
// genéricos (`<T>`), lista de bases (`: A, B`) y cláusulas `where`, en
// cualquier combinación. Se post-procesa a mano en `parseTypeHeader`
// porque intentar separarlos en un solo regex confundía "where T : Foo"
// con la lista de bases.
const TYPE_DECL =
  /\b((?:(?:public|private|protected|internal|abstract|sealed|static|partial|new)\s+)*)(class|interface|struct|record)\s+([A-Za-z_]\w*)([^{]*)\{/g;

/** Índice de la llave que cierra la que empieza en `open`. */
function matchBrace(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return src.length;
}

/** Índice de `>` que cierra el `<` en la posición `open`. */
function matchAngle(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "<") depth++;
    else if (src[i] === ">") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return src.length - 1;
}

/** Divide por `sep` sólo a profundidad 0 de `<>`, `()`, `[]`. */
function splitTopLevel(text: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "<" || ch === "(" || ch === "[") depth++;
    else if (ch === ">" || ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if (ch === sep && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts;
}

interface ParsedTypeHeader {
  typeParams: string[];
  bases: string[];
  constraints: ParsedGenericConstraint[];
}

/**
 * Interpreta el texto entre el nombre de un tipo y su `{`: parámetros de
 * tipo, lista de bases/interfaces y cláusulas `where`, en el orden real
 * de C# (`Nombre<T, U> : Base, IFoo<T> where T : Entidad where U : new()`).
 */
function parseTypeHeader(raw: string): ParsedTypeHeader {
  let rest = raw.trim();
  let typeParams: string[] = [];

  if (rest.startsWith("<")) {
    const close = matchAngle(rest, 0);
    typeParams = splitTopLevel(rest.slice(1, close), ",")
      .map((p) => p.trim().replace(/^(in|out)\s+/, ""))
      .map((p) => p.split(/\s+/)[0])
      .filter(Boolean);
    rest = rest.slice(close + 1).trim();
  }

  const whereWord = /\bwhere\b/.exec(rest);
  let baseListRaw = whereWord ? rest.slice(0, whereWord.index) : rest;
  const constraintsRaw = whereWord ? rest.slice(whereWord.index) : "";

  baseListRaw = baseListRaw.trim();
  if (baseListRaw.startsWith(":")) baseListRaw = baseListRaw.slice(1);
  const bases = splitTopLevel(baseListRaw, ",")
    .map((b) => b.trim().replace(/<.*$/, ""))
    .filter(Boolean);

  const constraints: ParsedGenericConstraint[] = [];
  const whereRe = /\bwhere\s+([A-Za-z_]\w*)\s*:\s*/g;
  const clauses: { param: string; typesStart: number; whereStart: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = whereRe.exec(constraintsRaw)) !== null) {
    clauses.push({
      param: m[1],
      typesStart: whereRe.lastIndex,
      whereStart: m.index,
    });
  }
  for (let i = 0; i < clauses.length; i++) {
    const end = i + 1 < clauses.length ? clauses[i + 1].whereStart : constraintsRaw.length;
    const types = splitTopLevel(constraintsRaw.slice(clauses[i].typesStart, end), ",")
      .map((t) => t.trim().replace(/<.*$/, ""))
      .filter(Boolean);
    if (types.length > 0) constraints.push({ param: clauses[i].param, types });
  }

  return { typeParams, bases, constraints };
}

/** Declaraciones de tipo del archivo, con sus miembros. */
export function parseCsharpClasses(source: string): ParsedClass[] {
  const src = stripCommentsAndLiterals(source);
  const classes: ParsedClass[] = [];

  TYPE_DECL.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TYPE_DECL.exec(src)) !== null) {
    const [full, mods, kind, name, headerRaw] = match;
    const openBrace = match.index + full.length - 1;
    const closeBrace = matchBrace(src, openBrace);
    const body = src.slice(openBrace + 1, closeBrace);
    const header = parseTypeHeader(headerRaw ?? "");

    classes.push({
      name,
      kind: kind as ParsedClass["kind"],
      modifiers: (mods ?? "").trim().split(/\s+/).filter(Boolean),
      bases: header.bases,
      typeParams: header.typeParams,
      constraints: header.constraints,
      members: parseMembers(body, name),
      body,
    });

    // Los tipos anidados se detectan en la siguiente vuelta del regex; no
    // se saltan a propósito, así una clase dentro de otra sigue contando.
  }

  return classes;
}

/**
 * Miembros declarados en el primer nivel del cuerpo de una clase.
 *
 * Recorre el cuerpo separando "cabezas" de declaración: todo lo que hay
 * hasta un `;`, un `{` o un `=>` a profundidad cero de paréntesis.
 */
function parseMembers(body: string, className: string): ParsedMember[] {
  const members: ParsedMember[] = [];
  let head = "";
  let depth = 0; // paréntesis y corchetes
  let i = 0;

  const flush = () => {
    head = "";
  };

  while (i < body.length) {
    const c = body[i];

    if (c === "(" || c === "[") {
      depth++;
      head += c;
      i++;
      continue;
    }
    if (c === ")" || c === "]") {
      depth = Math.max(0, depth - 1);
      head += c;
      i++;
      continue;
    }
    if (depth > 0) {
      head += c;
      i++;
      continue;
    }

    if (c === "=" && body[i + 1] === ">") {
      // Cuerpo de expresión: el miembro termina en el `;` de la expresión.
      const end = body.indexOf(";", i);
      const member = buildMember(head, className, true);
      if (member) {
        // Una propiedad `=> expr;` es de sólo lectura: no hay `set`.
        if (member.kind === "property") member.accessors = [{ kind: "get" }];
        members.push(member);
      }
      flush();
      i = end === -1 ? body.length : end + 1;
      continue;
    }
    if (c === "=") {
      // Inicializador de campo: el valor no aporta estructura.
      const end = body.indexOf(";", i);
      const member = buildMember(head, className, false);
      if (member) members.push(member);
      flush();
      i = end === -1 ? body.length : end + 1;
      continue;
    }
    if (c === ";") {
      const member = buildMember(head, className, false);
      if (member) members.push(member);
      flush();
      i++;
      continue;
    }
    if (c === "{") {
      const close = matchBrace(body, i);
      const member = buildMember(head, className, true);
      if (member) {
        if (member.kind === "property") {
          member.accessors = parsePropertyAccessors(body.slice(i + 1, close));
        }
        members.push(member);
      }
      flush();
      i = close + 1;
      continue;
    }

    head += c;
    i++;
  }

  return members;
}

const MODIFIER_WORDS = new Set([
  "public",
  "private",
  "protected",
  "internal",
  "static",
  "virtual",
  "override",
  "abstract",
  "sealed",
  "readonly",
  "const",
  "async",
  "new",
  "partial",
  "extern",
  "unsafe",
  "required",
  "volatile",
]);

/**
 * Convierte una cabeza de declaración en un miembro.
 *
 * Devuelve `null` cuando la cabeza no es una declaración de miembro
 * (una clase anidada, un `return`, una llave suelta): esos casos los cubre
 * el escaneo de tipos, no éste.
 */
function buildMember(
  rawHead: string,
  className: string,
  hasBody: boolean,
): ParsedMember | null {
  const head = rawHead.replace(/\s+/g, " ").trim();
  if (!head) return null;

  // Una declaración de tipo anidada la maneja `parseCsharpClasses`.
  if (/\b(class|interface|struct|record|enum)\b/.test(head)) return null;
  // Atributos: `[Serializable]` antes del miembro.
  const clean = head.replace(/^\[[^\]]*\]\s*/g, "").trim();
  if (!clean) return null;

  const parenIdx = clean.indexOf("(");
  const signature = parenIdx === -1 ? clean : clean.slice(0, parenIdx);
  const words = signature.split(" ").filter(Boolean);
  if (words.length === 0) return null;

  const modifiers: string[] = [];
  let k = 0;
  while (k < words.length && MODIFIER_WORDS.has(words[k])) {
    modifiers.push(words[k]);
    k++;
  }
  const rest = words.slice(k);
  if (rest.length === 0) return null;

  if (parenIdx !== -1) {
    const closeIdx = matchParen(clean, parenIdx);
    const params = clean.slice(parenIdx + 1, closeIdx);
    const tail = clean.slice(closeIdx + 1);
    let name = rest[rest.length - 1];

    // Método genérico: `Primero<T>` — separa el nombre real de sus
    // propios parámetros de tipo (distintos de los de la clase).
    let methodTypeParams: string[] = [];
    const genericName = /^([A-Za-z_]\w*)<(.+)>$/.exec(name);
    if (genericName) {
      name = genericName[1];
      methodTypeParams = splitTopLevel(genericName[2], ",")
        .map((p) => p.trim())
        .filter(Boolean);
    }
    if (!isIdentifier(name)) return null;

    const isCtor = rest.length === 1 && name === className;
    return {
      kind: isCtor ? "constructor" : "method",
      name,
      type: isCtor ? "" : rest.slice(0, -1).join(" "),
      modifiers,
      paramCount: countParams(params),
      callsBase: /:\s*base\s*\(/.test(tail),
      typeParams: isCtor ? undefined : methodTypeParams,
    };
  }

  // Sin paréntesis: campo o propiedad. Hacen falta tipo y nombre.
  if (rest.length < 2) return null;
  const name = rest[rest.length - 1];
  if (!isIdentifier(name)) return null;

  return {
    kind: hasBody ? "property" : "field",
    name,
    type: rest.slice(0, -1).join(" "),
    modifiers,
    paramCount: 0,
    callsBase: false,
  };
}

function isIdentifier(word: string): boolean {
  return /^[A-Za-z_]\w*$/.test(word);
}

function matchParen(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "(") depth++;
    else if (src[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return src.length;
}

/** Parámetros de una firma, contando sólo comas de primer nivel. */
function countParams(params: string): number {
  const trimmed = params.trim();
  if (trimmed === "") return 0;
  let depth = 0;
  let count = 1;
  for (const c of trimmed) {
    if (c === "(" || c === "[" || c === "<") depth++;
    else if (c === ")" || c === "]" || c === ">") depth--;
    else if (c === "," && depth === 0) count++;
  }
  return count;
}

const ACCESSOR_VISIBILITY_WORDS = new Set(["public", "private", "protected", "internal"]);
const ACCESSOR_KEYWORDS = new Set(["get", "set", "init"]);

/**
 * Lee el bloque de accessors de una propiedad (`{ get; private set; }`,
 * `{ get => x; set => x = value; }`, `{ get; }`, etc.) y devuelve cada
 * accessor con su visibilidad EXPLÍCITA (`undefined` si el accessor no
 * lleva modificador propio: hereda la visibilidad de la propiedad).
 *
 * No es un parser de expresiones: sólo reconoce la cabeza de cada
 * accessor y salta su valor (`;`, `=> ...;` o `{ ... }`) sin
 * interpretarlo, igual que `buildMember` hace con miembros de clase.
 */
function parsePropertyAccessors(block: string): ParsedAccessor[] {
  const accessors: ParsedAccessor[] = [];
  let pendingVisibility: string | undefined;
  let i = 0;

  while (i < block.length) {
    const c = block[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }

    const wordMatch = /^[A-Za-z_]\w*/.exec(block.slice(i));
    if (!wordMatch) {
      // Atributos (`[Foo]`) u otro carácter suelto: se ignora.
      pendingVisibility = undefined;
      i++;
      continue;
    }
    const word = wordMatch[0];
    i += word.length;

    if (ACCESSOR_VISIBILITY_WORDS.has(word)) {
      pendingVisibility = word;
      continue;
    }
    if (!ACCESSOR_KEYWORDS.has(word)) {
      pendingVisibility = undefined;
      continue;
    }

    accessors.push({ kind: word as ParsedAccessor["kind"], visibility: pendingVisibility });
    pendingVisibility = undefined;

    while (i < block.length && /\s/.test(block[i])) i++;
    if (block[i] === ";") {
      i++;
    } else if (block[i] === "=" && block[i + 1] === ">") {
      const semi = block.indexOf(";", i + 2);
      i = semi === -1 ? block.length : semi + 1;
    } else if (block[i] === "{") {
      i = matchBrace(block, i) + 1;
    }
  }

  return accessors;
}
