import type { PracticeUnitSetDefinition } from "../types";

import { u01ModelarExercises } from "./u01-modelar";
import { u02EncapsularExercises } from "./u02-encapsular";
import { u03UmlExercises } from "./u03-uml";
import { u04RelacionesExercises } from "./u04-relaciones";
import { u05HerenciaExercises } from "./u05-herencia";
import { u06DisenoRobustoExercises } from "./u06-diseno-robusto";
import { u07GuiExercises } from "./u07-gui";
import { u08IntegradorExercises } from "./u08-integrador";

/**
 * Banco de práctica de POO I — C#. Cuatro ejercicios por unidad, en el
 * orden en que aparecen en la UI.
 */
export const csharpPracticeSets: PracticeUnitSetDefinition[] = [
  u01ModelarExercises,
  u02EncapsularExercises,
  u03UmlExercises,
  u04RelacionesExercises,
  u05HerenciaExercises,
  u06DisenoRobustoExercises,
  u07GuiExercises,
  u08IntegradorExercises,
];
