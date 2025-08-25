import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "@/lib/db";  // Jika Anda menggunakan database untuk sesi
import { clearSession } from "@/lib/auth";  // Pastikan clearSession dipanggil untuk menghapus cookies

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  // Ambil token dari cookies
  const token = cookieStore.get('session')?.value;

  if (!token) {
    // Jika token tidak ditemukan di cookie, beri response error
    console.error("Token tidak ditemukan di cookies!");
    return NextResponse.json({ success: false, message: "No active session" }, { status: 400 });
  }

  // Hapus sesi dari database jika diperlukan
  try {
    await query("DELETE FROM sessions WHERE token = $1", [token]);
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json({ success: false, message: "Failed to logout" }, { status: 500 });
  }

  // Panggil clearSession untuk menghapus cookies di server
  await clearSession();

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
