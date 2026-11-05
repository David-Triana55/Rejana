import Image from "next/image";
import { RegisterForm } from "./RegisterForm";

export function RegisterCard() {
  return (
    <div className="relative w-full max-w-sm rounded-3xl border-2 border-ink bg-cream/90 p-8 backdrop-blur-md text-center text-ink shadow-sticker">
      <Image
        src="/logo.png"
        alt="La Rejana"
        width={96}
        height={96}
        className="mx-auto rounded-full border-2 border-ink"
      />
      <h1 className="mt-4 text-2xl font-black uppercase md:text-3xl">Crea tu cuenta</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">Verifica tu correo para continuar</p>
      <RegisterForm />
    </div>
  );
}
