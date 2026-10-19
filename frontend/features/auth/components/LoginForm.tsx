"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progreso } from "@/components/ui/Progreso";
import { consultarEmail, enviarCodigo, iniciarSesion, registrar, verificarCodigo } from "../services/auth";
import type { Rol } from "../types";
import { AppleButton } from "./AppleButton";
import { CodigoInput } from "./CodigoInput";
import { GoogleButton } from "./GoogleButton";

const CAMPO = "w-full rounded-full border-2 border-tinta bg-white px-4 py-3 text-left";
const BOTON = "w-full rounded-full border-2 border-tinta bg-turquesa px-4 py-3 font-semibold text-tinta shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none";

const VISTA_POR_ROL: Record<Rol, string> = {
    cliente: "/cliente",
    admin: "/admin",
    mesero: "/mesero",
    cocina: "/cocina",
    caja: "/caja",
};

export function LoginForm() {
    const router = useRouter();
    const [paso, setPaso] = useState(1);
    const [email, setEmail] = useState("");
    const [existe, setExiste] = useState(false);
    const [error, setError] = useState("");

    async function enviarEmail(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const correo = String(new FormData(e.currentTarget).get("email"));
        const respuesta = await consultarEmail(correo);
        if (!respuesta.existe) {
            await enviarCodigo(correo);
        }
        setEmail(correo);
        setExiste(respuesta.existe);
        setPaso(2);
    }

    async function entrar(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const contrasena = String(new FormData(e.currentTarget).get("contrasena"));
        const respuesta = await iniciarSesion(email, contrasena);
        if (!respuesta.valido || !respuesta.rol) {
            setError("La contraseña no es correcta");
            return;
        }
        router.push(VISTA_POR_ROL[respuesta.rol]);
    }

    async function comprobarCodigo(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const codigo = String(new FormData(e.currentTarget).get("codigo"));
        const respuesta = await verificarCodigo(email, codigo);
        if (!respuesta.valido) {
            setError("El código no es correcto");
            return;
        }
        setError("");
        setPaso(3);
    }

    async function crearCuenta(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const datos = new FormData(e.currentTarget);
        if (datos.get("contrasena") !== datos.get("confirmacion")) {
            setError("Las contraseñas no coinciden");
            return;
        }
        const respuesta = await registrar({ email, contrasena: String(datos.get("contrasena")) });
        router.push(VISTA_POR_ROL[respuesta.rol]);
    }

    return (
        <div className="flex flex-col gap-3">
            <Progreso paso={paso} />

            {paso === 1 && (
                <form onSubmit={enviarEmail} className="flex flex-col gap-3">
                    <input type="email" name="email" placeholder="ingresa tu email" required className={CAMPO} />
                    <button type="submit" className={BOTON}>
                        Ingresar
                    </button>
                </form>
            )}

            {paso === 2 && existe && (
                <form onSubmit={entrar} className="flex flex-col gap-3">
                    <p className="text-sm text-tinta-soft">
                        Hola de nuevo, <strong>{email}</strong>
                    </p>
                    <input type="password" name="contrasena" autoComplete="current-password" placeholder="contraseña" required autoFocus className={CAMPO} />
                    <button type="submit" className={BOTON}>
                        Entrar
                    </button>
                </form>
            )}

            {paso === 2 && !existe && (
                <form onSubmit={comprobarCodigo} className="flex flex-col gap-3">
                    <p className="text-sm text-tinta-soft">
                        Te enviamos un código a <strong>{email}</strong>
                    </p>
                    <CodigoInput />
                    <button type="submit" className={BOTON}>
                        Verificar
                    </button>
                </form>
            )}

            {paso === 3 && (
                <form onSubmit={crearCuenta} className="flex flex-col gap-3">
                    <input type="password" name="contrasena" autoComplete="new-password" placeholder="contraseña" required autoFocus className={CAMPO} />
                    <input type="password" name="confirmacion" autoComplete="new-password" placeholder="confirma tu contraseña" required className={CAMPO} />
                    <button type="submit" className={BOTON}>
                        Crear cuenta
                    </button>
                </form>
            )}

            {error && <p className="text-sm text-rojo-600">{error}</p>}

            {paso === 1 && (
                <>
                    <div className="my-3 flex items-center gap-3 text-sm text-tinta-soft">
                        <span className="h-0.5 flex-1 bg-tinta/20" />
                        o continúa con
                        <span className="h-0.5 flex-1 bg-tinta/20" />
                    </div>
                    {/* Endpoints reales: GET http://localhost:3001/auth/google y GET /auth/apple. Son
                        redirecciones, no fetch: el botón vuelve a ser un <a href> a esa dirección y el
                        backend revisa si el correo ya está registrado: si sí, devuelve al usuario a la vista
                        de su rol; si no, lo crea como cliente y lo devuelve a /cliente.
                        Mock: el clic simula un cliente que entró bien y va directo a /cliente. */}
                    <div className="flex justify-center gap-3">
                        <GoogleButton onClick={() => router.push("/cliente")} />
                        <AppleButton onClick={() => router.push("/cliente")} />
                    </div>
                </>
            )}
        </div>
    );
}
