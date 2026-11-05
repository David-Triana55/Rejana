"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { requestPasswordReset } from "../services/auth";

const FIELD_CLASSES = "w-full rounded-full border-2 border-ink bg-white px-4 py-3 text-left";
const BUTTON_CLASSES = "w-full rounded-full border-2 border-ink bg-turquoise px-4 py-3 font-semibold text-ink shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

export function ForgotPasswordForm() {
    const router = useRouter();
    const [sent, setSent] = useState(false);

    async function submitEmail(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email"));
        await requestPasswordReset(email);
        setSent(true);
    }

    return (
        <div className="flex flex-col gap-3">
            <BackButton onClick={() => router.push("/login")} />

            {!sent && (
                <form onSubmit={submitEmail} className="flex flex-col gap-3">
                    <input type="email" name="email" placeholder="ingresa tu email" required autoFocus className={FIELD_CLASSES} />
                    <button type="submit" className={BUTTON_CLASSES}>
                        Enviar enlace
                    </button>
                </form>
            )}

            {sent && (
                <p className="text-sm text-ink-soft">
                    Si el correo existe, te enviamos un enlace para restablecer tu contraseña.
                </p>
            )}
        </div>
    );
}
