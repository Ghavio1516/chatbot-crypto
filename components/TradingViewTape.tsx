"use client";

import { useEffect, useRef } from "react";

type TVSymbol = { proName: string; title?: string };
type Props = { symbols?: TVSymbol[]; dark?: boolean };

export default function TradingViewTape({
  dark = true,
  symbols = [
    { proName: "BINANCE:BTCUSDT", title: "BTC" },
    { proName: "BINANCE:ETHUSDT", title: "ETH" },
    { proName: "BINANCE:SOLUSDT", title: "SOL" },
    { proName: "BINANCE:XRPUSDT", title: "XRP" },
  ],
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const didInit = useRef(false); // cegah init ganda (StrictMode/dev)

  useEffect(() => {
    const host = boxRef.current;
    if (!host || didInit.current) return;
    didInit.current = true;

    try {
      // bersihkan sisa render
      host.innerHTML = "";

      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.async = true;
      script.type = "text/javascript";

      const cfg = {
        symbols: Array.isArray(symbols) ? symbols : [],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "regular",
        colorTheme: dark ? "dark" : "light",
        locale: "en",
      };
      script.innerHTML = JSON.stringify(cfg);

      // delay 1 tick supaya DOM siap & menghindari race di sebagian browser
      const t = setTimeout(() => {
        host.appendChild(script);
      }, 0);

      return () => {
        clearTimeout(t);
        host.innerHTML = "";
      };
    } catch {
      // swallow—biar tidak crash seluruh app
    }
  }, [dark, symbols]);

  return (
    <div className="tradingview-widget-container">
      <div ref={boxRef} className="tradingview-widget-container__widget" />
    </div>
  );
}
