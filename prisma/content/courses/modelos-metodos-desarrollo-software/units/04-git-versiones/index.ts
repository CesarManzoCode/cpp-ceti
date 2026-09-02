import { defineUnit } from "../../../../authoring";

import { leccion01 } from "./lessons/01-repositorio-snapshot";
import { leccion02 } from "./lessons/02-status-add-commit";
import { leccion03 } from "./lessons/03-ramas-integracion";
import { leccion04 } from "./lessons/04-repositorio-evidencia";

export const mmGitVersiones = defineUnit({
  slug: "mm-04-git-versiones",
  title: "Git y control de versiones",
  description:
    "Explica los conceptos y hábitos de Git —snapshots, staging, ramas y conflictos— como lectura de estado y toma de decisiones, no como retos de código.",
  icon: "🌿",
  published: true,
  lessons: [leccion01, leccion02, leccion03, leccion04],
});
