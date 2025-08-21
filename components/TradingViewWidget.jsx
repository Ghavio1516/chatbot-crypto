import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget({ symbol }) {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "colorTheme": "dark",
        "displayMode": "multiple",
        "isTransparent": true,
        "locale": "en",
        "interval": "1m",
        "disableInterval": false,
        "width": "100%",
        "height": "100%",
        "symbol": "${symbol}",
        "showIntervalTabs": true
      }`;
    container.current.appendChild(script);
  }, [symbol]);  // Re-render the widget when the symbol changes

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a href={`https://www.tradingview.com/symbols/${symbol}/technicals/`} 
           rel="noopener nofollow" target="_blank">
          <span className="blue-text">Technical analysis for {symbol} by TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
