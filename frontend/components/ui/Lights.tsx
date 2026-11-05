const CURVES = 8;
const CURVE_WIDTH = 1000 / CURVES;
const NAIL_HEIGHT = 6;
const DROP = 18;

const STRAND =
  `M0 ${NAIL_HEIGHT} ` +
  Array.from(
    { length: CURVES },
    (_, k) =>
      `Q${k * CURVE_WIDTH + CURVE_WIDTH / 2} ${NAIL_HEIGHT + 2 * DROP} ${(k + 1) * CURVE_WIDTH} ${NAIL_HEIGHT}`,
  ).join(" ");

const LIGHTS = Array.from({ length: CURVES * 2 }, (_, i) => {
  const curve = Math.floor(i / 2);
  const t = i % 2 === 0 ? 1 / 3 : 2 / 3;
  return {
    left: ((curve + t) / CURVES) * 100,
    top: NAIL_HEIGHT + 4 * DROP * t * (1 - t),
    white: i % 3 === 0,
  };
});

export function Lights() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-9 h-10">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-night-300/50">
        <path d={STRAND} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>

      {LIGHTS.map((light, i) => (
        <span
          key={i}
          className={`absolute size-2.5 -translate-x-1/2 rounded-full shadow-glow motion-safe:animate-twinkle ${
            light.white ? "bg-cream-50 shadow-cream-50/80" : "bg-yellow"
          }`}
          style={{
            left: `${light.left}%`,
            top: light.top,
            animationDelay: `${(i % 5) * 0.6}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
