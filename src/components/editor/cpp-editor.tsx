"use client";

/**
 * Compatibilidad: `CppEditor` fue el nombre del editor cuando la plataforma
 * tenía un solo lenguaje. Hoy el componente es `CodeEditor` y recibe el
 * lenguaje del curso. Este re-export existe para que un import viejo no
 * rompa; el código nuevo debe importar `CodeEditor`.
 */
export { CodeEditor, CodeEditor as CppEditor } from "./code-editor";
