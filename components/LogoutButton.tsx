"use client";
export default function LogoutButton() {
  const onClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login"; // atau "/"
  };
  return (
    <button onClick={onClick} className="text-sm underline">
      Logout
    </button>
  );
}
