import React from 'react';

function Education() {
    return ( 
        <div className="container mt-5">
            <div className="row">
             <div className="col-6">
<img src="/media/education (1).svg" alt="Varsity education"className="img-fluid" style={{ width: "70%" }}
          /></div>
            <div className="col-6">
                <h1 className="mb-3 fs-2 " >Free and open market education</h1>
                <p>Varsity, the largest online stock market education book in the world
                covering everything from the basics of the stock market to advanced trading.</p>
                <a href="" style={{textDecoration:'none'}}> Versity <i class= "fa fa-long-arrow-right" aria-hidden="true"></i></a>
                <p className="mt-5" >Trading Q&A, the most active trading and community in India for all market your related queries.
                </p>
                <a href="" style={{textDecoration:'none'}}> TradingQ&A <i class= "fa fa-long-arrow-right" aria-hidden="true"></i></a>
                     </div>
                 </div>
              </div>    
     );
}

export default Education;
