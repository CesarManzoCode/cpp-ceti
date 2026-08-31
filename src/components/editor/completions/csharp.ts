// Autocompletado de C# para Monaco.
//
// Cubre EXACTAMENTE el subconjunto que enseña el curso de POO I: clases,
// objetos, campos, propiedades, constructores, sobrecarga, modificadores de
// acceso, arreglos fijos, herencia, `abstract`/`virtual`/`override`,
// excepciones, control de flujo y `Console`.
//
// Deliberadamente NO sugiere sintaxis moderna que el perfil del navegador
// (Mono 6.12) no soporta uniformemente o que oscurece la POO en este nivel:
// top-level statements, records, constructores primarios, namespaces con
// ámbito de archivo, anotaciones de nulabilidad, `required`, `init`, LINQ,
// colecciones genéricas, `async`. Eso NO es un juicio sobre C# moderno: es
// el perfil de compatibilidad del curso.

import type { CodeCompletion } from "./types";

export const CSHARP_COMPLETIONS: CodeCompletion[] = [
  // Tipos del subconjunto
  { label: "int", kind: "type", insert: "int", detail: "Entero de 32 bits" },
  { label: "long", kind: "type", insert: "long", detail: "Entero de 64 bits" },
  { label: "double", kind: "type", insert: "double", detail: "Punto flotante" },
  { label: "decimal", kind: "type", insert: "decimal", detail: "Decimal exacto (dinero)" },
  { label: "bool", kind: "type", insert: "bool", detail: "true | false" },
  { label: "char", kind: "type", insert: "char", detail: "Un carácter" },
  { label: "string", kind: "type", insert: "string", detail: "Cadena de texto" },
  { label: "void", kind: "type", insert: "void", detail: "Sin valor de retorno" },

  // Modificadores de acceso y de miembro
  { label: "public", kind: "keyword", insert: "public", detail: "Visible desde fuera" },
  { label: "private", kind: "keyword", insert: "private", detail: "Sólo dentro de la clase" },
  {
    label: "protected",
    kind: "keyword",
    insert: "protected",
    detail: "La clase y sus derivadas",
  },
  { label: "static", kind: "keyword", insert: "static", detail: "De la clase, no de la instancia" },
  { label: "readonly", kind: "keyword", insert: "readonly", detail: "Sólo se asigna al construir" },
  { label: "const", kind: "keyword", insert: "const", detail: "Constante de compilación" },
  { label: "abstract", kind: "keyword", insert: "abstract", detail: "No se puede instanciar" },
  { label: "virtual", kind: "keyword", insert: "virtual", detail: "Se puede sobrescribir" },
  { label: "override", kind: "keyword", insert: "override", detail: "Sobrescribe un miembro virtual" },
  { label: "new", kind: "keyword", insert: "new ", detail: "Crea una instancia" },
  { label: "this", kind: "keyword", insert: "this", detail: "El objeto actual" },
  { label: "base", kind: "keyword", insert: "base", detail: "La clase padre" },
  { label: "return", kind: "keyword", insert: "return ", detail: "Devuelve un valor" },
  { label: "null", kind: "keyword", insert: "null", detail: "Referencia vacía" },
  { label: "true", kind: "keyword", insert: "true" },
  { label: "false", kind: "keyword", insert: "false" },

  // Estructura del programa
  {
    label: "using System;",
    kind: "snippet",
    insert: "using System;",
    detail: "Trae Console y los tipos básicos",
    filterText: "using system",
  },
  {
    label: "Main",
    kind: "snippet",
    insert: "static void Main()\n{\n\t$0\n}",
    detail: "Punto de entrada del programa",
    doc: "Todo programa de consola arranca aquí.",
  },
  {
    label: "program",
    kind: "snippet",
    insert:
      'using System;\n\nclass Program\n{\n\tstatic void Main()\n\t{\n\t\t$0\n\t}\n}',
    detail: "Esqueleto completo de un programa",
    filterText: "plantilla esqueleto",
  },

  // Clases y miembros
  {
    label: "class",
    kind: "snippet",
    insert: "class ${1:Nombre}\n{\n\t$0\n}",
    detail: "Declara una clase",
  },
  {
    label: "class : base",
    kind: "snippet",
    insert: "class ${1:Derivada} : ${2:Base}\n{\n\t$0\n}",
    detail: "Clase que hereda de otra",
    filterText: "herencia extends",
  },
  {
    label: "abstract class",
    kind: "snippet",
    insert:
      "abstract class ${1:Nombre}\n{\n\tpublic abstract ${2:double} ${3:Metodo}();\n\t$0\n}",
    detail: "Clase base que no se instancia",
  },
  {
    label: "ctor",
    kind: "snippet",
    insert:
      "public ${1:Clase}(${2:int valor})\n{\n\tthis.${3:campo} = ${4:valor};\n}",
    detail: "Constructor",
    filterText: "constructor",
  },
  {
    label: "ctor : base",
    kind: "snippet",
    insert:
      "public ${1:Derivada}(${2:string nombre}) : base(${3:nombre})\n{\n\t$0\n}",
    detail: "Constructor que llama al de la clase padre",
    filterText: "constructor base",
  },
  {
    label: "prop",
    kind: "snippet",
    insert:
      "private ${1:string} ${2:campo};\npublic ${1:string} ${3:Propiedad}\n{\n\tget { return ${2:campo}; }\n\tset { ${2:campo} = value; }\n}",
    detail: "Propiedad con campo de respaldo",
    doc: "La forma idiomática de exponer estado sin volverlo público.",
    filterText: "propiedad get set",
  },
  {
    label: "propget",
    kind: "snippet",
    insert:
      "public ${1:string} ${2:Propiedad}\n{\n\tget { return ${3:campo}; }\n}",
    detail: "Propiedad de sólo lectura",
  },
  {
    label: "method",
    kind: "snippet",
    insert: "public ${1:void} ${2:Nombre}(${3})\n{\n\t$0\n}",
    detail: "Método público",
    filterText: "metodo funcion",
  },
  {
    label: "override method",
    kind: "snippet",
    insert:
      "public override ${1:string} ${2:Describir}()\n{\n\treturn ${3:base.${2:Describir}()};\n}",
    detail: "Sobrescribe un método virtual o abstracto",
  },
  {
    label: "ToString",
    kind: "snippet",
    insert:
      'public override string ToString()\n{\n\treturn $"${1:texto}";\n}',
    detail: "Representación en texto del objeto",
  },

  // Console
  {
    label: "Console.WriteLine",
    kind: "function",
    insert: "Console.WriteLine($0);",
    detail: "Imprime con salto de línea",
    filterText: "print imprimir cout",
  },
  {
    label: "Console.Write",
    kind: "function",
    insert: "Console.Write($0);",
    detail: "Imprime sin salto de línea",
  },
  {
    label: "Console.ReadLine",
    kind: "function",
    insert: "Console.ReadLine()",
    detail: "Lee una línea de la entrada",
    filterText: "leer input cin",
  },
  {
    label: "int.Parse",
    kind: "function",
    insert: "int.Parse(${1:Console.ReadLine()})",
    detail: "Convierte texto a entero",
  },
  {
    label: "double.Parse",
    kind: "function",
    insert: "double.Parse(${1:Console.ReadLine()})",
    detail: "Convierte texto a double",
  },
  {
    label: "interp",
    kind: "snippet",
    insert: 'Console.WriteLine($"${1:Texto}: {${2:valor}}");',
    detail: "Interpolación de cadena",
    filterText: "string interpolacion",
  },

  // Control de flujo
  {
    label: "if",
    kind: "snippet",
    insert: "if (${1:condicion})\n{\n\t$0\n}",
    detail: "Condicional",
  },
  {
    label: "ifelse",
    kind: "snippet",
    insert: "if (${1:condicion})\n{\n\t$2\n}\nelse\n{\n\t$0\n}",
    detail: "Condicional con alternativa",
  },
  {
    label: "for",
    kind: "snippet",
    insert: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++)\n{\n\t$0\n}",
    detail: "Ciclo con contador",
  },
  {
    label: "foreach",
    kind: "snippet",
    insert: "foreach (${1:int} ${2:item} in ${3:arreglo})\n{\n\t$0\n}",
    detail: "Recorre un arreglo",
  },
  {
    label: "while",
    kind: "snippet",
    insert: "while (${1:condicion})\n{\n\t$0\n}",
    detail: "Ciclo condicional",
  },
  {
    label: "switch",
    kind: "snippet",
    insert:
      "switch (${1:valor})\n{\n\tcase ${2:1}:\n\t\t$3\n\t\tbreak;\n\tdefault:\n\t\t$0\n\t\tbreak;\n}",
    detail: "Selección múltiple",
  },

  // Arreglos fijos (lo único que el curso usa para varios objetos)
  {
    label: "array",
    kind: "snippet",
    insert: "${1:int}[] ${2:datos} = new ${1:int}[${3:5}];",
    detail: "Arreglo de tamaño fijo",
    filterText: "arreglo",
  },
  {
    label: "array init",
    kind: "snippet",
    insert: "${1:int}[] ${2:datos} = { ${3:1, 2, 3} };",
    detail: "Arreglo con valores iniciales",
  },

  // Excepciones
  {
    label: "try",
    kind: "snippet",
    insert:
      "try\n{\n\t$1\n}\ncatch (${2:Exception} ex)\n{\n\tConsole.WriteLine(ex.Message);\n}",
    detail: "Maneja un error",
    filterText: "trycatch excepcion",
  },
  {
    label: "throw",
    kind: "snippet",
    insert: 'throw new ${1:ArgumentException}("${2:mensaje}");',
    detail: "Lanza una excepción",
  },
  {
    label: "ArgumentException",
    kind: "class",
    insert: "ArgumentException",
    detail: "Argumento inválido",
  },
  {
    label: "InvalidOperationException",
    kind: "class",
    insert: "InvalidOperationException",
    detail: "Operación no válida en este estado",
  },
  {
    label: "Exception",
    kind: "class",
    insert: "Exception",
    detail: "Excepción base",
  },
  { label: "Math", kind: "class", insert: "Math.", detail: "Funciones matemáticas" },
];
