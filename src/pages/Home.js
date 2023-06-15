import React from 'react';
import BlogCart from '../components/Home/BlogCart';
import CardProduct from '../components/Home/CardProduct';
import SpecialProduct from '../components/Home/SpecialProduct';
import FamousProduct from '../components/Home/FamousProduct';
import MarqueeSlider from '../components/Home/Marquee';
import Offer from '../components/Home/Offer';
import Items from '../components/Home/Items';
import BannerProduct from '../components/Home/BannerProduct';
import Container from '../components/Container/Container';

const Home = () => {
  return (
    <>
      <BannerProduct />

      <Offer />

      <Items />

      <Container class1='featured-wrapper py-5 home-wrapper-2 '>
        <div className="row">
            <div className="col-12">
              <h3 className="section-heading">
                Featured Collections
              </h3>
            </div>
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />
        </div>
      </Container>

      <FamousProduct />
      
      <Container class1='special-wrapper py-5 home-wrapper-2'>
          <div className="row">
            <div className="col-12">
              <div className="section-heading">Special Products</div>
            </div>
          </div>

          <div className="row">
            <SpecialProduct />
            <SpecialProduct />
            <SpecialProduct />
            <SpecialProduct />
          </div>
      </Container>

      <Container class1="popular-wrapper py-3 home-wrapper-2 ">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">
                Our Popular Products 1
              </h3>
            </div>
          
            <CardProduct />
            <CardProduct />
            <CardProduct />
            <CardProduct />

          </div>
      </Container>

      < MarqueeSlider />

      <Container class1="blog-wrapper py-5 home-wrapper-2">
          <div className="row">
            <div className="col-12">
              <h3 className="section-heading">
                Our Latest Blogs
              </h3>
            </div>
            
            <div className="col-12 mb-5 d-flex gap-20">
              <BlogCart />
              <BlogCart />
              <BlogCart />
              <BlogCart />
            </div>
          </div>
      </Container>

    </>
  )
}

export default Home