type CountStat = {
  kind: "count";
  end: number;
  suffix?: string;
  label: string;
};

type TextStat = {
  kind: "text";
  value: string;
  label: string;
};

const stats: Array<CountStat | TextStat> = [
  { kind: "count", end: 18, suffix: "+", label: "Years in telecom" },
  { kind: "count", end: 6, label: "States served" },
  { kind: "count", end: 130, suffix: "+", label: "Districts covered" },
  { kind: "text", value: "IP-1", label: "Licensed provider" },
];

export function AnimatedStats() {
  return (
    <section className="stats">
      {stats.map((stat) => {
        const value = stat.kind === "count" ? `0${stat.suffix || ""}` : stat.value;

        return (
          <div key={stat.label}>
            <strong
              {...(stat.kind === "count"
                ? {
                    "data-count-stat": String(stat.end),
                    "data-count-suffix": stat.suffix || "",
                    suppressHydrationWarning: true,
                  }
                : {})}
            >
              {value}
            </strong>
            <span>{stat.label}</span>
          </div>
        );
      })}
    </section>
  );
}
