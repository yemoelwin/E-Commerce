import React from 'react'
import { LiaLongArrowAltLeftSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';
const CheckoutSuccess = () => {
    return (
        <>
            <div className='checkout_success'>
                <div className=''>
                    <h4>Checkout Success</h4>
                    <Link to={`/`} className='to_shopping'><LiaLongArrowAltLeftSolid className='arrow'/>Go to shopping</Link>
                </div>
            </div>
        </>
    )
}

export default CheckoutSuccess;