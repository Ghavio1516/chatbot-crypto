"use client";

import { useEffect, useRef } from "react";

type TVSymbol = { proName: string; title?: string };
type Props = {
  symbols?: TVSymbol[];
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
    const mount = containerRef.current; // snapshot
    if (!mount) return;

    mount.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;

    const cfg = {
      symbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "regular",
      colorTheme: dark ? "dark" : "light",
      locale: "en"
    };

    script.innerHTML = JSON.stringify(cfg);
    mount.appendChild(script);

    return () => {
      while (mount.firstChild) mount.removeChild(mount.firstChild);
    };
  }, [symbols, dark]); // jelas & sederhana

  return (
    <div className="tradingview-widget-container">
      <div
        ref={containerRef}
        className="tradingview-widget-container__widget"
      />
    </div>
  );
}
