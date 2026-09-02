// Autocompletado de SQL para Monaco. Cubre el subconjunto portable de
// SQLite que enseña Base de Datos I: DDL, DML y las cláusulas de consulta
// usadas en el contenido (SELECT/WHERE/JOIN/GROUP BY/HAVING/ORDER BY).
//
// No es un parser ni un IntelliSense completo de SQL: son sugerencias de
// palabra clave y snippets frecuentes, al mismo nivel que las de C++/C#.

import type { CodeCompletion } from "./types";

export const SQL_COMPLETIONS: CodeCompletion[] = [
  // DDL
  {
    label: "CREATE TABLE",
    kind: "snippet",
    insert: "CREATE TABLE ${1:tabla}(\n  ${2:id} INTEGER PRIMARY KEY,\n  $0\n);",
    detail: "Define una tabla nueva",
  },
  { label: "PRIMARY KEY", kind: "keyword", insert: "PRIMARY KEY", detail: "Identificador único" },
  { label: "FOREIGN KEY", kind: "snippet", insert: "FOREIGN KEY(${1:col}) REFERENCES ${2:tabla}(${3:id})", detail: "Referencia a otra tabla" },
  { label: "NOT NULL", kind: "keyword", insert: "NOT NULL", detail: "Obligatorio" },
  { label: "UNIQUE", kind: "keyword", insert: "UNIQUE", detail: "Valor único" },
  { label: "CHECK", kind: "snippet", insert: "CHECK(${1:condicion})", detail: "Restricción local" },
  { label: "ALTER TABLE", kind: "snippet", insert: "ALTER TABLE ${1:tabla} ADD COLUMN ${2:columna} ${3:TEXT};", detail: "Modifica la estructura" },
  { label: "DROP TABLE", kind: "snippet", insert: "DROP TABLE ${1:tabla};", detail: "Elimina la tabla" },

  // Tipos
  { label: "INTEGER", kind: "type", insert: "INTEGER", detail: "Número entero" },
  { label: "TEXT", kind: "type", insert: "TEXT", detail: "Cadena de texto" },
  { label: "REAL", kind: "type", insert: "REAL", detail: "Punto flotante" },

  // DML
  {
    label: "INSERT INTO",
    kind: "snippet",
    insert: "INSERT INTO ${1:tabla}(${2:columnas}) VALUES(${3:valores});",
    detail: "Agrega filas",
  },
  {
    label: "UPDATE",
    kind: "snippet",
    insert: "UPDATE ${1:tabla} SET ${2:columna}=${3:valor} WHERE ${4:condicion};",
    detail: "Modifica filas existentes",
  },
  {
    label: "DELETE FROM",
    kind: "snippet",
    insert: "DELETE FROM ${1:tabla} WHERE ${2:condicion};",
    detail: "Elimina filas",
  },

  // Consultas
  {
    label: "SELECT",
    kind: "snippet",
    insert: "SELECT ${1:columnas} FROM ${2:tabla} WHERE ${3:condicion} ORDER BY ${4:columna};",
    detail: "Consulta filas",
  },
  { label: "FROM", kind: "keyword", insert: "FROM", detail: "Fuente de datos" },
  { label: "WHERE", kind: "keyword", insert: "WHERE", detail: "Filtra filas" },
  { label: "ORDER BY", kind: "keyword", insert: "ORDER BY", detail: "Ordena resultados" },
  {
    label: "JOIN",
    kind: "snippet",
    insert: "JOIN ${1:tabla} ON ${1:tabla}.${2:id}=${3:otra}.${4:fk}",
    detail: "Combina tablas relacionadas",
  },
  { label: "GROUP BY", kind: "keyword", insert: "GROUP BY", detail: "Agrupa filas" },
  { label: "HAVING", kind: "keyword", insert: "HAVING", detail: "Filtra grupos" },
  { label: "DISTINCT", kind: "keyword", insert: "DISTINCT", detail: "Elimina duplicados" },
  { label: "COUNT", kind: "function", insert: "COUNT(${1:*})", detail: "Cuenta filas" },
  { label: "SUM", kind: "function", insert: "SUM(${1:columna})", detail: "Suma valores" },
  { label: "AVG", kind: "function", insert: "AVG(${1:columna})", detail: "Promedio" },
  { label: "MIN", kind: "function", insert: "MIN(${1:columna})", detail: "Valor mínimo" },
  { label: "MAX", kind: "function", insert: "MAX(${1:columna})", detail: "Valor máximo" },
  { label: "UNION", kind: "keyword", insert: "UNION", detail: "Combina resultados sin duplicados" },
  { label: "EXCEPT", kind: "keyword", insert: "EXCEPT", detail: "Diferencia de conjuntos" },

  { label: "PRAGMA foreign_keys", kind: "snippet", insert: "PRAGMA foreign_keys=ON;", detail: "Activa integridad referencial" },
];
