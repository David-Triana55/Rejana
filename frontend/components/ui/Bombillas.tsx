const CURVAS = 8;
const ANCHO_CURVA = 1000 / CURVAS; 
const ALTO_CLAVO = 6; 
const BAJADA = 18; 

const CUERDA =
  `M0 ${ALTO_CLAVO} ` +
  Array.from(
    { length: CURVAS },
    (_, k) =>
      `Q${k * ANCHO_CURVA + ANCHO_CURVA / 2} ${ALTO_CLAVO + 2 * BAJADA} ${(k + 1) * ANCHO_CURVA} ${ALTO_CLAVO}`,
  ).join(" ");

const BOMBILLAS = Array.from({ length: CURVAS * 2 }, (_, i) => {
  const curva = Math.floor(i / 2);
  const t = i % 2 === 0 ? 1 / 3 : 2 / 3;
  return {
    izquierda: ((curva + t) / CURVAS) * 100,
    arriba: ALTO_CLAVO + 4 * BAJADA * t * (1 - t),
    blanca: i % 3 === 0,
  };
});

export function Bombillas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-9 h-10">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-noche-300/50">
        <path d={CUERDA} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>

      {BOMBILLAS.map((bombilla, i) => (
        <span
          key={i}
          className={`absolute size-2.5 -translate-x-1/2 rounded-full shadow-brillo motion-safe:animate-titilar ${
            bombilla.blanca ? "bg-crema-50 shadow-crema-50/80" : "bg-amarillo"
          }`}
          style={{
            left: `${bombilla.izquierda}%`,
            top: bombilla.arriba,
            animationDelay: `${(i % 5) * 0.6}s`,
            animationDuration: `${2.5 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
