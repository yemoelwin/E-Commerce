import React from 'react'
import Container from './common/Container';
import { services } from '../utils/Data';

const Offer = () => {
    return (
        <>  
        <Container class1='home-wrapper-2 py-5'>
            <div className="row">
                    <div className="col-12">
                        <div className="services d-flex align-items-center justify-content-between">
                            {
                                services?.map((data , j) =>{
                                    return(
                                        <div className = 'd-flex align-items-center gap-15' key={j}>
                                            <img src={data.image} alt="services" />
                                            <div>
                                                <h6>{data.title}</h6>
                                                <p className='mb-0'>{ data.tagline }</p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
            </div>
        </Container>
        </>
    )
}

export default Offer