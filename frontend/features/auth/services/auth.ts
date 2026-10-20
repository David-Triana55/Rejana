"use server";

import { apiRequest } from "@/lib/api";
import type { Rol } from "../types";

const USUARIOS_REGISTRADOS: { email: string; contrasena: string; rol: Rol }[] = [
  { email: "admin@rejana.com", contrasena: "rejana123", rol: "admin" },
  { email: "mesero@rejana.com", contrasena: "rejana123", rol: "mesero" },
  { email: "cliente@rejana.com", contrasena: "rejana123", rol: "cliente" },
];
const CODIGO_CORRECTO = "123456";

type DatosRegistro = {
  email: string;
  contrasena: string;
};

type Responselogin = {
  name: string | null;
  role: string;
};

type requestLogin = {
  email: string;
  password: string;
};


export async function consultarEmail(email: string) {
  return await apiRequest<boolean>("/auth/email", { method: "POST", body: { email } });
}

export async function iniciarSesion(email: string, contrasena: string) {
  const res = await apiRequest<Responselogin>("/auth/login", {
    method: "POST",
    body: { email, password: contrasena } as requestLogin,
    auth: false,
  });
  if (!res.ok) return { valido: false as const, error: res.error.message };
  return { valido: true as const, rol: res.data.role };
}

// POST /auth/email/codigo — body { email }. El backend manda un código al correo (solo correos nuevos).
export async function enviarCodigo(email: string) {
  return console.info(`[mock] Código para ${email}: ${CODIGO_CORRECTO}`);
}

export async function verificarCodigo(email: string, codigo: string) {
  return console.info(`[mock] Verificando código de ${email}`);
}

// POST /auth/registro — body { email, contrasena } → { rol }. Crea la cuenta de un cliente (los empleados los crea el admin).
export async function registrar(datos: DatosRegistro): Promise<{ rol: Rol }> {
  const rol: Rol = "cliente";
  USUARIOS_REGISTRADOS.push({ ...datos, rol });
  return { rol };
}
