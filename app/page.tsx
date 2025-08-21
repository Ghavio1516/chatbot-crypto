"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import clsx from "classnames";
import TradingViewTape from "@/components/TradingViewTape";
import TVMini from "@/components/TVMini";

type Message = { id: string; role: "user" | "assistant" | "system"; content: string };

const EXAMPLE = `**Contoh output**  
\`\`\`
Server tidak mengirim output, jadi ini contoh.
\`\`\`
`;

function getSessionId() {
  try {
    const s = localStorage.getItem("sid");
    if (s) return s;
    const n = `sid_${crypto.randomUUID()}`;
    localStorage.setItem("sid", n);
    return n;
  } catch {
    return `sid_${Math.random().toString(36).slice(2)}`;
  }
}

// simpan userId sebagai cookie supaya tetap sama di device yang sama
function getUserId() {
  const name = "uid=";
  const parts = document.cookie.split(";").map((s) => s.trim());
  const found = parts.find((p) => p.startsWith(name));
  if (found) return found.slice(name.length);

  const uid = `u_${crypto.randomUUID()}`;
  document.cookie = `uid=${uid}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  return uid;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      role: "system",
      content: "Halo! Tanyakan apa saja tentang Ethereum",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // auto-scroll ke bawah
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, loading]);

  const send = async () => {
    const prompt = input.trim();
    if (!prompt || loading) return;

    setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", content: prompt }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, sessionId: getSessionId(), userId: getUserId() })
      });

      let output = "";
      if (res.ok) {
        const data = (await res.json()) as { output?: string; detail?: string; success?: boolean };
        if (data?.success === false || data?.output === "error") {
          output = `⚠️ Terjadi error di server.\n\nDetail: ${data.detail ?? "tidak diketahui"}`;
        } else {
          output = data?.output ?? "";
        }
      } else {
        output = `⚠️ HTTP ${res.status} dari server.`;
      }

      if (!output) output = EXAMPLE;
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: output }]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "⚠️ Gagal terhubung: " + msg }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-full">
      {/* APP BAR */}
      <header className="sticky top-0 z-10 border-b border-neutral-200/70 dark:border-neutral-800/70 bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-6 h-14 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
          <h1 className="font-semibold tracking-tight">AI by Ghavio</h1>
          <span className="ml-auto text-xs text-neutral-500">
            Copyright <code>2025</code>
          </span>
        </div>
      </header>

      {/* BODY pakai grid */}
      <main className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 mb-28">
          {/* ===== Left: Chat ===== */}
          <div className="lg:col-span-8">
            <div
              ref={scrollRef}
              className="h-[calc(100vh-10rem)] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm"
            >
              <ul className="p-4 md:p-6 space-y-6 pb-32">
                {messages.map((m) => (
                  <li key={m.id} className="flex items-start gap-3">
                    {/* avatar */}
                    <div
                      className={clsx(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white",
                        m.role === "assistant"
                          ? "bg-emerald-500"
                          : m.role === "user"
                          ? "bg-indigo-500"
                          : "bg-neutral-400"
                      )}
                      title={m.role}
                      aria-label={m.role}
                    >
                      {m.role === "assistant" ? "A" : m.role === "user" ? "U" : "S"}
                    </div>

                    {/* bubble */}
                    <article
                      className={clsx(
                        "max-w-[85%] rounded-2xl px-4 py-3 markdown",
                        m.role === "assistant"
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60"
                          : m.role === "user"
                          ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200/60 dark:border-indigo-800/60 ml-auto"
                          : "bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                      )}
                    >
                      {m.role === "assistant" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                          {m.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}

                      {m.role === "assistant" && (
                        <div className="mt-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(m.content)}
                            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
                          >
                            Salin jawaban
                          </button>
                        </div>
                      )}
                    </article>
                  </li>
                ))}

                {loading && (
                  <li className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center">A</div>
                    <div className="rounded-2xl px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/60">
                      Menulis<span className="typing">…</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* ===== Right: Sidebar ===== */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-16">
              <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-1 space-y-3">
                {/* Ticker Tape */}
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-2">
                  <TradingViewTape dark={true} />
                </div>

                {/* Mini charts */}
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur p-3 space-y-3">
                  <div className="text-xs text-neutral-500 px-1">Top coins (1D)</div>
                  <TVMini symbol="BINANCE:BTCUSDT" />
                  <TVMini symbol="BINANCE:ETHUSDT" />
                  <TVMini symbol="BINANCE:SOLUSDT" />
                  <TVMini symbol="BINANCE:XRPUSDT" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* COMPOSER */}
      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur shadow-lg">
            <div className="flex items-end gap-2 p-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Ketik pesan…"
                className="flex-1 resize-none bg-transparent outline-none placeholder:text-neutral-400 max-h-40 p-2"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className={clsx(
                  "h-10 px-4 rounded-xl text-white font-medium transition",
                  loading || !input.trim()
                    ? "bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed"
                    : "bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                )}
              >
                Kirim
              </button>
            </div>
            <div className="px-4 pb-2 text-xs text-neutral-500">Enter = kirim · Shift+Enter = baris baru</div>
          </div>
        </div>
      </div>
    </div>
  );
}
