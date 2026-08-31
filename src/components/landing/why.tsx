import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const problems = [
  {
    title: "Ver no es lo mismo que escribir",
    body: "Seguir un ejemplo en clase es el primer paso. Escribir el código tú mismo —equivocarte y corregir— es lo que hace que el concepto se quede.",
  },
  {
    title: "Mimo no tiene tu materia",
    body: "Sololearn, Codecademy, Mimo — ninguna sigue el temario que llevas en el CETI. Y menos en español.",
  },
  {
    title: "Repasa a tu ritmo",
    body: "Si un tema no te cayó a la primera, aquí lo practicas las veces que necesites, con pistas y feedback inmediato.",
  },
];

export function Why() {
  return (
    <section id="por-que" className="border-b border-border py-14 lg:py-18">
      <Reveal className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          eyebrow="La idea"
          title={
            <>
              ¿Un tema de la materia no te quedó claro?{" "}
              <span className="text-muted-foreground">
                Aquí lo practicas hasta dominarlo.
              </span>
            </>
          }
        />

        {/* Tres argumentos, separados por filetes verticales en desktop.
            No son features ni van en tarjetas: es el razonamiento del
            producto, así que se lee como texto. */}
        <ul className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-3 md:gap-0 md:divide-x md:divide-border">
          {problems.map((p) => (
            <li key={p.title} className="md:px-7 md:first:pl-0 md:last:pr-0">
              <h3 className="text-[17px] font-semibold leading-snug">
                {p.title}
              </h3>
              <p className="mt-2.5 max-w-[42ch] text-[15px] leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
