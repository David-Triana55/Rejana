import Image from "next/image";
import { LoginForm } from "./LoginForm";

export function LoginCard() {
  return (
    <div className="w-full max-w-sm rounded-3xl border-2 border-tinta bg-crema/90 p-8 backdrop-blur-md text-center text-tinta shadow-sticker">
      <Image
        src="/logo.png"
        alt="La Rejana"
        width={96}
        height={96}
        className="mx-auto rounded-full border-2 border-tinta"
      />
      <h1 className="mt-4 text-2xl font-black uppercase md:text-3xl">Bienvenido</h1>
      <p className="mt-1 mb-6 text-sm text-tinta-soft">Inicia sesión para continuar</p>
      <LoginForm />
    </div>
  );
}
