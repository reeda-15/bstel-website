import { getServiceIconKey } from "@/lib/service-icon";

const paths = {
  fibre: (
    <>
      <path d="M5 21 C10 13, 17 25, 27 10" />
      <path d="M5 26 C12 18, 17 29, 27 17" />
      <circle cx="8" cy="20" r="2" />
      <circle cx="24" cy="13" r="2" />
    </>
  ),
  tower: (
    <>
      <path d="M10 27 L16 7 L22 27" />
      <path d="M12 20 H20 M13 15 H19 M15 10 H17" />
      <path d="M7 11 C10 7, 22 7, 25 11 M5 7 C10 2, 22 2, 27 7" />
    </>
  ),
  shield: (
    <>
      <path d="M16 4 L26 8 V15 C26 22, 21 27, 16 29 C11 27, 6 22, 6 15 V8 Z" />
      <path d="M11 16 L15 20 L22 12" />
    </>
  ),
  wifi: (
    <>
      <path d="M6 13 C11 8, 21 8, 26 13" />
      <path d="M10 18 C13 15, 19 15, 22 18" />
      <path d="M14 23 C15 22, 17 22, 18 23" />
      <circle cx="16" cy="26" r="1.8" />
    </>
  ),
  cctv: (
    <>
      <path d="M6 12 L22 8 L25 17 L9 21 Z" />
      <path d="M22 17 L26 22 M13 21 L13 27 M9 27 H18" />
      <circle cx="15" cy="14" r="2" />
    </>
  ),
  hdd: (
    <>
      <path d="M5 23 C12 17, 20 17, 27 23" />
      <path d="M8 18 H18 L24 12" />
      <path d="M20 10 L27 12 L22 17" />
      <circle cx="8" cy="23" r="2" />
      <circle cx="24" cy="23" r="2" />
    </>
  ),
  noc: (
    <>
      <rect x="6" y="7" width="20" height="14" rx="2" />
      <path d="M10 16 L14 12 L18 16 L22 10" />
      <path d="M12 25 H20 M16 21 V25" />
    </>
  ),
  data: (
    <>
      <path d="M8 9 H24 M8 16 H24 M8 23 H24" />
      <circle cx="8" cy="9" r="2" />
      <circle cx="24" cy="16" r="2" />
      <circle cx="8" cy="23" r="2" />
    </>
  ),
};

export function ServiceIcon({ name }: { name: string }) {
  const iconKey = getServiceIconKey(name);

  return (
    <span className={`service-icon service-icon-${iconKey}`} aria-hidden="true">
      <svg viewBox="0 0 32 32">{paths[iconKey]}</svg>
    </span>
  );
}
