import type { CSSProperties } from "react";

export function AnimatedHeadline({ text }: { text: string }) {
  return (
    <h1 className="hero-title-reveal">
      {text.split(" ").map((word, index, words) => (
        <span
          className="hero-title-word"
          key={`${word}-${index}`}
          style={{ "--word-delay": `${160 + index * 72}ms` } as CSSProperties}
        >
          {word}{index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}
