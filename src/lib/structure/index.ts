import type { LanguageId } from "@/lib/code-languages";

import {
  parseStructureContract,
  type ClassRequirement,
  type PropertyRequirement,
  type Visibility,
} from "./contract";
import {
  parseCsharpClasses,
  type ParsedClass,
  type ParsedMember,
} from "./csharp-parser";

export { parseStructureContract } from "./contract";
export type { StructureContract, Visibility } from "./contract";

export interface StructureCheck {
  /** `true` cuando no hay contrato o cuando el código lo satisface. */
  satisfied: boolean;
  /** Un mensaje por requisito incumplido, en es-MX y accionable. */
  failures: string[];
}

const OK: StructureCheck = { satisfied: true, failures: [] };

/**
 * Verifica el contrato estructural de un reto contra el código enviado.
 *
 * Sin contrato —o en un lenguaje sin lector estructural, como C++— el reto
 * se sigue evaluando sólo por comportamiento: esta función no cambia nada
 * de lo que ya funcionaba.
 */
export function checkStructure(
  contractValue: unknown,
  sourceCode: string,
  language: LanguageId,
): StructureCheck {
  const contract = parseStructureContract(contractValue);
  if (!contract) return OK;
  if (language !== "csharp") return OK;

  const classes = parseCsharpClasses(sourceCode);
  const failures: string[] = [];
  for (const required of contract.classes) {
    checkClass(required, classes, failures);
  }
  return { satisfied: failures.length === 0, failures };
}

/** Resumen para el alumno: qué falta y por qué no basta la salida. */
export function buildStructureFeedback(
  check: StructureCheck,
  testsPassed: boolean,
): string {
  const first = check.failures[0] ?? "";
  const more =
    check.failures.length > 1
      ? ` (y ${check.failures.length - 1} requisito${
          check.failures.length > 2 ? "s" : ""
        } más del enunciado)`
      : "";
  if (testsPassed) {
    return `La salida es correcta, pero el diseño todavía no. ${first}${more}`;
  }
  return `Falta la salida esperada y el diseño que pide el enunciado. ${first}${more}`;
}

// ---------------------------------------------------------------------
// Reglas
// ---------------------------------------------------------------------
function checkClass(
  required: ClassRequirement,
  classes: ParsedClass[],
  failures: string[],
): void {
  const found = classes.find((c) => c.name === required.name);
  if (!found) {
    failures.push(
      `Falta la clase \`${required.name}\`. El programa tiene que declararla, no resolver todo dentro de \`Main\`.`,
    );
    return;
  }

  if (required.abstract && !found.modifiers.includes("abstract")) {
    failures.push(
      `\`${required.name}\` debe declararse como clase \`abstract\`: es un contrato, no una clase que se pueda instanciar.`,
    );
  }

  if (required.extends && !found.bases.includes(required.extends)) {
    failures.push(
      `\`${required.name}\` debe heredar de \`${required.extends}\` (\`class ${required.name} : ${required.extends}\`).`,
    );
  }

  if (required.generic) {
    checkGeneric(required.name, required.generic, found, failures);
  }

  for (const token of required.requiresConstructs ?? []) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`\\b${escaped}\\b`).test(found.body)) {
      failures.push(
        `\`${required.name}\` debe usar \`${token}\` de verdad: la salida correcta no basta, el reto pide ese constructo.`,
      );
    }
  }

  for (const field of required.fields ?? []) {
    const member = pick(found, ["field"], field.name);
    if (!member) {
      failures.push(
        `A \`${required.name}\` le falta el campo \`${field.name}\`${
          field.type ? ` de tipo \`${field.type}\`` : ""
        }.`,
      );
      continue;
    }
    checkVisibility(required.name, field.name, "campo", field.visibility, member, failures);
    checkType(required.name, field.name, "campo", field.type, member, failures);
    if (field.static && !member.modifiers.includes("static")) {
      failures.push(
        `El campo \`${field.name}\` de \`${required.name}\` debe ser \`static\`: pertenece a la clase, no a cada objeto.`,
      );
    }
    if (field.readonly && !member.modifiers.includes("readonly")) {
      failures.push(
        `El campo \`${field.name}\` de \`${required.name}\` debe ser \`readonly\`.`,
      );
    }
  }

  for (const prop of required.properties ?? []) {
    const member = pick(found, ["property"], prop.name);
    if (!member) {
      failures.push(
        `A \`${required.name}\` le falta la propiedad \`${prop.name}\`. Una propiedad se declara con \`{ get; set; }\` o con \`get\`/\`set\` propios, no como campo suelto.`,
      );
      continue;
    }
    checkVisibility(required.name, prop.name, "propiedad", prop.visibility, member, failures);
    checkType(required.name, prop.name, "propiedad", prop.type, member, failures);
    if (prop.static && !member.modifiers.includes("static")) {
      failures.push(
        `La propiedad \`${prop.name}\` de \`${required.name}\` debe ser \`static\`.`,
      );
    }
    checkPropertyAccessors(required.name, prop, member, failures);
  }

  for (const method of required.methods ?? []) {
    const candidates = found.members.filter(
      (m) => m.kind === "method" && m.name === method.name,
    );
    if (candidates.length === 0) {
      failures.push(
        `A \`${required.name}\` le falta el método \`${method.name}\`.`,
      );
      continue;
    }
    const member =
      candidates.find(
        (m) =>
          method.paramCount === undefined || m.paramCount === method.paramCount,
      ) ?? candidates[0];

    if (
      method.paramCount !== undefined &&
      member.paramCount !== method.paramCount
    ) {
      failures.push(
        `El método \`${method.name}\` de \`${required.name}\` debe recibir ${method.paramCount} ${
          method.paramCount === 1 ? "parámetro" : "parámetros"
        }.`,
      );
    }
    checkVisibility(required.name, method.name, "método", method.visibility, member, failures);
    if (method.returnType && !typeMatches(member.type, method.returnType)) {
      failures.push(
        `El método \`${method.name}\` de \`${required.name}\` debe devolver \`${method.returnType}\`.`,
      );
    }
    if (method.generic?.arity !== undefined) {
      const arity = member.typeParams?.length ?? 0;
      if (arity !== method.generic.arity) {
        const plural = method.generic.arity === 1 ? "parámetro" : "parámetros";
        failures.push(
          arity === 0
            ? `El método \`${method.name}\` de \`${required.name}\` debe ser genérico, con ${method.generic.arity} ${plural} de tipo propio (p. ej. \`${method.name}<T>\`), no una sobrecarga distinta por tipo.`
            : `El método \`${method.name}\` de \`${required.name}\` debe declarar ${method.generic.arity} ${plural} de tipo (ahora tiene ${arity}).`,
        );
      }
    }
    for (const [flag, explanation] of [
      ["virtual", "para que una subclase pueda redefinirlo"],
      ["override", "para redefinir el de la clase base"],
      ["abstract", "para dejar la implementación a las subclases"],
      ["static", "porque pertenece a la clase, no a cada objeto"],
    ] as const) {
      if (method[flag] && !member.modifiers.includes(flag)) {
        failures.push(
          `El método \`${method.name}\` de \`${required.name}\` debe declararse \`${flag}\` ${explanation}.`,
        );
      }
    }
  }

  for (const ctor of required.constructors ?? []) {
    const candidates = found.members.filter((m) => m.kind === "constructor");
    if (candidates.length === 0) {
      failures.push(
        `\`${required.name}\` necesita un constructor: el objeto tiene que nacer válido, no llenarse a mano después.`,
      );
      continue;
    }
    const member =
      candidates.find(
        (m) =>
          (ctor.paramCount === undefined || m.paramCount === ctor.paramCount) &&
          (!ctor.callsBase || m.callsBase),
      ) ?? null;

    if (!member) {
      if (ctor.paramCount !== undefined) {
        failures.push(
          `\`${required.name}\` necesita un constructor con ${ctor.paramCount} ${
            ctor.paramCount === 1 ? "parámetro" : "parámetros"
          }.`,
        );
      }
      if (ctor.callsBase) {
        failures.push(
          `El constructor de \`${required.name}\` debe encadenar con la base: \`: base(...)\`.`,
        );
      }
      continue;
    }
    if (ctor.visibility && visibilityOf(member) !== ctor.visibility) {
      failures.push(
        `El constructor de \`${required.name}\` debe ser \`${ctor.visibility}\`.`,
      );
    }
  }

  for (const relation of required.notStores ?? []) {
    const stored = found.members.some(
      (m) =>
        (m.kind === "field" || m.kind === "property") &&
        typeMatches(m.type, relation.type),
    );
    if (stored) {
      failures.push(
        `\`${required.name}\` NO debe guardar un \`${relation.type}\`: aquí la relación es una dependencia — lo recibe como parámetro, lo usa y lo suelta.`,
      );
    }
  }

  for (const relation of required.stores ?? []) {
    const stored = found.members.some(
      (m) =>
        (m.kind === "field" || m.kind === "property") &&
        typeMatches(m.type, relation.type),
    );
    if (!stored) {
      failures.push(
        `\`${required.name}\` debe GUARDAR la referencia a \`${relation.type}\`: un campo o propiedad de ese tipo. Recibirlo sólo como parámetro es una dependencia, no una asociación.`,
      );
    }
  }
}

function pick(
  cls: ParsedClass,
  kinds: ParsedMember["kind"][],
  name: string,
): ParsedMember | null {
  return (
    cls.members.find((m) => kinds.includes(m.kind) && m.name === name) ?? null
  );
}

function visibilityOf(member: ParsedMember): Visibility {
  for (const v of ["public", "protected", "internal", "private"] as const) {
    if (member.modifiers.includes(v)) return v;
  }
  // En C# un miembro sin modificador es privado.
  return "private";
}

function checkVisibility(
  className: string,
  memberName: string,
  label: string,
  expected: Visibility | undefined,
  member: ParsedMember,
  failures: string[],
): void {
  if (!expected) return;
  const actual = visibilityOf(member);
  if (actual === expected) return;
  failures.push(
    `El ${label} \`${memberName}\` de \`${className}\` debe ser \`${expected}\` (ahora es \`${actual}\`).`,
  );
}

function checkGeneric(
  className: string,
  generic: NonNullable<ClassRequirement["generic"]>,
  found: ParsedClass,
  failures: string[],
): void {
  if (generic.arity !== undefined && found.typeParams.length !== generic.arity) {
    const plural = generic.arity === 1 ? "parámetro" : "parámetros";
    failures.push(
      found.typeParams.length === 0
        ? `\`${className}\` debe ser genérica, con ${generic.arity} ${plural} de tipo (p. ej. \`${className}<T>\`).`
        : `\`${className}\` debe declarar ${generic.arity} ${plural} de tipo (ahora tiene ${found.typeParams.length}).`,
    );
  }

  for (const constraint of generic.constraints ?? []) {
    const declared = found.constraints.find((c) => c.param === constraint.param);
    if (!declared) {
      failures.push(
        `\`${className}\` necesita la restricción \`where ${constraint.param} : ${constraint.types.join(", ")}\`.`,
      );
      continue;
    }
    const missing = constraint.types.filter((t) => !declared.types.includes(t));
    if (missing.length > 0) {
      failures.push(
        `La restricción de \`${constraint.param}\` en \`${className}\` debe incluir \`${missing.join(", ")}\` (ahora es \`where ${constraint.param} : ${declared.types.join(", ")}\`).`,
      );
    }
  }
}

function checkPropertyAccessors(
  className: string,
  prop: PropertyRequirement,
  member: ParsedMember,
  failures: string[],
): void {
  if (prop.getVisibility) {
    const get = member.accessors?.find((a) => a.kind === "get");
    const actual = get?.visibility ?? visibilityOf(member);
    if (actual !== prop.getVisibility) {
      failures.push(
        `El \`get\` de \`${prop.name}\` en \`${className}\` debe ser \`${prop.getVisibility}\` (ahora es \`${actual}\`).`,
      );
    }
  }

  if (prop.setVisibility) {
    const set = member.accessors?.find((a) => a.kind === "set" || a.kind === "init");
    if (!set) {
      failures.push(
        `La propiedad \`${prop.name}\` de \`${className}\` necesita un setter \`${prop.setVisibility}\` (\`{ get; ${prop.setVisibility} set; }\`); ahora no tiene setter.`,
      );
      return;
    }
    const actual = set.visibility ?? visibilityOf(member);
    if (actual !== prop.setVisibility) {
      failures.push(
        `El \`set\` de \`${prop.name}\` en \`${className}\` debe ser \`${prop.setVisibility}\` (ahora es \`${actual}\`). Con \`{ get; set; }\` cualquiera podría modificarlo desde fuera.`,
      );
    }
  }
}

function checkType(
  className: string,
  memberName: string,
  label: string,
  expected: string | undefined,
  member: ParsedMember,
  failures: string[],
): void {
  if (!expected) return;
  if (typeMatches(member.type, expected)) return;
  failures.push(
    `El ${label} \`${memberName}\` de \`${className}\` debe ser de tipo \`${expected}\`.`,
  );
}

/**
 * `List<Bicicleta>` cuenta como guardar un `Bicicleta`; `int` no cuenta
 * como `Bicicleta`. La comparación es por palabra completa y respeta
 * mayúsculas: en C# `Nombre` y `nombre` son cosas distintas.
 */
function typeMatches(declared: string, expected: string): boolean {
  const normalize = (t: string) => t.replace(/\s+/g, "");
  const d = normalize(declared);
  const e = normalize(expected);
  if (d === e) return true;
  if (d.replace(/\?$/, "") === e) return true;
  const escaped = e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^A-Za-z0-9_])${escaped}([^A-Za-z0-9_]|$)`).test(d);
}
