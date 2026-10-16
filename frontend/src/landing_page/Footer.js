import React from 'react';

function Footer() {
    return ( 
        <footer style={{backgroundcolor:"rgb(250,250,250)"}}>
<div className="container border-top mt-5">
    <div className="row mt-5">
        <div className="col">
<img src="/media/logo (1).svg" alt="logo" width="100"/>
<p>
    &copy; 2010 - 2024, Not Zerodha Broking Ltd. All rights reserved.
    </p>
        </div>
        <div className="col">
            <p> Company </p>
            <a href="#"className="d-block mb-2 text-muted text-decoration-none">About</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Products</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Pricing</a>
             <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Referral Program</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Zerodha.tech</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Zerodha cares</a>
        </div>  
        <div className="col">
        <p> Support </p>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >About Contact</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Support portal</a>
             <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Connect blog</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >List of charges</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Downloads & Resources</a>
        </div>
        <div className="col">
        <p> Account </p>
          <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Contact</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Open an account</a>
             <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >Fund transfer</a>
            <a href="#" className=" d-block mb-2 text-muted text-decoration-none" >60 day challenge</a>
        </div>
    </div > 
    <div className="mt-5 text-muted" style={{fontSize : "14px"}}>
    <p> Zerodha Broking LTD.: Member of NSE & BSE - SEBI Registration no.: INZ000161633. 
        CDSL: Depository services through Zerodha Securities Pvt. Ltd. - SEBI Registration 
        no.:IN-DP-100-2015 Commodity Trading through Zerodha Commodities Pvt. Ltd. MCX:46025 
        - SEBI Registration no.: INZ00038238 Registered Address: Zerodha BrokingLtd., #153/154,
        4th Cross, Dollars Colony,Opp. Clarance Public School, J.P Nagar 4th Phase, Bengaluru - 56078,
        Karnataka, India. For any complaints pertaining to securities broking  please write  
        to complaints@zerodha.com,for DP related to dp@zerodha.com. Please ensure you carefully read the Risk disclosure Document as prescribed by SEBI | ICF  
    </p>

    <p> Procedure to file a complain on SEBI SCORES: Register on SCORES portal. Mandatory
        details for filing complaints on SCORES: Name, PAN, Address, Mobile Numbers, E-mail ID.
        Benefites: EffectiveCommunication, Speedy redressal of the grievances
    </p>


    <p> Investments in securities market are subject to market risks, read all the related documents carefully before investing.</p>

    <p>"Prevent unauthorized access to your account. Update your mobile number/email
    IDs with your stock brokers. Receive information of your transaction directly from
    Exchange on your mobile/email at the end of the day. Issued in the internet of investors.
    KYC is one time done through SEBI registered intermediaty (broker, DP, Mutual Fund etc.), you need not underge the same 
    process again when you approach another intermediatory.
    </p>
</div>
</div>
<div className="container border-top mt-5 pt-3 text-center text-muted fs-7">
  <div className="row">
    <div className="col">
      <a href="#" className="mx-2 text-muted text-decoration-none">NSE</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">BSE</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">MCX</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">Terms & conditions</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">Policies & procedures</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">Privacy policy</a>
      <a href="#" className="mx-2 text-muted text-decoration-none">Disclosure</a>
    </div>
  </div>
</div>
</footer>
    );
}

export default Footer;