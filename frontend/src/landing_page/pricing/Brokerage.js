import React from "react";

function Brokerage() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 border-top">
        {/* Left Column: Brokerage Calculator */}
        <div className="col-12 col-md-6 p-4">
          <a href="#" style={{ textDecoration: "none" }}>
            <h3 className="fs-5 text-primary mb-4">Brokerage calculator</h3>
          </a>
          <ul
            style={{ lineHeight: "2.2", fontSize: "13px" }}
            className="text-muted ps-3"
          >
            <li>
              Call & Trade and RMS auto-squareoff: Additional charges of ₹50 +
              GST per order.
            </li>
            <li>Digital contract notes will be sent via e-mail.</li>
            <li>
              Physical copies of contract notes, if required, shall be charged
              ₹20 per contract note. Courier charges apply.
            </li>
            <li>
              For NRI account (non-PIS), 0.5% or ₹100 per executed order for
              equity (whichever is lower).
            </li>
            <li>
              For NRI account (PIS), 0.5% or ₹200 per executed order for equity
              (whichever is lower).
            </li>
            <li>
              If the account is in debit balance, any order placed will be
              charged ₹40 per executed order instead of ₹20 per executed order.
            </li>
          </ul>
        </div>

        {/* Right Column: List of Charges */}
        <div className="col-12 col-md-6 p-4">
          <a href="#" style={{ textDecoration: "none" }}>
            <h3 className="fs-5 text-primary mb-4">List of charges</h3>
          </a>
          <ul
            style={{ lineHeight: "2.2", fontSize: "13px" }}
            className="text-muted ps-3"
          >
            <li>
              STT/CTT: Tax levied by the government on the transaction value.
            </li>
            <li>
              Transaction/Turnover charges: Charged by exchanges (NSE, BSE, MCX).
            </li>
            <li>
              Call & Trade: ₹50 per order placed through a dealer.
            </li>
            <li>
              Stamp charges: 0.015% or ₹1500 / crore on buy side for equity delivery.
            </li>
            <li>
              GST: 18% on (brokerage + SEBI charges + transaction charges).
            </li>
            <li>
              SEBI Charges: ₹10 per crore + GST by SEBI for market regulation.
            </li>
            <li>
              DP (Depository participant) charges: ₹15.34 per scrip on delivery sale.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Brokerage;