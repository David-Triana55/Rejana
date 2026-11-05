"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../services/auth";
import type { Role } from "../types";
import { AppleButton } from "./AppleButton";
import { GoogleButton } from "./GoogleButton";

const FIELD_CLASSES = "w-full rounded-full border-2 border-ink bg-white px-4 py-3 text-left";
const BUTTON_CLASSES = "w-full rounded-full border-2 border-ink bg-turquoise px-4 py-3 font-semibold text-ink shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

const ROLE_ROUTES: Record<Role, string> = {
    customer: "/customer",
    admin: "/admin",
    waiter: "/waiter",
    chef: "/chef",
    cashier: "/cashier",
};


export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState("");

    async function doLogin(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = String(form.get("email"));
        const password = String(form.get("password"));
        const result = await login(email, password);
        if (!result.valid || !result.role) {
            setError("El email o la contraseña no son correctos");
            return;
        }
        router.push(ROLE_ROUTES[result.role as Role]);
    }

    return (
        <div className="flex flex-col gap-3">
            <form onSubmit={doLogin} className="flex flex-col gap-3">
                <input type="email" name="email" placeholder="ingresa tu email" required className={FIELD_CLASSES} />
                <input type="password" name="password" autoComplete="current-password" placeholder="contraseña" required className={FIELD_CLASSES} />
                <Link href="/forgot-password" className="self-end text-xs text-ink-soft underline-offset-2 hover:underline">
                    ¿Olvidaste tu contraseña?
                </Link>
                <button type="submit" className={BUTTON_CLASSES}>
                    Entrar
                </button>
            </form>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="my-3 flex items-center gap-3 text-sm text-ink-soft">
                <span className="h-0.5 flex-1 bg-ink/20" />
                o continúa con
                <span className="h-0.5 flex-1 bg-ink/20" />
            </div>
            
            <div className="flex justify-center gap-3">
                <GoogleButton onClick={() => router.push("/auth/google")} /> 
                <AppleButton onClick={() => router.push("/auth/apple")} />
            </div>

            <p className="text-sm text-ink-soft">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="font-semibold text-ink underline-offset-2 hover:underline">
                    Crear cuenta
                </Link>
            </p>
        </div>
    );
}
