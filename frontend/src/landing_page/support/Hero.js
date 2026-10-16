import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero" style={{ backgroundColor: "#387ed1", color: "#fff" }}>
      <div className="container py-5">
        {/* Top Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h4 className="fs-5 m-0 fw-semibold">Support Portal</h4>
          <a
            href="#"
            className="text-white text-decoration-underline fs-6"
          >
            Track tickets
          </a>
        </div>

        {/* Content Row */}
        <div className="row align-items-start">
          {/* Left Column: Search & Quick Links */}
          <div className="col-12 col-md-7 pe-md-5">
            <h1 className="fs-4 mb-4 fw-normal" style={{ lineHeight: "1.4" }}>
              Search for answers or browse help topics to create a ticket
            </h1>

            <div className="mb-4">
              <input
                type="text"
                className="form-control rounded-1 py-3 px-3 fs-6"
                placeholder="Eg. how do I activate F&O, why is my order getting rejected."
                style={{ border: "none" }}
              />
            </div>

            <div className="d-flex flex-wrap gap-3">
              <a href="#" className="text-white text-decoration-underline fs-6">
                Track account opening
              </a>
              <a href="#" className="text-white text-decoration-underline fs-6">
                Track segment activation
              </a>
              <a href="#" className="text-white text-decoration-underline fs-6">
                Intraday margins
              </a>
              <a href="#" className="text-white text-decoration-underline fs-6">
                Kite user manual
              </a>
            </div>
          </div>

          {/* Right Column: Featured */}
          <div className="col-12 col-md-5 ps-md-4 mt-4 mt-md-0">
            <h1 className="fs-4 mb-4 fw-normal">Featured</h1>
            <ol className="ps-3" style={{ lineHeight: "2.3" }}>
              <li>
                <a href="#" className="text-white text-decoration-underline fs-6">
                  Current Takeovers and Delisting - January 2024
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-underline fs-6">
                  Latest Intraday leverages - MIS & CO
                </a>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;