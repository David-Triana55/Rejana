"use server";

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

// POST /auth/email — body { email } → { existe }. Si existe pide contraseña; si no, código y registro.
// No debe devolver el rol: eso solo llega después de la contraseña correcta.
export async function consultarEmail(email: string) {
  return { existe: USUARIOS_REGISTRADOS.some((u) => u.email === email) };
}

// POST /auth/login — body { email, contrasena } → { valido, rol }. El rol decide a qué vista va.
export async function iniciarSesion(email: string, contrasena: string) {
  const usuario = USUARIOS_REGISTRADOS.find((u) => u.email === email && u.contrasena === contrasena);
  return { valido: !!usuario, rol: usuario?.rol };
}

// POST /auth/email/codigo — body { email }. El backend manda un código al correo (solo correos nuevos).
export async function enviarCodigo(email: string) {
  console.info(`[mock] Código para ${email}: ${CODIGO_CORRECTO}`);
}

// POST /auth/email/verificar — body { email, codigo } → { valido }.
export async function verificarCodigo(email: string, codigo: string) {
  console.info(`[mock] Verificando código de ${email}`);
  return { valido: codigo === CODIGO_CORRECTO };
}

// POST /auth/registro — body { email, contrasena } → { rol }. Crea la cuenta de un cliente (los empleados los crea el admin).
export async function registrar(datos: DatosRegistro): Promise<{ rol: Rol }> {
  console.info(`[mock] Cuenta de cliente creada para ${datos.email}`);
  return { rol: "cliente" };
}
