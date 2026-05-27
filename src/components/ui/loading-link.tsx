"use client";

import * as React from "react";
import Link, { useLinkStatus } from "next/link";

import { cn } from "@/lib/utils";
import {
  decrementPending,
  incrementPending,
} from "@/lib/nav-progress-store";

type NextLinkProps = React.ComponentProps<typeof Link>;

interface LoadingLinkProps extends Omit<NextLinkProps, "children"> {
  children: React.ReactNode;
  /** Renders an inline pulsing dot next to the children while pending. */
  showHint?: boolean;
  /** Optional className for the trailing dot. */
  hintClassName?: string;
}

/**
 * Drop-in replacement for next/link that:
 * 1. Reports pending state to the global navigation store, so the
 *    top progress bar appears while routes load.
 * 2. Optionally renders an inline animated dot inside the link.
 *
 * The inner <Reporter /> must live as a descendant of <Link> so it
 * can call useLinkStatus(). This is the official Next 16 pattern.
 */
export function LoadingLink({
  children,
  showHint = true,
  hintClassName,
  ...linkProps
}: LoadingLinkProps) {
  return (
    <Link {...linkProps}>
      {children}
      <Reporter hint={showHint} hintClassName={hintClassName} />
    </Link>
  );
}

function Reporter({
  hint,
  hintClassName,
}: {
  hint: boolean;
  hintClassName?: string;
}) {
  const { pending } = useLinkStatus();

  // Report to global store. Wrapped in effect to avoid setState-in-render
  // and to be tracked across mount/unmount.
  React.useEffect(() => {
    if (!pending) return;
    incrementPending();
    return () => {
      decrementPending();
    };
  }, [pending]);

  if (!hint) return null;

  return (
    <span
      aria-hidden
      data-pending={pending || undefined}
      className={cn(
        "ml-1.5 inline-block size-1.5 rounded-full bg-current align-middle opacity-0",
        "transition-opacity duration-150",
        "data-[pending]:opacity-70 data-[pending]:animate-pulse-soft",
        hintClassName,
      )}
    />
  );
}
