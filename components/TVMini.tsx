"use client";
import { useEffect, useRef } from "react";

export default function TVMini({ symbol = "BINANCE:BTCUSDT", dark = true }: { symbol?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const didInit = useRef(false);

  useEffect(() => {
    const host = ref.current;
    if (!host || didInit.current) return;
    didInit.current = true;

    try {
      host.innerHTML = "";
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
      script.async = true;
      script.type = "text/javascript";
      script.innerHTML = JSON.stringify({
        symbol,
        width: "100%",
        height: 180,
        locale: "en",
        dateRange: "1H",
        colorTheme: dark ? "dark" : "light",
        isTransparent: true,
        autosize: true,
      });
      const t = setTimeout(() => host.appendChild(script), 0);
      return () => {
        clearTimeout(t);
        host.innerHTML = "";
      };
    } catch {
      // ignore
    }
  }, [symbol, dark]);

  return (
    <div className="tradingview-widget-container">
      <div ref={ref} />
    </div>
  );
}
