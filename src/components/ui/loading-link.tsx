"use client";

import * as React from "react";
import Link from "next/link";

type NextLinkProps = React.ComponentProps<typeof Link>;

interface LoadingLinkProps extends Omit<NextLinkProps, "children"> {
  children: React.ReactNode;
  /**
   * Deprecated, accepted for backwards-compat. The previous implementation
   * rendered an inline pending dot via useLinkStatus, but that pattern
   * broke when composed inside <Button asChild> (Radix Slot cloning +
   * Next 16 link-status context caused some navigations to hang).
   * Visual feedback is now provided by route-level loading.tsx files and
   * the global NavigationProgress bar.
   */
  showHint?: boolean;
  /** Deprecated, no-op (see above). */
  hintClassName?: string;
}

/**
 * Thin pass-through to next/link. Kept as a separate component so we
 * can centrally evolve link behavior later without touching call sites.
 */
export function LoadingLink(props: LoadingLinkProps) {
  // Strip the deprecated visual-hint props before forwarding so they
  // don't end up as unknown attributes on the <a>.
  const { showHint, hintClassName, ...linkProps } = props;
  void showHint;
  void hintClassName;
  return <Link {...linkProps} />;
}
