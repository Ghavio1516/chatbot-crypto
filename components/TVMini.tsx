"use client";
import { useEffect, useRef } from "react";

export default function TVMini({
  symbol = "BINANCE:BTCUSDT",
  dark = true
}: {
  symbol?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current; // snapshot untuk cleanup aman
    if (!host) return;

    host.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: 180,
      locale: "en",
      dateRange: "1H",
      colorTheme: dark ? "dark" : "light",
      isTransparent: true,
      autosize: true
    });

    host.appendChild(script);

    return () => {
      // tidak pakai expression-only; benar2 panggil method
      while (host.firstChild) host.removeChild(host.firstChild);
    };
  }, [symbol, dark]);

  return (
    <div className="tradingview-widget-container">
      <div ref={ref} />
    </div>
  );
}
