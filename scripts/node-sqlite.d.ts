// `node:sqlite` es experimental desde Node 22.5 (sin dependencias
// externas). `@types/node` en este repo está fijado en la línea 20 y no
// trae sus tipos todavía. Declaración ambiental mínima con SÓLO lo que
// `scripts/verify-content.ts` usa — la incompatibilidad real es de versión
// de TIPOS, no de runtime: `node --version` en este entorno ya es 22.x y el
// módulo existe.
declare module "node:sqlite" {
  export class StatementSync {
    /**
     * Filas como ARRAY posicional en vez de objeto por nombre de columna.
     * Necesario: dos columnas con el mismo nombre (`a.nombre, b.nombre`)
     * colisionarían en un solo objeto JS y perderían una — sqlite3 CLI no
     * tiene ese problema porque imprime por posición, no por nombre.
     */
    setReturnArrays(value: boolean): void;
    all(): unknown[][];
  }
  export class DatabaseSync {
    constructor(location: string);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
