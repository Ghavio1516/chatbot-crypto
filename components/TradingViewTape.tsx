"use client";

import { useEffect, useRef } from "react";

type Props = {
  symbols?: { proName: string; title?: string }[];
  dark?: boolean;
};

export default function TradingViewTape({
  dark = true,
  symbols = [
    { proName: "BINANCE:BTCUSDT", title: "BTC" },
    { proName: "BINANCE:ETHUSDT", title: "ETH" },
    { proName: "BINANCE:SOLUSDT", title: "SOL" },
    { proName: "BINANCE:XRPUSDT", title: "XRP" },
    { proName: "BINANCE:BNBUSDT", title: "BNB" },
    { proName: "BINANCE:ADAUSDT", title: "ADA" },
    { proName: "BINANCE:DOGEUSDT", title: "DOGE" }
  ]
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // bersihkan widget lama (kalau re-render)
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "regular",
      colorTheme: dark ? "dark" : "light",
      locale: "en"
    });

    containerRef.current.appendChild(script);

    return () => {
      // cleanup
      containerRef.current && (containerRef.current.innerHTML = "");
    };
  }, [dark, JSON.stringify(symbols)]); // re-init kalau daftar simbol/tema berubah

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
}
