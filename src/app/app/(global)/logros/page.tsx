import { redirect } from "next/navigation";

/**
 * Logros pasó a vivir dentro de `/app/perfil` (Fase 4, reorganización de
 * nav: Inicio / Práctica / Liga / Amigos / Perfil). Este redirect
 * permanente preserva cualquier marcador o enlace compartido viejo.
 */
export default function LogrosRedirect() {
  redirect("/app/perfil#logros");
}
