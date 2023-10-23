import React, { useEffect, useState } from 'react'
import Meta from '../containers/common/Meta'
import BreadCrumb from '../containers/common/BreadCrumb'
import Container from '../containers/common/Container'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { getBlog } from '../features/blog/blogSlice';
import { PiGitlabLogoFill } from 'react-icons/pi';

const SingleBlog = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const blogId = location.pathname.split('/')[2];
    const [isLoading, setIsLoading] = useState(true);
    const singleBlog = useSelector((state) => state?.blog?.singleBlogData)

    useEffect(() => {
        const data = async () => {
            setIsLoading(true);
            try {
                await dispatch(getBlog(blogId))
            } catch (error) {
                console.error('error', error);
                throw new Error('Something went wrong while retrieving data.')
            } finally {
                setIsLoading(false);
            }
        }
        data();
    },[blogId])

    return (
        <>
            <Meta title={"Dynamic Blog Name"} />
            <BreadCrumb title={<PiGitlabLogoFill />}></BreadCrumb>
            <Container class1="blog-wrapper home-wrapper-2 py-5">
                <div className="single-blogX">

                    <div className="col-9" >
                        {isLoading ? ( // Show loading indicator when isLoading is true
                            <div className='loadingX gap-3'>
                                <div className='loading-spinner'></div>
                                <div className='load'>Loading ... </div>
                            </div>
                        ) : (
                            <div className="single-blog-card">
                                <Link to={`/blog`} className="d-flex align-items-center gap-10">
                                    <HiOutlineArrowLeft className="fs-4" /> Go back to Blogs
                                </Link>

                                <h3 className="title">{singleBlog?.title}</h3>
                                    
                                <div className='blogImg'>
                                    <img src={singleBlog?.images[0].url} className="img-fluid my-4" alt="blog" />
                                </div>
                                        
                                <p>{singleBlog?.description}</p>
                            </div>
                        )}
                    </div>

                </div>
            </Container>
        </>
    )
}

export default SingleBlog