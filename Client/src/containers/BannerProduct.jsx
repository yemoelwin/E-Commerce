import React from "react";
import { Link } from "react-router-dom";
import Container from "./common/Container";

const BannerProduct = () => {
	return (
		<>
			<Container class1='home-wrapper-1 py-5'>
				<div className='row'>
					<div className='col-6'>
						<div className='main-banner position-relative '>
							<img
								src='images/main-banner-1.jpg'
								className='img-fluid rounded-3'
								alt='main banner'
							/>
							<div className='main-banner-content position-absolute'>
								<h4>SUPERSMOOTH FOR PROS.</h4>
								<h5>SL14+ Pro</h5>
								<p>$799 on Sale</p>
								<Link className='button'>Buy Now</Link>
							</div>
						</div>
					</div>

					<div className='col-6'>
						<div className='d-flex flex-wrap gap-10 justify-content-between align-items-center'>
							<div className='small-banner position-relative '>
								<img
									src='images/catbanner-01.jpg'
									className='img-fluid rounded-3'
									alt='main banner'
								/>
								<div className='small-banner-content position-absolute'>
									<h4>BEST Sale FOR YOU.</h4>
									<h5>HP Pro</h5>
									<p>$1799 on Sale</p>
								</div>
							</div>

							<div className='small-banner position-relative '>
								<img
									src='images/catbanner-02.jpg'
									className='img-fluid rounded-3'
									alt='main banner'
								/>
								<div className='small-banner-content position-absolute'>
									<h4>15% OFF</h4>
									<h5>SmartWatch 7</h5>
									<p>
										Shop the latest brand <br /> styles and colors.
									</p>
								</div>
							</div>

							<div className='small-banner position-relative mt-1'>
								<img
									src='images/catbanner-03.jpg'
									className='img-fluid rounded-3'
									alt='main banner'
								/>
								<div className='small-banner-content position-absolute'>
									<h4>NEW ARRIVAL</h4>
									<h5>Buy IPad Air</h5>
									<p>$1799 on Sale</p>
								</div>
							</div>

							<div className='small-banner position-relative mt-1 '>
								<img
									src='images/catbanner-04.jpg'
									className='img-fluid rounded-3'
									alt='main banner'
								/>
								<div className='small-banner-content position-absolute'>
									<h4>Better Choice For You</h4>
									<h5>
										HeadPhone <br /> Pro
									</h5>
									<p>$999 on Sale</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};

export default BannerProduct;
