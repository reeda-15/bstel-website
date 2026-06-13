import Image from "next/image";
import { getClientLogoClass } from "@/lib/client-logo";
import { clients } from "@/lib/site-data";
import { createLogoMarqueeItems } from "@/lib/logo-marquee";

const marqueeClients = createLogoMarqueeItems(clients);

export function LogoMarquee() {
  return (
    <div className="logo-marquee-wrap">
      <div className="marquee-kicker">Trusted by operators and enterprises</div>
      <div className="client-network-layer" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="partner-highlight" aria-hidden="true">Live network partners</div>
      <div className="logo-marquee" aria-label="BSTEL clients">
        <div className="logo-marquee-track">
          {marqueeClients.map(([name, file], index) => (
            <div className="logo-card marquee-card" key={`${file}-${index}`} aria-hidden={index >= clients.length}>
              <div className="client-logo-box">
                <Image className={getClientLogoClass(file)} src={`/assets/clients/${file}`} alt={index < clients.length ? name : ""} width={170} height={82} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
