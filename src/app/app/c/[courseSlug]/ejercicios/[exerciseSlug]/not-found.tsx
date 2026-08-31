import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/shared/status-message";

export default function PracticeNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <StatusMessage
        code="error 404"
        title="Ejercicio no encontrado."
        description="Quizá lo despublicaron o cambió de dirección."
      >
        <Button asChild size="lg">
          <Link href="/app">Volver a tus cursos</Link>
        </Button>
      </StatusMessage>
    </div>
  );
}
