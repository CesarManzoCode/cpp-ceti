-- "Reportar un bug" (rail y perfil) dejó de apuntar a GitHub y ahora abre el
-- mismo widget de Feedback que discrepancia/confuso/idea/elogio. Necesita su
-- propio valor de kind para no mezclarse con "other".
--
-- ALTER TYPE ... ADD VALUE es seguro (idempotente con IF NOT EXISTS) y el
-- valor nuevo no se usa en esta misma migración.
ALTER TYPE "FeedbackKind" ADD VALUE IF NOT EXISTS 'bug';
