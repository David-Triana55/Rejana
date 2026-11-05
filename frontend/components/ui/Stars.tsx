function random(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

const DOTS = Array.from({ length: 200 }, (_, i) => ({
  left: random(i + 1) * 100,
  top: random(i + 101) * 100,
  size: 1 + Math.floor(random(i + 201) * 3),
  delay: random(i + 301) * 3,
}));

const SPARKLES = [
  { left: 12, top: 30, size: 14, color: "text-pink" },
  { left: 86, top: 22, size: 24, color: "text-white" },
  { left: 80, top: 72, size: 12, color: "text-turquoise" },
  { left: 8, top: 80, size: 18, color: "text-yellow" },
  { left: 48, top: 14, size: 10, color: "text-white" },
];

function DotField() {
  return (
    <div className="relative h-full w-1/2">
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 motion-safe:animate-twinkle"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Stars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {}
      <div className="absolute inset-y-0 left-0 flex w-[200%] motion-safe:animate-drift">
        <DotField />
        <DotField />
      </div>

      {/* The sparkles stay still: that makes them look closer */}
      {SPARKLES.map((sparkle, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={sparkle.size}
          height={sparkle.size}
          className={`absolute motion-safe:animate-twinkle ${sparkle.color}`}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          <path d="M10 0 Q10 10 20 10 Q10 10 10 20 Q10 10 0 10 Q10 10 10 0 Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
