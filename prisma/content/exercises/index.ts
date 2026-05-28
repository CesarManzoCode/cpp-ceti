import type { PracticeUnitSetDefinition } from "./types";

import { u01PrimerProgramaExercises } from "./u01-primer-programa";
import { u02CinExercises } from "./u02-cin";
import { u03VariablesExercises } from "./u03-variables";
import { u04ControlFlujoExercises } from "./u04-control-flujo";
import { u05LoopsExercises } from "./u05-loops";
import { u06FuncionesExercises } from "./u06-funciones";
import { u07PrintfScanfExercises } from "./u07-printf-scanf";
import { u08ArreglosExercises } from "./u08-arreglos";
import { u09ArchivosExercises } from "./u09-archivos";
import { u10MatricesExercises } from "./u10-matrices";

/**
 * Registro de todos los conjuntos de ejercicios de práctica.
 * El orden aquí determina el orden de aparición en la UI.
 *
 * Vamos llenando por unidades — cada vez que una unidad queda completa,
 * la agregamos aquí.
 */
export const allPracticeSets: PracticeUnitSetDefinition[] = [
  u01PrimerProgramaExercises,
  u02CinExercises,
  u03VariablesExercises,
  u04ControlFlujoExercises,
  u05LoopsExercises,
  u06FuncionesExercises,
  u07PrintfScanfExercises,
  u08ArreglosExercises,
  u09ArchivosExercises,
  u10MatricesExercises,
];
