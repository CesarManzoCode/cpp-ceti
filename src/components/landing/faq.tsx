import { Plus } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";

const faqs = [
  {
    q: "¿Cuánto cuesta?",
    a: "Nada. Es 100% gratis para los estudiantes del CETI Guadalajara. Sin tarjeta, sin trial, sin sorpresas.",
  },
  {
    q: "¿Tengo que instalar algo?",
    a: "No. Todo corre en el navegador — el editor de código, el compilador y los ejercicios. Solo necesitas internet y una cuenta.",
  },
  {
    q: "¿Funciona en el celular?",
    a: "Sí, las lecciones de teoría y quizzes son cómodas en móvil. Los retos de código se sienten mejor en laptop o tablet con teclado.",
  },
  {
    q: "¿Es un curso oficial del CETI?",
    a: "No. Es un proyecto independiente hecho por estudiantes, basado en el temario público de la materia de C++. La escuela no está involucrada.",
  },
  {
    q: "¿Voy a aprobar la materia si lo uso?",
    a: "No prometemos que apruebes — eso depende de ti. Pero te damos algo que la escuela no: práctica real con feedback inmediato. Si haces los ejercicios, vas a entender el código mucho mejor.",
  },
  {
    q: "¿Qué pasa si me atoro en un ejercicio?",
    a: "Cada reto tiene pistas que puedes ver una por una, y los tests te muestran exactamente qué entrada falló. No te dejamos a oscuras.",
  },
  {
    q: "¿Quién está detrás de esto?",
    a: "Es un proyecto independiente. Si encuentras un bug o tienes una idea, puedes reportarla en GitHub.",
  },
];

export function Faq() {
  return (
    <section
      id="preguntas"
      className="border-b border-border/60 py-20 lg:py-28"
    >
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="dudas"
          title="Preguntas que se hace todo mundo."
          description="Si la tuya no está aquí, escríbenos."
          className="mx-auto items-center"
        />

        <div className="mt-14 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group p-5 transition-colors open:bg-surface-2/40 sm:p-6 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <h3 className="text-[15px] font-semibold tracking-tight sm:text-[17px]">
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-[transform,background-color,border-color,color] duration-200 group-open:rotate-45 group-open:border-primary group-open:bg-primary group-open:text-primary-foreground"
                >
                  <Plus className="size-3.5" strokeWidth={2.5} />
                </span>
              </summary>
              <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿Otra pregunta?{" "}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Abre un issue en GitHub
          </a>
          .
        </p>
      </div>
    </section>
  );
}
