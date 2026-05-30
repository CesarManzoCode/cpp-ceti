import { User as UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface FriendAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
}

export function FriendAvatar({ name, image, className }: FriendAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Avatar className={cn("size-10 ring-1 ring-border ring-inset", className)}>
      {image ? <AvatarImage src={image} alt={name} /> : null}
      <AvatarFallback className="bg-primary-soft text-sm font-semibold text-primary-soft-foreground">
        {initials || <UserIcon className="size-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
