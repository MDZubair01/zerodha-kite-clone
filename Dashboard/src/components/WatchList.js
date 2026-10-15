import React, { useState, useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";

const initialWatchlist = [
  { name: "INFY", price: 1556.60, percent: -0.21, isDown: true },
  { name: "ONGC", price: 116.11, percent: 0.14, isDown: false },
  { name: "TCS", price: 3197.37, percent: -0.20, isDown: true },
  { name: "KPITTECH", price: 266.93, percent: 0.45, isDown: false },
  { name: "QUICKHEAL", price: 309.42, percent: -0.28, isDown: true },
  { name: "WIPRO", price: 578.32, percent: 0.39, isDown: false },
  { name: "M&M", price: 778.34, percent: -0.63, isDown: true },
  { name: "RELIANCE", price: 2111.15, percent: -0.15, isDown: true },
  { name: "HDFCBANK", price: 1522.55, percent: 0.05, isDown: false },
];

const WatchList = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist((prevList) =>
        prevList.map((stock) => {
          const pctDelta = Math.random() * 0.4 - 0.2;
          const priceMultiplier = 1 + pctDelta / 100;
          const newPrice = parseFloat((stock.price * priceMultiplier).toFixed(2));
          const newPercent = parseFloat((stock.percent + pctDelta).toFixed(2));
          const isDown = pctDelta < 0;

          return {
            ...stock,
            price: newPrice,
            percent: newPercent,
            isDown,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const filteredList = watchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div
      className="watchlist-container"
      style={{
        width: "380px",
        minWidth: "380px",
        maxWidth: "380px",
        flex: "0 0 380px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        overflowX: "hidden",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      {/* Search Header */}
      <div
        className="search-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          backgroundColor: "#ffffff",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder="Search eg: infy, bse, nifty fut, gold mcx"
          className="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            border: "none",
            outline: "none",
            fontSize: "13px",
            width: "80%",
            color: "#333",
            backgroundColor: "transparent",
          }}
        />
        <span style={{ fontSize: "12px", color: "#999", whiteSpace: "nowrap" }}>
          {filteredList.length} / 50
        </span>
      </div>

      {/* Stocks List */}
      <ul
        className="list"
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
        }}
      >
        {filteredList.length === 0 ? (
          <li
            style={{
              padding: "28px 16px",
              textAlign: "center",
              color: "#888",
              fontSize: "13px",
            }}
          >
            No stocks found matching "{searchQuery}"
          </li>
        ) : (
          filteredList.map((stock) => (
            <WatchListItem stock={stock} key={stock.name} />
          ))
        )}
      </ul>
    </div>
  );
};

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
      style={{
        position: "relative",
        padding: "13px 18px",
        borderBottom: "1px solid #f2f2f2",
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: showWatchlistActions ? "#f9fbfd" : "#ffffff",
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        width: "100%",
        minHeight: "48px",
      }}
    >
      {/* Instrument Name */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: stock.isDown ? "#d32f2f" : "#2e7d32",
            letterSpacing: "0.2px",
          }}
        >
          {stock.name}
        </span>
      </div>

      {/* Normal Price Display (Hidden on hover so action buttons cleanly take over) */}
      <div
        style={{
          display: showWatchlistActions ? "none" : "flex",
          alignItems: "center",
          gap: "8px",
          marginLeft: "auto",
        }}
      >
        <span style={{ fontSize: "12px", color: "#888", minWidth: "46px", textAlign: "right" }}>
          {stock.percent > 0 ? "+" : ""}
          {stock.percent.toFixed(2)}%
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: stock.isDown ? "#d32f2f" : "#2e7d32",
            lineHeight: 1,
          }}
        >
          {stock.isDown ? "↓" : "↑"}
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 500,
            minWidth: "78px",
            textAlign: "right",
            color: "#333",
          }}
        >
          ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Hover Floating Action Buttons */}
      {showWatchlistActions && (
        <WatchListActions uid={stock.name} price={stock.price} />
      )}
    </li>
  );
};

const WatchListActions = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = (e) => {
    e.stopPropagation();
    if (generalContext?.openBuyWindow) {
      generalContext.openBuyWindow(uid, price);
    }
  };

  const handleSellClick = (e) => {
    e.stopPropagation();
    if (generalContext?.openSellWindow) {
      generalContext.openSellWindow(uid, price);
    }
  };

  const handleAnalyticsClick = (e) => {
    e.stopPropagation();
    if (generalContext?.openAnalyticsWindow) {
      generalContext.openAnalyticsWindow(uid, price);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        right: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.14)",
        padding: "3px 6px",
        borderRadius: "4px",
        zIndex: 10,
      }}
    >
      <button
        type="button"
        onClick={handleBuyClick}
        style={{
          backgroundColor: "#387ed1",
          color: "#ffffff",
          border: "none",
          padding: "4px 10px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        BUY
      </button>
      <button
        type="button"
        onClick={handleSellClick}
        style={{
          backgroundColor: "#ff5722",
          color: "#ffffff",
          border: "none",
          padding: "4px 10px",
          borderRadius: "3px",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        SELL
      </button>
      <button
        type="button"
        onClick={handleAnalyticsClick}
        title="Technicals & Charts"
        style={{
          backgroundColor: "#f5f5f5",
          border: "1px solid #ddd",
          padding: "3px 7px",
          borderRadius: "3px",
          fontSize: "12px",
          cursor: "pointer",
          lineHeight: 1.2,
        }}
      >
        📊
      </button>
    </div>
  );
};

export default WatchList;