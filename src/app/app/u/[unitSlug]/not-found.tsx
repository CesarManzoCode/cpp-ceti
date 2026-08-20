import Link from "next/link";

import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/shared/status-message";

export default function UnitNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-12">
      <StatusMessage
        code="error 404"
        title="Esta unidad no existe."
        description="Quizá la URL está mal escrita o la unidad aún no se publicó."
      >
        <Button asChild size="lg">
          <Link href="/app">Volver a mi camino</Link>
        </Button>
      </StatusMessage>
    </div>
  );
}
