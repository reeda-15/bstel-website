export function HeroNetworkGraphic() {
  return (
    <div className="network-graphic" aria-hidden="true">
      <svg viewBox="0 0 520 400" role="img">
        <g className="district-grid">
          {[
            [72, 86],
            [116, 128],
            [178, 78],
            [240, 132],
            [332, 96],
            [398, 148],
            [92, 250],
            [178, 296],
            [294, 256],
            [430, 286],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" />
          ))}
        </g>
        <path className="fibre-line line-one" d="M-40 92 C 100 10, 168 154, 286 98 S 456 48, 580 128" />
        <path className="fibre-line line-two" d="M-20 264 C 104 176, 176 298, 286 228 S 452 176, 560 248" />
        <path className="fibre-line line-three" d="M84 412 C 124 252, 244 250, 292 144 S 376 12, 536 28" />
        <g className="tower-node">
          <path d="M384 256 L414 164 L444 256" />
          <path d="M399 210 H429 M393 232 H435 M408 188 H420" />
          <circle cx="414" cy="160" r="6" />
        </g>
        {[
          [95, 96, "green"],
          [214, 143, "lavender"],
          [348, 79, "green"],
          [108, 260, "lavender"],
          [279, 229, "green"],
          [422, 202, "lavender"],
        ].map(([cx, cy, tone], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="8"
            className={`network-node ${String(tone)}`}
            style={{ animationDelay: `${index * 0.32}s` }}
          />
        ))}
      </svg>
      <div className="uptime-chip">
        <small>NETWORK UPTIME</small>
        <strong>24x7 NOC monitored</strong>
      </div>
    </div>
  );
}
