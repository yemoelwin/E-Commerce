import React, { useEffect, useState } from 'react'
import BlogCart from './containers/BlogCart';
import CardProduct from './containers/CardProduct';
import SpecialProduct from './containers/SpecialProduct';
import FamousProduct from './containers/FamousProduct';
import MarqueeSlider from './containers/Marquee';
import Offer from './containers/Offer';
import Items from './containers/Items';
import BannerProduct from './containers/BannerProduct';
import Container from '../components/common/Container';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlog } from '../features/blog/blogSlice';

const Home = () => {
  
  const dispatch = useDispatch();
  const indexBlogData = useSelector((state) => state?.blog?.blogs);
  useEffect(() => {
        const homeBlogPosts = async () => {
            try {
                await dispatch(getAllBlog());
                // setIsLoading(false);
            } catch (error) {
                console.error('error', error);
                throw new Error('Something went wrong while fetching blog data');
            }
        };
        homeBlogPosts();
  }, []);

  const sortedBlogData = [...(indexBlogData || [])].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  const latest4Blogs = sortedBlogData.slice(0, 4);
  
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
            <div className="">
              <h3 className="section-heading">
                Our Latest Blogs
              </h3>
            </div>
            
            <div className="d-flex gap-20 blogCart">
              <BlogCart className='blogCart' blogData={latest4Blogs ? latest4Blogs : []} />
            </div>
          </div>
        
      </Container>

    </>
  )
}

export default Home