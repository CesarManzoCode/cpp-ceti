"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

interface MarkdownProps {
  children: string;
  className?: string;
}

/**
 * Renderizador de markdown con estilos consistentes con el design system.
 * Code blocks usan la paleta de Monaco para uniformidad visual.
 */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose-text max-w-none text-base leading-relaxed text-foreground",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 text-3xl font-bold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 text-2xl font-semibold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 text-xl font-semibold first:mt-0">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="my-4 text-base leading-relaxed text-foreground/90 first:mt-0 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-1.5 marker:text-muted-foreground">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-1.5 marker:text-muted-foreground">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed text-foreground/90">{children}</li>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-primary/60 bg-primary/5 px-4 py-2 italic text-foreground/80">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="my-8 border-border" />,
          code: ({ className: c, children, ...props }) => {
            const isBlock = /language-/.test(c ?? "");
            if (isBlock) {
              return (
                <code className={cn("font-mono text-sm", c)} {...props}>
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
          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--terminal-border)] bg-terminal p-4 font-mono text-[13px] leading-relaxed text-terminal-fg">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-6 w-full overflow-x-auto rounded-[var(--radius-md)] border border-border">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface-2/60 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-3 py-2 text-sm">
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
