import React from 'react';

function Stats() {
    return ( 
        <div className="container p-3">
            <div className="row p-5">
            <div className="col-6 p-5">
                <h1 className="fs-2 mb-5">Trust with Confidence</h1>
                <h2 className="fs-4">Customer-first always</h2>
                <p className="text-muted" > That's why we have 1.3+crore customers trust Zerodha with $3.5+ lakh crores worth of 
                    equity investments.</p>
                <h2 className="fs-4">No spam or gimmicks</h2>
                <p className="text-muted"   > No gimmicks, spam, "gamification", or annoying push notifications. High 
                    Quality apps that you use at your pace, the way you like.</p>
                <h2 className="fs-4">The Zerodha universe</h2>
                <p className="text-muted" >Not just an app, but a whole ecosystem. Out investments in 30+ fintech 
                    startups offer you tailored services spedific to your needs. </p>
                <h2 className="fs-4">Do better with money</h2>
                <p className="text-muted" >with initiatives like Nudge and Kill Switch, we don't just facilitate 
                    transactions, but actively help you do better with you money.</p>
            </div>
             <div className="col-6 p-5">
             <img src="/media/ecosystem.png" style={{ width: '90%' }} />
        <div className="text-center">
            <a href="" className='mx-5' style={{textDecoration:'none'}} >Explore our products <i class= "fa fa-long-arrow-right" aria-hidden="true"></i></a>
            <a href="" style={{textDecoration:'none'}}> Try Kitte demo <i class= "fa fa-long-arrow-right" aria-hidden="true"> </i></a>   
        </div>
        </div>
   </div>
 </div>
     );
}

export default Stats;