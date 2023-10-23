import React from 'react'
import { LiaLongArrowAltLeftSolid } from 'react-icons/lia';
import { RiErrorWarningFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
const CheckoutCancel = () => {
    return (
        <>
            <div className='checkout_success'>
                <div>
                    <div className="alertX alert-success alert" role="alert">
                        <RiErrorWarningFill className='fs-5'/>
                        <h5>Failed! We truely apologize for the inconvenience.</h5>
                    </div>
                        
                    <div className='mt-0 ms-0'>
                        <Link to={`/`} className='to_shopping'><LiaLongArrowAltLeftSolid className='arrow'/>Go to shopping</Link>
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default CheckoutCancel;