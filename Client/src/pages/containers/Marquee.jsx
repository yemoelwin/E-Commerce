import React from 'react';
import Marquee from 'react-fast-marquee';
import Container from '../../components/common/Container';

const MarqueeSlider = () => {
    return (
        <>
            <Container class1="marque-wrapper py-5">
                <div className="row">
                    <div className="col-12">
                    <div className="marquee-inner-wrapper card-wrapper">
                        <Marquee className='d-flex'>
                        <div className= "mx-4 w-25">
                            <img src="images/brand-01.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-02.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-03.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-04.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-05.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-06.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-07.png" alt="brand" />
                        </div>

                        <div className= "mx-4 w-25">
                            <img src="images/brand-08.png" alt="brand" />
                        </div>

                        </Marquee>
                    </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default MarqueeSlider