"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/shared/code-block";
import type { LanguageId } from "@/lib/code-languages";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
  /**
   * Lenguaje del recurso (el del curso). Sólo decide cómo se resalta un
   * bloque SIN fence: un fence explícito siempre manda. Sin esto, un bloque
   * sin etiqueta en una lección de C# se pintaría como C++.
   */
  language?: LanguageId;
}

/** Extrae el texto plano de los hijos de un nodo de markdown. */
function toText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toText).join("");
  if (typeof node === "object" && "props" in (node as never)) {
    const props = (node as { props?: { children?: React.ReactNode } }).props;
    return toText(props?.children);
  }
  return "";
}

/**
 * El contenido de una lección.
 *
 * Está afinado para leerse largo rato: cuerpo de 17px (18px en
 * pantallas grandes), interlínea 1.72, medida de ~66 caracteres y
 * jerarquía de títulos evidente. El código sale del flujo del texto y
 * se apoya en su propia superficie oscura, así que en ningún momento
 * se confunde una explicación con un programa.
 */
export function Markdown({ children, className, language }: MarkdownProps) {
  return (
    <div
      className={cn(
        "reading max-w-none text-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="reading-measure mb-4 mt-10 text-[26px] font-extrabold leading-tight tracking-[-0.03em] first:mt-0 sm:text-[30px]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="reading-measure mb-3 mt-9 text-[21px] font-extrabold leading-snug tracking-[-0.025em] first:mt-0 sm:text-[24px]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="reading-measure mb-2 mt-7 text-[17px] font-bold leading-snug first:mt-0 sm:text-[19px]">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="reading-measure my-4 first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="reading-measure my-5 ml-1 list-none space-y-2.5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="reading-measure my-5 ml-5 list-decimal space-y-2.5 marker:font-bold marker:text-primary">
              {children}
            </ol>
          ),
          /* La viñeta es un bloque pequeño: el mismo objeto con el que
             el producto dibuja el progreso, aquí a escala de párrafo.
             En listas numeradas el marcador nativo ya cumple. */
          li: ({ children }) => (
            <li className="relative pl-6 leading-[1.7] [ol_&]:pl-1">
              <span
                aria-hidden
                className="absolute left-0 top-[0.62em] size-2 rounded-[2px] bg-primary/45 [ol_&]:hidden"
              />
              {children}
            </li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-semibold text-primary underline decoration-primary/35 decoration-2 underline-offset-4 transition-colors hover:decoration-primary"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="reading-measure my-6 rounded-r-[var(--radius-md)] border-l-4 border-primary bg-primary-tint py-3 pl-5 pr-4 text-foreground [&>p]:my-0">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-9 border-border" />,
          code: ({ className: c, children, ...props }) => {
            const isBlock = /language-/.test(c ?? "");
            if (isBlock) {
              return (
                <code className={cn("font-mono", c)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="code-inline" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => {
            const text = toText(children);
            const child = Array.isArray(children) ? children[0] : children;
            const cls =
              typeof child === "object" && child && "props" in child
                ? ((child as { props?: { className?: string } }).props
                    ?.className ?? "")
                : "";
            const fence = /language-([\w+#-]+)/.exec(cls)?.[1];
            return (
              <CodeBlock
                code={text}
                language={fence}
                defaultLanguage={language}
              />
            );
          },
          table: ({ children }) => (
            <div className="my-7 w-full overflow-x-auto rounded-[var(--radius-lg)] border border-border">
              <table className="w-full border-collapse text-[15px]">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface-2 px-4 py-3 text-left text-[13px] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border px-4 py-3 align-top leading-relaxed last:border-b-0">
              {children}
            </td>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
