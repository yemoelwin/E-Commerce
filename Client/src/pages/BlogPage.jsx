import React from 'react'
import BlogCart from './containers/BlogCart';
import Container from '../components/common/Container';
import Meta from '../components/common/Meta';
import BreadCrumb from '../components/common/BreadCrumb';

const BlogPage = () => {
    return (
        <>  
            <Meta title={" Blog "} />
            <BreadCrumb title='Blog' />
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                    <div className="row">
                        <div className="col-3">

                            <div className='filter-card mb-3'>
                                <h3 className='filter-title1'>
                                    Find By Categories
                                </h3>
                                <div>
                                    <ul className='ps-0 topics'>
                                        <li className='my-2'>Home</li>
                                        <li className='my-2'>Store</li>
                                        <li className='my-2'>Blogs</li>
                                        <li className='my-2'>Contact</li>
                                    </ul>
                                </div>
                            </div>

                            <div className='filter-card mb-3'>
                            <h3 className='filter-title1'>
                                Popular Topics
                            </h3>
                            <div>
                                <ul className='ps-0 topics'>
                                    <li className='my-2'>Art Paintings</li>
                                    <li className='my-2'>Morgan Dollars</li>
                                    <li className='my-2'>Disney Music</li>
                                    <li className='my-2'>Parallel Sprout</li>
                                    <li className='my-2'>Sports</li>
                                    <li className='my-2'>E-reader</li>
                                    <li className='my-2'>Gym & Training</li>
                                    <li className='my-2'>Morgan Dollars</li>
                                    <li className='my-2'>Disney Music</li>
                                    <li className='my-2'>Parallel Sprout</li>
                                    <li className='my-2'>Sports</li>
                                    <li className='my-2'>E-reader</li>
                                    <li className='my-2'>Omega</li>
                                    <li className='my-2'>EV</li>
                                    <li className='my-2'>Cloud</li>
                                    <li className='my-2'>Morgan Dollars</li>
                                    <li className='my-2'>Disney Music</li>
                                    <li className='my-2'>Parallel Sprout</li>
                                    <li className='my-2'>Sports</li>
                                    <li className='my-2'>E-reader</li>
                                </ul>
                            </div>
                            </div>

                        </div>

                        <div className="col-9">
                            <div className="row">
                                <div className="col-6 px-4 cartmargin">
                                    <BlogCart />
                                </div>
                                <div className="col-6 px-4 cartmargin">
                                    <BlogCart />
                                    </div>
                                <div className="col-6 px-4 cartmargin">
                                    <BlogCart />
                                </div>
                                <div className="col-6 px-4 cartmargin">
                                    <BlogCart />
                                </div>
                            </div>
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default BlogPage