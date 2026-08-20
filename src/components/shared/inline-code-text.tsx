import * as React from "react";

/**
 * Los títulos del temario vienen del contenido con `backticks` alrededor de
 * los identificadores de C++ (`#include`, `int main()`…). Aquí se resuelven a
 * código en línea real en vez de mostrarse con los acentos graves crudos.
 * Sólo interpreta backticks — no es un renderizador de markdown.
 */
export function InlineCodeText({ children }: { children: string }) {
  const parts = children.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code key={i} className="code-inline">
            {part.slice(1, -1)}
          </code>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}
