import { defineLesson } from "../../../../../authoring";
import { MYSQL_LOCAL_LAB_GUIDE } from "../../../shared/local-lab-guides";

export const leccion03 = defineLesson({
  slug: "create-procedure-mysql",
  title: "CREATE PROCEDURE en MySQL",
  description: "Leer un procedimiento real como laboratorio local.",
  estimatedMinutes: 15,
  xpReward: 45,
  steps: [
    {
      type: "theory",
      markdown: `MySQL implementa procedimientos con sintaxis propia. SQLite no los soporta; por eso el ejemplo es local-only y no se adapta artificialmente.`,
    },
    {
      type: "theory",
      markdown: MYSQL_LOCAL_LAB_GUIDE,
    },
    {
      type: "code_example",
      code: `DELIMITER //
CREATE PROCEDURE cerrar_ticket(IN p_id INT)
BEGIN
 UPDATE ticket SET estado='CERRADO' WHERE id=p_id;
END//
DELIMITER ;
CALL cerrar_ticket(10);`,
      explanation: "Define e invoca una operación.",
      runnable: false,
      localOnlyNote: "Requiere MySQL 8.x local — ver el paso anterior para crear la base y correrlo.",
    },
    {
      type: "quiz",
      question: "¿Por qué runnable:false?",
      options: [
        "Seguridad",
        "SQLite no soporta CREATE PROCEDURE",
        "UPDATE no existe",
        "MySQL no usa SQL",
      ],
      correctIndex: 1,
      explanation: "No ejecutar sintaxis específica contra otro SGBD.",
    },
    {
      type: "matching",
      pairs: [
        { left: "CREATE PROCEDURE", right: "Definir" },
        { left: "CALL", right: "Invocar" },
        { left: "IN p_id", right: "Entrada" },
        { left: "UPDATE", right: "Efecto" },
      ],
      explanation: "Reconoce estructura.",
    },
  ],
});
