"use server";

import { apiRequest } from "@/lib/api";
import type { Role } from "../types";

const REGISTERED_USERS: { email: string; password: string; role: Role }[] = [
  { email: "admin@rejana.com", password: "rejana123", role: "admin" },
  { email: "mesero@rejana.com", password: "rejana123", role: "waiter" },
  { email: "cliente@rejana.com", password: "rejana123", role: "customer" },
];
const CORRECT_CODE = "123456";

type RegistrationData = {
  email: string;
  password: string;
};

type LoginResponse = {
  name: string | null;
  role: string;
};

type LoginRequest = {
  email: string;
  password: string;
};


export async function checkEmail(email: string) {
  return await apiRequest<boolean>("/auth/email", { method: "POST", body: { email } });
}

export async function login(email: string, password: string) {
  const res = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password } as LoginRequest,
    auth: false,
  });
  if (!res.ok) return { valid: false as const, error: res.error.message };
  return { valid: true as const, role: res.data.role };
}

// POST /auth/email/codigo — body { email }. The backend sends a code to the email (new emails only).
export async function sendCode(email: string) {
  console.info(`[mock] Code for ${email}: ${CORRECT_CODE}`);
}

export async function verifyCode(email: string, code: string) {
  console.info(`[mock] Verifying code for ${email}`);
  return { valid: code === CORRECT_CODE };
}

// POST /auth/registro — body { email, contrasena } → { rol }. Creates a customer account (employees are created by the admin).
export async function register(data: RegistrationData): Promise<{ role: Role }> {
  const role: Role = "customer";
  REGISTERED_USERS.push({ ...data, role });
  return { role };
}

// POST /auth/password/olvide — body { email }. Sends a reset link only if the email is registered.
export async function requestPasswordReset(email: string) {
  console.info(`[mock] Password reset link for ${email}`);
}
