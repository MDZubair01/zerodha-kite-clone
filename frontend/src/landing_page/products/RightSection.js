import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left Column: Text & Link */}
        <div className="col-12 col-md-5 p-5">
          <h1 className="fs-2">{productName}</h1>
          <p className="text-muted mt-3 fs-6" style={{ lineHeight: "1.8" }}>
            {productDescription}
          </p>
          <div>
            <a href={learnMore} style={{ textDecoration: "none" }}>
              Learn More →
            </a>
          </div>
        </div>

        {/* Offset Gap */}
        <div className="col-md-1 d-none d-md-block"></div>

        {/* Right Column: Image */}
        <div className="col-12 col-md-6 text-center">
          <img
            src={imageURL}
            alt={productName}
            className="img-fluid"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}

export default RightSection;