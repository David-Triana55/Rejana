function azar(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

const PUNTOS = Array.from({ length: 200 }, (_, i) => ({
  izquierda: azar(i + 1) * 100,
  arriba: azar(i + 101) * 100,
  tamano: 1 + Math.floor(azar(i + 201) * 3),
  retraso: azar(i + 301) * 3,
}));

const DESTELLOS = [
  { izquierda: 12, arriba: 30, tamano: 14, color: "text-rosa" },
  { izquierda: 86, arriba: 22, tamano: 24, color: "text-white" },
  { izquierda: 80, arriba: 72, tamano: 12, color: "text-turquesa" },
  { izquierda: 8, arriba: 80, tamano: 18, color: "text-amarillo" },
  { izquierda: 48, arriba: 14, tamano: 10, color: "text-white" },
];

function CampoDePuntos() {
  return (
    <div className="relative h-full w-1/2">
      {PUNTOS.map((punto, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 motion-safe:animate-titilar"
          style={{
            left: `${punto.izquierda}%`,
            top: `${punto.arriba}%`,
            width: punto.tamano,
            height: punto.tamano,
            animationDelay: `${punto.retraso}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Estrellas() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {}
      <div className="absolute inset-y-0 left-0 flex w-[200%] motion-safe:animate-deriva">
        <CampoDePuntos />
        <CampoDePuntos />
      </div>

      {/* Los destellos se quedan quietos: así parece que están más cerca */}
      {DESTELLOS.map((destello, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={destello.tamano}
          height={destello.tamano}
          className={`absolute motion-safe:animate-titilar ${destello.color}`}
          style={{
            left: `${destello.izquierda}%`,
            top: `${destello.arriba}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          <path d="M10 0 Q10 10 20 10 Q10 10 10 20 Q10 10 0 10 Q10 10 10 0 Z" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
