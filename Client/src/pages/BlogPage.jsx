import React, { useEffect, useState } from 'react'
import BlogCart from '../containers/BlogCart';
import Container from '../containers/common/Container';
import Meta from '../containers/common/Meta';
import BreadCrumb from '../containers/common/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlog } from '../features/blog/blogSlice';

const BlogPage = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const blogState = useSelector((state) => state.blog.blogs);

    useEffect(() => {
        const blogPosts = async () => {
            try {
                await dispatch(getAllBlog());
                setIsLoading(false);
            } catch (error) {
                console.error('error', error);
                throw new Error('Something went wrong while fetching blog data');
            }
        };
        blogPosts();
    }, []);

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
                            <div className="">
                                <div className="col-12 px-4 cartmargin">
                                    {isLoading ? ( // Show loading indicator when isLoading is true
                                        <div className='loadingX gap-3'>
                                            <div className='loading-spinner'></div>
                                            <div className='load'>Loading ... </div>
                                        </div>
                                    ) : (
                                        <div className='grid-container'>
                                            <BlogCart className="" blogData={blogState ? blogState : []} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default BlogPage