"use client";
import { useEffect, useRef } from "react";

/**
 * Symbol Overview widget (bukan mini), set interval 15m supaya fokus area 1 jam terakhir (4 bar).
 * Catatan: TradingView embed tidak menyediakan "range: 1H" yang benar-benar mengunci data,
 * tapi initial viewport akan berada di area terbaru, user bisa zoom ke ~1h.
 */
export default function TVMini({
  symbol = "BINANCE:BTCUSDT",
  dark = true,
  height = 180,
}: {
  symbol?: string;
  dark?: boolean;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  useEffect(() => {
    const host = ref.current;
    if (!host || didInit.current) return;
    didInit.current = true;

    try {
      host.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.async = true;
      script.type = "text/javascript";

      // interval "15" = 15 menit. Tidak ada properti "1H" resmi untuk hard-limit range.
      // Kita set autosize + height kecil agar area fokus terlihat padat ke data terbaru.
      const cfg = {
        symbols: [[symbol]],
        chartOnly: true,
        width: "100%",
        height,
        locale: "en",
        colorTheme: dark ? "dark" : "light",
        isTransparent: true,
        autosize: true,
        showVolume: true,
        scalePosition: "right",
        scaleMode: "Normal",
        fontFamily: "-apple-system, BlinkMacSystemFont, Inter, Segoe UI, Roboto, Helvetica, Arial",
        noTimeScale: false,
        // interval: "15" valid untuk symbol-overview
        interval: "15",
        // berikut ini TIDAK mengunci 1H, tapi bisa dibiarkan (beberapa build mengabaikan properti ini):
        // range: "1H",
      };

      script.innerHTML = JSON.stringify(cfg);
      const t = setTimeout(() => host.appendChild(script), 0);

      return () => {
        clearTimeout(t);
        host.innerHTML = "";
      };
    } catch {
      // biar gak crash app kalau widget gagal load
    }
  }, [symbol, dark, height]);

  return (
    <div className="tradingview-widget-container">
      <div ref={ref} />
    </div>
  );
}
