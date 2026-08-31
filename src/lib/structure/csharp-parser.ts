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
}

export interface ParsedClass {
  name: string;
  kind: "class" | "interface" | "struct" | "record";
  modifiers: string[];
  /** Tipos tras los dos puntos: base y/o interfaces, en orden. */
  bases: string[];
  members: ParsedMember[];
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

const TYPE_DECL =
  /\b((?:(?:public|private|protected|internal|abstract|sealed|static|partial|new)\s+)*)(class|interface|struct|record)\s+([A-Za-z_]\w*)\s*(?:<[^>{]*>)?\s*(?::\s*([^{]+?))?\s*\{/g;

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

/** Declaraciones de tipo del archivo, con sus miembros. */
export function parseCsharpClasses(source: string): ParsedClass[] {
  const src = stripCommentsAndLiterals(source);
  const classes: ParsedClass[] = [];

  TYPE_DECL.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TYPE_DECL.exec(src)) !== null) {
    const [full, mods, kind, name, baseList] = match;
    const openBrace = match.index + full.length - 1;
    const closeBrace = matchBrace(src, openBrace);
    const body = src.slice(openBrace + 1, closeBrace);

    classes.push({
      name,
      kind: kind as ParsedClass["kind"],
      modifiers: (mods ?? "").trim().split(/\s+/).filter(Boolean),
      bases: (baseList ?? "")
        .split(",")
        .map((b) => b.trim().replace(/<.*$/, ""))
        .filter(Boolean),
      members: parseMembers(body, name),
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
      if (member) members.push(member);
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
      if (member) members.push(member);
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
    const name = rest[rest.length - 1];
    if (!isIdentifier(name)) return null;

    const isCtor = rest.length === 1 && name === className;
    return {
      kind: isCtor ? "constructor" : "method",
      name,
      type: isCtor ? "" : rest.slice(0, -1).join(" "),
      modifiers,
      paramCount: countParams(params),
      callsBase: /:\s*base\s*\(/.test(tail),
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
