"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Sesión cerrada.");
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <Button variant="outline" onClick={handleSignOut}>
      <LogOut className="size-4" />
      Cerrar sesión
    </Button>
  );
}
