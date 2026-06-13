import Image from "next/image";
import type { CSSProperties } from "react";
import { getClientLogoClass } from "@/lib/client-logo";
import { clients } from "@/lib/site-data";

export function LogoGrid({ limit }: { limit?: number }) {
  const visible = limit ? clients.slice(0, limit) : clients;

  return (
    <div className="logo-grid client-network-grid">
      {visible.map(([name, file], index) => (
        <div className="logo-card" key={`${name}-${file}`} data-reveal style={{ "--reveal-delay": `${Math.min(index * 80, 480)}ms` } as CSSProperties}>
          <div className="client-logo-box">
            <Image className={getClientLogoClass(file)} src={`/assets/clients/${file}`} alt={name} width={170} height={82} />
          </div>
          {file === "one.png" ? <span className="logo-caption">Name to confirm</span> : null}
        </div>
      ))}
    </div>
  );
}
