// =====================================================================
// Guía compartida y mínima para los laboratorios locales de MySQL y
// MongoDB. CPP-CETI no provee estos motores en línea (el editor web sólo
// ejecuta SQLite) ni asume que CETI da un entorno preconfigurado, así que
// cada lección local-only debe dejar al alumno una ruta accionable por sí
// misma. Este módulo evita repetir esas mismas cinco preguntas
// (motor/entorno/crear-seleccionar-base/ejecutar/comprobar) en cada
// lección de las unidades 11, 12, 14, 15, 16 y 19.
//
// NO es un tutorial de instalación: da lo mínimo para levantar el motor
// (paquete o contenedor) y correr el ejercicio de la lección.
// =====================================================================

export const MYSQL_LOCAL_LAB_GUIDE = `## Laboratorio local: MySQL

Este bloque requiere **MySQL 8.x** corriendo en tu máquina — el editor web de CPP-CETI sólo ejecuta SQLite, así que esto NO corre ahí.

1. **Levanta el motor.** Instala \`mysql-server\` con el paquete de tu sistema, o usa un contenedor: \`docker run --name ceti-mysql -e MYSQL_ROOT_PASSWORD=ceti -p 3306:3306 -d mysql:8\`.
2. **Conéctate** con el cliente \`mysql\` (o MySQL Workbench): \`mysql -h 127.0.0.1 -u root -p\`.
3. **Crea/selecciona la base de trabajo:** \`CREATE DATABASE IF NOT EXISTS ceti_lab; USE ceti_lab;\`.
4. **Ejecuta el código de este bloque** tal cual, contra esa base.
5. **Comprueba el resultado esencial** con un \`SHOW\`/\`SELECT\` que confirme el efecto (p. ej. \`SHOW PROCEDURE STATUS WHERE Db='ceti_lab';\`, \`SHOW TRIGGERS;\`, \`SHOW EVENTS;\` o un \`SELECT\` sobre la tabla afectada, según lo que estés practicando).`;

export const MONGODB_LOCAL_LAB_GUIDE = `## Laboratorio local: MongoDB

Este bloque requiere **MongoDB local** — el editor web de CPP-CETI sólo ejecuta SQLite, así que esto NO corre ahí.

1. **Levanta el motor.** Instala MongoDB Community Server, o usa un contenedor: \`docker run --name ceti-mongo -p 27017:27017 -d mongo:7\`.
2. **Conéctate** con \`mongosh\` (MongoDB Shell): \`mongosh "mongodb://localhost:27017"\`.
3. **Selecciona/crea la base de trabajo:** \`use ceti_lab\` (MongoDB la crea sola en el primer insert).
4. **Ejecuta el comando de este bloque** tal cual, dentro de \`mongosh\`.
5. **Comprueba el resultado esencial** con \`db.<coleccion>.find()\` o \`db.<coleccion>.countDocuments()\` sobre la colección afectada.`;
