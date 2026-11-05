"use client";
import { useState } from "react";

const LENGTH = 6;

export function CodeInput() {
  const [value, setValue] = useState("");
  const active = Math.min(value.length, LENGTH - 1);

  return (
    <div className="group relative flex gap-2">
      {Array.from({ length: LENGTH }, (_, i) => (
        <span
          key={i}
          className={`grid h-14 min-w-0 flex-1 place-items-center rounded-xl border-2 border-ink bg-white text-2xl font-bold transition ${
            i === active ? "group-focus-within:-translate-y-0.5 group-focus-within:shadow-sticker-sm" : ""
          }`}
        >
          {value[i]}
        </span>
      ))}
      <input
        name="codigo"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/\D/g, "").slice(0, LENGTH))}
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern={`\\d{${LENGTH}}`}
        title={`Escribe los ${LENGTH} dígitos`}
        aria-label={`Código de ${LENGTH} dígitos`}
        required
        autoFocus
        className="absolute inset-0 opacity-0"
      />
    </div>
  );
}
