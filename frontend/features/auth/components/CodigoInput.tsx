"use client";
import { useState } from "react";

const LARGO = 6;

export function CodigoInput() {
  const [valor, setValor] = useState("");
  const activo = Math.min(valor.length, LARGO - 1);

  return (
    <div className="group relative flex gap-2">
      {Array.from({ length: LARGO }, (_, i) => (
        <span
          key={i}
          className={`grid h-14 min-w-0 flex-1 place-items-center rounded-xl border-2 border-tinta bg-white text-2xl font-bold transition ${
            i === activo ? "group-focus-within:-translate-y-0.5 group-focus-within:shadow-sticker-sm" : ""
          }`}
        >
          {valor[i]}
        </span>
      ))}
      <input
        name="codigo"
        value={valor}
        onChange={(e) => setValor(e.target.value.replace(/\D/g, "").slice(0, LARGO))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`\\d{${LARGO}}`}
        title={`Escribe los ${LARGO} dígitos`}
        aria-label={`Código de ${LARGO} dígitos`}
        required
        autoFocus
        className="absolute inset-0 opacity-0"
      />
    </div>
  );
}
