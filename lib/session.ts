import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "malik_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 ڕۆژ

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me";

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  if (!expiresAtRaw || !signature) return false;
  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;
  const expected = sign(expiresAtRaw);
  const given = Buffer.from(signature, "utf8");
  const check = Buffer.from(expected, "utf8");
  if (given.length !== check.length) return false;
  return timingSafeEqual(given, check);
}

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "malikk2026@gmail.com")
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "malikk2026";

function timingSafeStringEqual(a: string, b: string): boolean {
  const given = Buffer.from(a, "utf8");
  const check = Buffer.from(b, "utf8");
  if (given.length !== check.length) return false;
  return timingSafeEqual(given, check);
}

/** پشکنینی ئیمەیڵ و وشەی نهێنی بە یەکەوە */
export function checkLogin(email: string, password: string): boolean {
  return (
    timingSafeStringEqual(email, ADMIN_EMAIL) &&
    timingSafeStringEqual(password, ADMIN_PASSWORD)
  );
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(COOKIE_NAME)?.value);
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
    secure: process.env.NODE_ENV === "production",
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
