"use client";

import { usePathname } from "next/navigation";
import { contact } from "@/lib/site-data";
import { shouldShowFloatingCta } from "@/lib/floating-cta";

export function FloatingCta() {
  const pathname = usePathname();

  if (!shouldShowFloatingCta(pathname)) return null;

  return (
    <div className="floating-cta" aria-label="Quick contact actions">
      <a className="floating-call" href={contact.phoneHref} aria-label={`Call BSTEL at ${contact.phone}`}>
        <span>Call</span>
      </a>
    </div>
  );
}
