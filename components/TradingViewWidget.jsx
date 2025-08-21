import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "displayMode": "single",
        "isTransparent": false,
        "locale": "en",
        "interval": "1m",
        "disableInterval": false,
        "width": 425,
        "height": 450,
        "symbol": "NASDAQ:AAPL",
        "showIntervalTabs": true
      }`;
    container.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/symbols/NASDAQ-AAPL/technicals/?exchange=NASDAQ" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Technical analysis for AAPL by TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
