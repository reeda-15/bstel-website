"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { mapBitmap } from "@/lib/dot-map";
import { states } from "@/lib/site-data";

const colors: Record<string, string> = {
  M: "#8DC63F",
  P: "#8DC63F",
  C: "#8DC63F",
  A: "#8DC63F",
  U: "#A78BDB",
  G: "#A78BDB",
  o: "#DDD8E8",
};

const activationOrder: Record<string, number> = {
  M: 0,
  P: 1,
  C: 2,
  A: 3,
  U: 4,
  G: 5,
  o: 6,
};

const activeRegions = ["M", "P", "C", "A", "U", "G"];

export function CoverageExplorer() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="coverage-grid">
      <div className={selected ? "map-panel has-selection" : "map-panel"}>
        <svg className="india-map" viewBox="0 0 456 494" aria-label="Stylized coverage map of India">
          <g className="coverage-routes" aria-hidden="true">
            <path d="M196 196 C178 240 155 282 132 324" />
            <path d="M196 196 C235 210 263 248 286 289" />
            <path d="M196 196 C219 170 251 148 291 138" />
            <path d="M196 196 C175 168 155 142 133 116" />
            <path d="M196 196 C216 132 244 87 286 51" />
          </g>
          <g className="coverage-spotlights" aria-hidden="true">
            {activeRegions.map((region) => (
              <circle
                className={selected === region ? "coverage-spotlight selected" : "coverage-spotlight"}
                cx={spotlightFor(region).x}
                cy={spotlightFor(region).y}
                key={region}
                r={spotlightFor(region).r}
              />
            ))}
          </g>
          {mapBitmap.flatMap((row, y) =>
            row.split("").map((cell, x) => {
              if (cell === ".") return null;
              const active = !selected || selected === cell;
              const className = [
                "coverage-dot",
                cell === "o" ? "not-covered" : "covered",
                active ? "active" : "inactive",
                selected === cell ? "selected" : "",
              ].filter(Boolean).join(" ");
              return (
                <circle
                  className={className}
                  key={`${x}-${y}`}
                  cx={x * 19 + 10}
                  cy={y * 19 + 10}
                  r="5.5"
                  fill={colors[cell] || colors.o}
                  opacity={active ? 1 : 0.18}
                  style={{ "--coverage-delay": `${activationOrder[cell] * 140 + (x + y) * 7}ms` } as CSSProperties}
                />
              );
            }),
          )}
          <g className="coverage-city-markers" aria-hidden="true">
            <circle cx="196" cy="196" r="8" />
            <circle cx="132" cy="324" r="6.5" />
            <circle cx="286" cy="289" r="6.5" />
            <circle cx="291" cy="138" r="6" />
            <circle cx="133" cy="116" r="6" />
          </g>
        </svg>
        <div className="legend">
          <span><i className="full" /> Full state coverage</span>
          <span><i className="partial" /> Key districts</span>
          <span><i className="none" /> Not yet covered</span>
        </div>
        <p>Stylized map - for illustration only.</p>
      </div>
      <div className="state-list">
        {states.map((state) => (
          <button
            type="button"
            key={state.key}
            className={selected === state.key ? "state-card selected" : "state-card"}
            onClick={() => setSelected((current) => (current === state.key ? null : state.key))}
          >
            <span className={state.full ? "state-dot full" : "state-dot partial"} />
            <span>
              <strong>{state.name}</strong>
              <small>{state.districts}</small>
            </span>
            <em>{state.code}</em>
            <b>{state.tag}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function spotlightFor(region: string) {
  const spotlights: Record<string, { x: number; y: number; r: number }> = {
    M: { x: 196, y: 196, r: 86 },
    P: { x: 286, y: 289, r: 70 },
    C: { x: 132, y: 324, r: 62 },
    A: { x: 133, y: 116, r: 44 },
    U: { x: 286, y: 51, r: 48 },
    G: { x: 291, y: 138, r: 52 },
  };

  return spotlights[region] || spotlights.M;
}
