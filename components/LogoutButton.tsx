"use client";

export default function LogoutButton() {
  const onClick = async () => {
    try {
      // Kirim permintaan POST untuk logout ke API
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        // Menghapus cookie di client-side setelah logout
        document.cookie = "userId=; Max-Age=0; path=/";  // Menghapus cookie 'userId'
        document.cookie = "session=; Max-Age=0; path=/";  // Menghapus cookie 'session'

        // Redirect ke halaman login setelah logout berhasil
        window.location.href = "/login";
      } else {
        const data = await res.json();
        alert(data.message || "Gagal logout. Coba lagi.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Gagal logout. Coba lagi.");
    }
  };

  return (
    <button onClick={onClick} className="text-sm underline">
      Logout
    </button>
  );
}
