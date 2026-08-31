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
});

export const structureContractSchema = z.object({
  /** Clases que el código DEBE declarar, con sus miembros mínimos. */
  classes: z.array(classSchema).min(1),
});

export type StructureContract = z.infer<typeof structureContractSchema>;
export type ClassRequirement = z.infer<typeof classSchema>;

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
