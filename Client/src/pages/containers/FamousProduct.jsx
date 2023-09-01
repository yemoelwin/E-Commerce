import React from 'react'
import Container from '../../components/common/Container';

const FamousProduct = () => {
    return (
        <>
            <Container class1='famous-wrapper py-3 home-wrapper-2'>
                <div className="row">
                    <div className="col-12">
                        <h3 className="section-heading">
                            Our Famous Products
                        </h3>
                    </div>
                
                    <div className="col-12">
                        <div className="famous-card d-flex gap-25 ">

                            <div className='position-relative border'>
                                <div>
                                    <img src="images/famous-1.webp" className='img-fluid' alt="famous" />
                                </div>
                                <div className="famous-content position-absolute">
                                    <h5>Big Screen</h5>
                                    <h6>Smart Watch Series</h6>
                                    <p>From $399 or $16.42/mo. for 30 mo.*</p>
                                </div>
                            </div>

                            <div className='position-relative border'>
                                <div>
                                    <img src="images/famous-2.webp" className='img-fluid' alt="famous" />
                                </div>
                                <div className="famous-content position-absolute ">
                                    <h5 className='text-dark'>Studio Display</h5>
                                    <h6 className='text-dark'>600nits of brightness</h6>
                                    <p className='text-dark'>27-inch 5k Retina Display</p>
                                </div>
                            </div>

                            <div className='position-relative border'>
                                <div>
                                    <img src="images/famous-3.webp" className='img-fluid' alt="famous" />
                                </div>
                                <div className="famous-content position-absolute">
                                    <h5 className='text-dark'>SmartPhones</h5>
                                    <h6 className='text-dark'>Smart Phone 13 Pro</h6>
                                    <p className='text-dark'>From $999 or $46.42/mo. for 50 mo.*</p>
                                </div>
                            </div>

                            <div className='position-relative border'>
                                <div>
                                    <img src="images/famous-4.webp" className='img-fluid' alt="famous" />
                                </div>
                                <div className="famous-content position-absolute">
                                    <h5 className='text-dark'>Home Speaker</h5>
                                    <h6 className='text-dark'>Room Filling Sound</h6>
                                    <p className='text-dark'>From $799 or $116.42/mo. for 30 mo.*</p>
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>
            </Container>     
        </>    
    )
}

export default FamousProduct