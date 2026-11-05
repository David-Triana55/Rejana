"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { Progress } from "@/components/ui/Progress";
import { checkEmail, register, sendCode, verifyCode } from "../services/auth";
import type { Role } from "../types";
import { CodeInput } from "./CodeInput";

const FIELD_CLASSES = "w-full rounded-full border-2 border-ink bg-white px-4 py-3 text-left";
const BUTTON_CLASSES = "w-full rounded-full border-2 border-ink bg-turquoise px-4 py-3 font-semibold text-ink shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

const ROLE_ROUTES: Record<Role, string> = {
    customer: "/customer",
    admin: "/admin",
    waiter: "/waiter",
    chef: "/chef",
    cashier: "/cashier",
};

export function RegisterForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    function goBack() {
        setError("");
        if (step === 1) {
            router.push("/login");
            return;
        }
        setStep(step - 1);
    }

    async function submitEmail(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const emailValue = String(new FormData(e.currentTarget).get("email"));
        const result = await checkEmail(emailValue);
        const exists = result.ok ? result.data : false;
        if (exists) {
            router.push("/login");
            return;
        }
        await sendCode(emailValue);
        setEmail(emailValue);
        setError("");
        setStep(2);
    }

    async function checkCode(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const code = String(new FormData(e.currentTarget).get("codigo"));
        const result = await verifyCode(email, code);
        if (!result.valid) {
            setError("El código no es correcto");
            return;
        }
        setError("");
        setStep(3);
    }

    async function createAccount(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        if (form.get("password") !== form.get("confirmPassword")) {
            setError("Las contraseñas no coinciden");
            return;
        }
        const result = await register({ email, password: String(form.get("password")) });
        router.push(ROLE_ROUTES[result.role]);
    }

    return (
        <div className="flex flex-col gap-3">
            <BackButton onClick={goBack} />
            <Progress step={step} total={3} />

            {step === 1 && (
                <form onSubmit={submitEmail} className="flex flex-col gap-3">
                    <input type="email" name="email" placeholder="ingresa tu email" required autoFocus className={FIELD_CLASSES} />
                    <button type="submit" className={BUTTON_CLASSES}>
                        Continuar
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={checkCode} className="flex flex-col gap-3">
                    <p className="text-sm text-ink-soft">
                        Te enviamos un código a <strong>{email}</strong>
                    </p>
                    <CodeInput />
                    <button type="submit" className={BUTTON_CLASSES}>
                        Verificar
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={createAccount} className="flex flex-col gap-3">
                    <input type="password" name="password" autoComplete="new-password" placeholder="contraseña" required autoFocus className={FIELD_CLASSES} />
                    <input type="password" name="confirmPassword" autoComplete="new-password" placeholder="confirma tu contraseña" required className={FIELD_CLASSES} />
                    <button type="submit" className={BUTTON_CLASSES}>
                        Crear cuenta
                    </button>
                </form>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}
