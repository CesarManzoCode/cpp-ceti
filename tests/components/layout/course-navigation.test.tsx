// @vitest-environment happy-dom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * Regresión del bug real: cambiar de curso con el switcher (navegación de
 * CLIENTE, sin recargar) dejaba el shell mostrando el curso viejo hasta un
 * hard refresh.
 *
 * La causa era que el shell vivía en `src/app/app/layout.tsx`, compartido
 * por `/app/c/csharp-poo-1` y `/app/c/cpp-desde-cero`: Next preserva un
 * layout así entre navegaciones de cliente cuando el segmento que lo
 * contiene no cambia, así que nunca se volvía a ejecutar con el curso
 * nuevo.
 *
 * El fix mueve el shell a `src/app/app/c/[courseSlug]/layout.tsx`, DENTRO
 * del segmento dinámico: ese layout SÍ se vuelve a montar en cada
 * navegación entre cursos, porque el segmento mismo cambió. Este test
 * ejercita justo eso: invoca el Server Component del layout dos veces con
 * `params.courseSlug` distinto —como lo haría el router en dos
 * navegaciones sucesivas— reutilizando la MISMA sesión/datos de cuenta
 * (`loadAppShellBase`), y verifica que el shell (switcher activo, unidades
 * del sidebar) termina en el curso de CADA llamada, sin arrastrar nada de
 * la anterior. `pickCourse()` no alcanza a probar esto: es lógica pura, no
 * toca el layout ni su remount.
 */

vi.mock("next/navigation", () => ({
  usePathname: () => "/app/c/csharp-poo-1",
  useRouter: () => ({ push: vi.fn() }),
}));

const CPP_COURSE = {
  id: "course-cpp",
  slug: "cpp-desde-cero",
  title: "C++ desde cero",
  description: "",
  subjectName: "C++",
  academicContext: "",
  language: "cpp",
  unitCount: 1,
  lessonCount: 3,
  curriculumSummary: "Semestres 1 y 2",
};

const CSHARP_COURSE = {
  id: "course-csharp",
  slug: "csharp-poo-1",
  title: "Programación Orientada a Objetos I con C#",
  description: "",
  subjectName: "Programación Orientada a Objetos I",
  academicContext: "",
  language: "csharp",
  unitCount: 1,
  lessonCount: 8,
  curriculumSummary: "3.er semestre",
};

const BASE_SHELL_DATA = {
  user: {
    id: "user-1",
    name: "Ana",
    email: "ana@example.com",
    image: null,
    username: "ana",
  },
  courses: [CPP_COURSE, CSHARP_COURSE],
  courseOptions: [
    {
      slug: CPP_COURSE.slug,
      title: CPP_COURSE.title,
      languageLabel: "C++",
      curriculumSummary: CPP_COURSE.curriculumSummary,
    },
    {
      slug: CSHARP_COURSE.slug,
      title: CSHARP_COURSE.title,
      languageLabel: "C#",
      curriculumSummary: CSHARP_COURSE.curriculumSummary,
    },
  ],
  stats: { totalXp: 120, currentStreak: 3, longestStreak: 5 },
  pendingFriendsCount: 0,
  isAdmin: false,
};

vi.mock("@/lib/app-shell", () => ({
  // Misma "sesión" en cada llamada: si el shell dependiera de algo que no
  // sea el param de ruta, las dos navegaciones se verían igual.
  loadAppShellBase: vi.fn(async () => BASE_SHELL_DATA),
}));

vi.mock("@/features/roadmap/queries", () => ({
  getRoadmapUnits: vi.fn(async (courseId: string) => {
    if (courseId === CPP_COURSE.id) {
      return [
        {
          slug: "u1",
          title: "Unidad C++: variables",
          order: 1,
          published: true,
          lessonCount: 3,
          completedCount: 1,
          curriculumSection: null,
        },
      ];
    }
    return [
      {
        slug: "u1",
        title: "Unidad C#: clases",
        order: 1,
        published: true,
        lessonCount: 8,
        completedCount: 2,
        curriculumSection: null,
      },
    ];
  }),
}));

describe("el layout de /app/c/[courseSlug] sigue la URL en navegación de cliente", () => {
  it("dos navegaciones sucesivas (C# → C++) terminan cada una en su propio curso", async () => {
    const { default: CourseAppLayout } = await import(
      "@/app/app/c/[courseSlug]/layout"
    );

    // "Navegación" 1: el alumno está en C#.
    const csharpHtml = renderToStaticMarkup(
      await CourseAppLayout({
        children: <div data-testid="content">contenido C#</div>,
        params: Promise.resolve({ courseSlug: "csharp-poo-1" }),
      }),
    );

    expect(csharpHtml).toContain(
      "Curso actual: Programación Orientada a Objetos I con C#. Cambiar curso",
    );
    expect(csharpHtml).toContain("Unidad C#: clases");
    expect(csharpHtml).not.toContain("Unidad C++: variables");

    // "Navegación" 2: el alumno cambia a C++ con el switcher. Misma sesión
    // de cuenta que arriba (mock sin cambios) — sólo cambia el param de
    // ruta, como lo haría el router al resolver el nuevo segmento.
    const cppHtml = renderToStaticMarkup(
      await CourseAppLayout({
        children: <div data-testid="content">contenido C++</div>,
        params: Promise.resolve({ courseSlug: "cpp-desde-cero" }),
      }),
    );

    expect(cppHtml).toContain("Curso actual: C++ desde cero. Cambiar curso");
    expect(cppHtml).toContain("Unidad C++: variables");
    // El bug real: el shell se quedaba mostrando el curso anterior.
    expect(cppHtml).not.toContain("Programación Orientada a Objetos I con C#");
    expect(cppHtml).not.toContain("Unidad C#: clases");
  });
});
