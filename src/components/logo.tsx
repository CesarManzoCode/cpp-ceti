import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizes = {
    sm: "text-base",
    default: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2 font-semibold", sizes[size], className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary via-primary to-blue-700 text-primary-foreground shadow-md">
        <span className="font-mono text-sm font-bold leading-none">C++</span>
      </span>
      <span className="tracking-tight">
        <span className="text-foreground">C++</span>
        <span className="ml-1 text-muted-foreground">CETI</span>
      </span>
    </div>
  );
}
