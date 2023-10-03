import React from 'react';
import { Link } from 'react-router-dom';
// import DateTime from './DateTime';
import moment from 'moment';

const BlogCart = (props) => {
    const { blogData } = props;

    return (
    <>
            {
                blogData?.map((item, index) => {
                    return (
                        <div className="blog-card mb-3" key={index}>
                            <div className='card-image'>
                                <img src={item?.images[0].url} className='img-fluid w-100 ' alt="blog" />
                            </div>
                            <div className='blog-content'>
                                <p className='date'>{moment(item?.createdAt).format('MMMM Do YYYY, h:mm a')}</p>
                                <h5 className="title">
                                    {/* {item?.title.length > 22
                                        ? `${item?.title.substr(0, 22)}...`
                                        : item?.title
                                    } */}

                                    {item?.title.length > 15
                                        ? (() => {
                                            const truncatedTitle = item?.title.substr(0, 30);
                                            const lastSpaceIndex = truncatedTitle.lastIndexOf(' ');
                                            if (lastSpaceIndex !== -1) {
                                            return `${truncatedTitle.substr(0, lastSpaceIndex)}...`;
                                            } else {
                                            return `${truncatedTitle}...`;
                                            }
                                        })()
                                        : item?.title
                                    }
                                </h5>
                                <p className="description">{item?.description.substr(0,150)}...</p>
                                <Link to={`/blog/${item._id}`} className='button'>Read More</Link>
                            </div>
                        </div>    
                    )
                })
            }
                    
    </>
    )
}

export default BlogCart;

