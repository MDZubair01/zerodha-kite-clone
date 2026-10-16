import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left Column: Image */}
        <div className="col-12 col-md-6 text-center p-4">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        {/* Offset Gap */}
        <div className="col-md-1 d-none d-md-block"></div>

        {/* Right Column: Content */}
        <div className="col-12 col-md-5 p-4">
          <h1 className="fs-2">{productName}</h1>
          <p className="text-muted mt-3 fs-6" style={{ lineHeight: "1.8" }}>
            {productDescription}
          </p>

          <div className="mt-3">
            {tryDemo && (
              <a href={tryDemo} style={{ textDecoration: "none" }} className="me-5">
                Try Demo →
              </a>
            )}
            {learnMore && (
              <a href={learnMore} style={{ textDecoration: "none" }}>
                Learn More →
              </a>
            )}
          </div>

          <div className="mt-4">
            {googlePlay && (
              <a href={googlePlay} className="me-3">
                <img
                  src="/media/googlePlayBadge.svg"
                  alt="Google Play"
                  style={{ width: "140px" }}
                />
              </a>
            )}
            {appStore && (
              <a href={appStore}>
                <img
                  src="/media/appstoreBadge (1).svg"
                  alt="App Store"
                  style={{ width: "140px" }}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;