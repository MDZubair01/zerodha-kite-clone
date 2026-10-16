import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductPage() {
  return (
    <>
      <Hero />

      {/* Kite */}
      <LeftSection
        imageURL="/media/kite (1).png"
        productName="Kite"
        productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo="#"
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      {/* Console */}
      <RightSection
        imageURL="/media/console (1).png"
        productName="Console"
        productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisations."
        learnMore="#"
      />

      {/* Coin */}
      <LeftSection
        imageURL="/media/coin (1).png"
        productName="Coin"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
        tryDemo="#"
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      {/* Kite Connect */}
      <RightSection
        imageURL="/media/kiteconnect (1).png"
        productName="Kite Connect"
        productDescription="Build powerful trading platforms and experiences with our super simple HTTP/JSON APIs. If you are a startup, build your investment app and showcase it to our clientbase."
        learnMore="#"
      />

      {/* Varsity */}
      <LeftSection
        imageURL="/media/varsity (1).png"
        productName="Varsity mobile"
        productDescription="An easy to grasp, collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-size cards to help you learn on the go."
        tryDemo="#"
        learnMore="#"
        googlePlay="#"
        appStore="#"
      />

      <div className="container text-center my-5">
        <p className="fs-5 text-muted">
          Want to know more about our technology stack? Check out the{" "}
          <a href="#" style={{ textDecoration: "none" }}>
            Zerodha.tech
          </a>{" "}
          blog.
        </p>
      </div>

      <Universe />
    </>
  );
}

export default ProductPage;