export function Icon({ label }: { label: string }) {
  const icon = getHomeServiceIcon(label);

  return (
    <span className={`icon-chip icon-chip-${icon}`} aria-hidden="true">
      <svg viewBox="0 0 32 32">{homeServicePaths[icon]}</svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

const homeServicePaths = {
  infrastructure: (
    <>
      <path d="M8 25 H24" />
      <path d="M11 25 L16 7 L21 25" />
      <path d="M13 18 H19 M14 14 H18 M15.2 10 H16.8" />
      <path d="M6 12 C9 8.5, 23 8.5, 26 12" />
      <path d="M4 8 C8.5 3.5, 23.5 3.5, 28 8" />
      <circle cx="16" cy="7" r="1.6" />
    </>
  ),
  fibre: (
    <>
      <path d="M5 21 C11 12, 17 24, 27 9" />
      <path d="M5 26 C12 18, 18 29, 27 17" />
      <path d="M8 15 C12 18, 16 18, 20 14" />
      <circle cx="7.5" cy="21" r="2" />
      <circle cx="24.5" cy="12" r="2" />
    </>
  ),
  connectivity: (
    <>
      <path d="M6 13 C11 8, 21 8, 26 13" />
      <path d="M10 18 C13 15, 19 15, 22 18" />
      <path d="M14 23 C15 22, 17 22, 18 23" />
      <circle cx="16" cy="26" r="1.8" />
      <path d="M7 25 H11 M21 25 H25" />
    </>
  ),
  security: (
    <>
      <path d="M16 4 L25 8 V15 C25 22, 20.5 26.5, 16 28 C11.5 26.5, 7 22, 7 15 V8 Z" />
      <path d="M12 16 L15 19 L21 12" />
      <path d="M10 8.8 C13.5 7.2, 18.5 7.2, 22 8.8" />
    </>
  ),
};

type HomeServiceIcon = keyof typeof homeServicePaths;

function getHomeServiceIcon(label: string): HomeServiceIcon {
  const value = label.toLowerCase();

  if (value.includes("fibre") || value.includes("fiber")) return "fibre";
  if (value.includes("connectivity") || value.includes("enterprise")) return "connectivity";
  if (value.includes("security") || value.includes("support") || value.includes("quality")) return "security";
  return "infrastructure";
}
