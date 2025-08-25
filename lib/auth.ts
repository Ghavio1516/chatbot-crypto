import { cookies } from "next/headers";
import { query } from "./db";

const SESSION_COOKIE = "session";
const isProd = process.env.NODE_ENV === "production";

export async function setSession(userId: string) {
  const cookieStore = await cookies();  // Menunggu cookies() sebelum digunakan

  const { rows } = await query<{ token: string }>(
    "INSERT INTO sessions (user_id, expires) VALUES ($1, NOW() + INTERVAL '30 days') RETURNING token",
    [userId]
  );
  const token = rows[0].token;

  cookieStore.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Set userId in a separate cookie to track the user's identity
  cookieStore.set({
    name: "userId",
    value: userId,
    httpOnly: false, // userId will be accessible client-side
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}


export async function getSessionUser() {
  const cookieStore = await cookies();  // Memastikan cookies() dipanggil dengan await
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const { rows } = await query<{ user_id: string; expires: Date }>(
    "SELECT user_id, expires FROM sessions WHERE token = $1",
    [token]
  );
  const sess = rows[0];
  if (!sess) return null;
  if (new Date(sess.expires) < new Date()) {
    await query("DELETE FROM sessions WHERE token=$1", [token]);
    clearSession();
    return null;
  }

  const user = await query<{ id: string; email: string; display_name: string }>(
    "SELECT id, email, display_name FROM users WHERE id=$1",
    [sess.user_id]
  );
  return user.rows[0] ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  
  // Hapus cookie 'session'
  cookieStore.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });

  // Hapus cookie 'userId'
  cookieStore.set("userId", "", { path: "/", maxAge: 0 });
}

