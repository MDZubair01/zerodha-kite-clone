import React, { useState, createContext, useContext } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = createContext();

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);

  // Kite Toast Notification State
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success", // 'success' or 'error'
  });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };

  const handleOpenBuyWindow = (uid, price = 0) => {
    setIsBuyWindowOpen(true);
    setIsSellWindowOpen(false);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
  };

  const handleOpenSellWindow = (uid, price = 0) => {
    setIsSellWindowOpen(true);
    setIsBuyWindowOpen(false);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        showToast,
      }}
    >
      {children}

      {/* Floating Kite-style Toast Banner */}
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: toast.type === "error" ? "#d32f2f" : "#2e7d32",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "4px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "13px",
            fontWeight: 500,
            zIndex: 999999,
            animation: "fadeIn 0.25s ease-in-out",
          }}
        >
          <span>{toast.type === "error" ? "✕" : "✓"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          stockPrice={selectedStockPrice}
          closeWindow={handleCloseBuyWindow}
        />
      )}

      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedStockUID}
          stockPrice={selectedStockPrice}
          closeWindow={handleCloseSellWindow}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;