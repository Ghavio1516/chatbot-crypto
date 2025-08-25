import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  // Ambil cookies dari request
  const cookie = cookies().get('uid'); // Mendapatkan `uid` dari cookie
  if (!cookie) {
    // Jika `uid` tidak ada, redirect ke halaman login
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Cek jika user valid di backend dengan `auth/me`
  const res = await fetch(`${process.env.BASE_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${cookie.value}`,
    },
  });

  const data = await res.json();

  // Jika backend merespons false (user tidak valid)
  if (!data.success) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect ke halaman login
  }

  // Jika user valid, lanjutkan permintaan ke halaman utama
  return NextResponse.next();
}

// Tentukan routes yang ingin diproteksi
export const config = {
  matcher: ['/'], // Ganti dengan path yang ingin diproteksi
};
