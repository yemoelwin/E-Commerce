import React from 'react';
import { Link } from 'react-router-dom';
import DateTime from './DateTime';

const BlogCart = () => {
    return (
    <>
        {/* <div className='col-3'> */} 
                <div className="blog-card">
                    <div className='card-image'>
                        <img src="images/blog-1.jpg" className='img-fluid w-100 ' alt="blog" />
                        </div>
                    <div className='blog-content'>
                        <p className='date'> <DateTime /> </p>
                        <h5 className="title">A beautiful sunday morning with pleasures.</h5>
                        <p className="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia odio debitis ut fuga nesciunt sequi perferendis molestias atque accusamus, explicabo iste, quae nobis obcaecati repellendus!</p>
                        <Link to='/blog/:id' className='button'>Read More</Link>
                    </div>
            </div>        
        {/* </div> */}
    </>
    )
}

export default BlogCart