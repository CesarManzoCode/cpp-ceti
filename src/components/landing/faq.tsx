import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

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
    a: "No prometemos que apruebes — eso depende de ti. Lo que sí te damos es un lugar para practicar lo que ves en clase: ejercicios reales con feedback inmediato. Si haces los ejercicios, vas a entender el código mucho mejor.",
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
    <section id="preguntas" className="border-b border-border py-14 lg:py-20">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="Dudas"
          title="Preguntas que se hace todo mundo."
        />

        {/* `details` nativo: cero JavaScript, funciona sin hidratar y el
            teclado lo abre solo. El signo de la derecha es el único
            indicador y cambia de + a −. */}
        <div className="mt-10 max-w-3xl border-y border-border">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group border-b border-border last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-5 py-4 text-left">
                <h3 className="text-[15px] font-medium leading-snug sm:text-base">
                  {f.q}
                </h3>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-base leading-none text-muted-foreground transition-colors group-hover:text-foreground group-open:text-primary"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
          ¿Otra pregunta?{" "}
          <a
            href="https://github.com/CesarManzoCode/cpp-ceti/issues"
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-current"
          >
            Abre un issue en GitHub
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
