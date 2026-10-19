const COLORES = ["bg-rosa", "bg-amarillo", "bg-turquesa", "bg-morado", "bg-naranja", "bg-azul"];

export function Guirnalda() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 flex overflow-hidden">
      {}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-noche-300/40" />

      {}
      {Array.from({ length: 40 }, (_, i) => (
        <div
          key={i}
          className={`banderin mt-0.5 h-11 w-15 shrink-0 origin-top motion-safe:animate-mecer ${COLORES[i % COLORES.length]}`}
          style={{
            animationDelay: `${(i % 7) * -0.6}s`,
            animationDuration: `${3.5 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
}
