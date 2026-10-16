import React from "react";

function CreateTicket() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2 text-muted mb-5">
          To create a ticket, select a relevant topic
        </h1>

        {/* 1. Account Opening */}
        <div className="col-12 col-md-4 p-4">
          <h4 className="fs-5">
            <i className="fa fa-plus-circle me-2" aria-hidden="true"></i> Account Opening
          </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Online Account Opening</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Offline Account Opening</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Company, Partnership and HUF</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>NRI Account Opening</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Charges at Zerodha</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Zerodha IDFC FIRST Bank 3-in-1</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Getting Started</a>
          </div>
        </div>

        {/* 2. Your Zerodha Account */}
        <div className="col-12 col-md-4 p-4">
          <h4 className="fs-5">
            <i className="fa fa-user me-2" aria-hidden="true"></i> Your Zerodha Account
          </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Login Credentials</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Account Modification</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>CMR & DP ID</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Nomination Process</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Transfer and Conversion</a>
          </div>
        </div>

        {/* 3. Trading and Markets */}
        <div className="col-12 col-md-4 p-4">
          <h4 className="fs-5">
            <i className="fa fa-line-chart me-2" aria-hidden="true"></i> Trading and Markets
          </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Trading FAQs</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Kite Web and Mobile</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Margins and Leverage</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Order Types (GTT, AMO)</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Corporate Actions</a>
          </div>
        </div>

        {/* 4. Funds */}
        <div className="col-12 col-md-4 p-4">
          <h4 className="fs-5">
            <i className="fa fa-credit-card me-2" aria-hidden="true"></i> Funds
          </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Adding Funds</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Fund Withdrawal</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>eMandates</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Adding Bank Accounts</a>
          </div>
        </div>

        {/* 5. Console */}
        <div className="col-12 col-md-4 p-4">
          <h4 className="fs-5">
            <i className="fa fa-pie-chart me-2" aria-hidden="true"></i> Console
          </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Reports</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Ledger</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Portfolio</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>60 Day Challenge</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Tax P&L</a>
          </div>
        </div>

        {/* 6. Coin */}
        <div className="col-12 col-md-4 p-4">
         <h4 className="fs-5">
        <i className="fa fa-money me-2" aria-hidden="true"></i> Coin
        </h4>
          <div className="mt-3" style={{ lineHeight: "2.2", fontSize: "14px" }}>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Understanding Mutual Funds</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>About Coin</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Buying and Selling</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Managing SIPs</a>
            <a href="#" className="d-block" style={{ textDecoration: "none" }}>Government Securities</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;