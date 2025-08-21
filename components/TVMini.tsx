"use client";
import { useEffect, useRef } from "react";

export default function TVMini({ symbol = "BINANCE:BTCUSDT", dark = true }: { symbol?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol,
      width: "100%",
      height: 180,
      locale: "en",
      dateRange: "1D",
      colorTheme: dark ? "dark" : "light",
      isTransparent: true,
      autosize: true
    });

    ref.current.appendChild(script);
    return () => { ref.current && (ref.current.innerHTML = ""); };
  }, [symbol, dark]);

  return <div className="tradingview-widget-container"><div ref={ref} /></div>;
}
