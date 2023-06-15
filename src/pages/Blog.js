import React from 'react'
import Meta from '../components/Product/Meta';
import BreadCrumb from '../components/Product/BreadCrumb';
import BlogPage from '../components/Blogs/BlogPage';

const Blog = () => {
    return (
        <>
            <Meta title={" Blog "} />
            <BreadCrumb title='Blog' />
            <BlogPage />
        </>
    )
}

export default Blog