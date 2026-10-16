import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The Zerodha Universe</h1>
        <p className="text-muted mt-2">
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        {/* Smallcase */}
        <div className="col-4 p-3 mt-5">
          <img
            src="/media/smallcaseLogo.png"
            alt="Smallcase"
            style={{ width: "45%" }}
          />
          <p className="text-small text-muted mt-3">Thematic investment platform</p>
        </div>

        {/* Streak */}
        <div className="col-4 p-3 mt-5">
          <img
            src="/media/streakLogo.png"
            alt="Streak"
            style={{ width: "40%" }}
          />
          <p className="text-small text-muted mt-3">Algo & strategy platform</p>
        </div>

        {/* Sensibull */}
        <div className="col-4 p-3 mt-5">
          <img
            src="/media/sensibullLogo (1).svg"
            alt="Sensibull"
            style={{ width: "50%" }}
          />
          <p className="text-small text-muted mt-3">Options trading platform</p>
        </div>

        {/* Zerodha Fund House */}
        <div className="col-4 p-3 mt-4">
          <img
            src="/media/zerodhaFundhouse (1).png"
            alt="Zerodha Fund House"
            style={{ width: "50%" }}
          />
          <p className="text-small text-muted mt-3">Asset management</p>
        </div>

        {/* GoldenPi */}
        <div className="col-4 p-3 mt-4">
          <img
            src="/media/goldenpiLogo.png"
            alt="GoldenPi"
            style={{ width: "45%" }}
          />
          <p className="text-small text-muted mt-3">Bonds trading platform</p>
        </div>

        {/* Ditto */}
        <div className="col-4 p-3 mt-4">
          <img
            src="/media/dittoLogo (1).png"
            alt="Ditto Insurance"
            style={{ width: "35%" }}
          />
          <p className="text-small text-muted mt-3">Insurance</p>
        </div>

        {/* Bottom CTA Button */}
        <button
          className="btn btn-primary fs-5 mt-5 mb-5"
          style={{ width: "200px", margin: "0 auto" }}
        >
          Sign up for free
        </button>
      </div>
    </div>
  );
}

export default Universe;