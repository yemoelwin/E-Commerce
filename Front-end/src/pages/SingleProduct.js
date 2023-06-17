import React, { useState } from "react";
import Meta from '../components/Product/Meta'
import BreadCrumb from '../components/Product/BreadCrumb'
import CardProduct from '../components/Home/CardProduct';
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import ReactImageZoom from 'react-image-zoom';
// import Container from '../components/NavbarLink/Container'
import Colors from "../components/NavbarLink/Colors";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import watch from '../images/watch.jpg'
import Container from "../components/Container/Container";

const SingleProduct = () => {
    const props = {
        width: 600,
        height: 720,
        zoomWidth: 600,
        img: "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg"
    };
    // setorderedProduct
    const [orderedProduct ] = useState(true)
    const copyToClipboard = (text) => {
    console.log("text", text);
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    };
    
//   const closeModal = () => {};

    return (
        <>
            <Meta title={"Product Name"} />
            <BreadCrumb title="Product Name" />
            
            <Container class1="main-product-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-6">

                            <div className="main-product-image">
                                <div>
                                    <ReactImageZoom {...props} />
                                </div>
                            </div>

                            <div className="other-product-images d-flex flex-wrap gap-15">
                                <div><img src={watch} className='img-fluid' alt="" /></div>
                                <div><img src={watch} className='img-fluid' alt="" /></div>
                                <div><img src={watch} className='img-fluid' alt="" /></div>
                                <div><img src={watch} className='img-fluid' alt="" /></div>
                                {/* <div><img src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg" className='img-fluid' alt="" /></div>
                                <div><img src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg" className='img-fluid' alt="" /></div>
                                <div><img src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg" className='img-fluid' alt="" /></div> */}
                            </div>

                        </div>

                        <div className="col-6">

                            <div className="main-product-details">
                                <div className="border-bottom">
                                    <h3 className="title">
                                    Kids Headphones Bulk 10 Pack Multi Colored For Students
                                    </h3>
                                </div>
                            
                                <div className="border-bottom py-3">
                                    <p className="price">$ 100</p>
                                    <div className="d-flex align-items-center gap-10">
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={4}
                                            edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <p className="mb-0 t-review">( 2 Reviews )</p>
                                    </div>
                                    <a className="review-btn" href="#review">
                                    Write a Review
                                    </a>
                                </div>

                                <div className=" py-3">
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Type :</h3>
                                        <p className="product-data">Watch</p>
                                    </div>

                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Brand :</h3>
                                        <p className="product-data">Havells</p>
                                    </div>

                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Category :</h3>
                                        <p className="product-data">Watch</p>
                                    </div>

                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Tags :</h3>
                                        <p className="product-data">Watch</p>
                                    </div>

                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Availablity :</h3>
                                        <p className="product-data">In Stock</p>
                                    </div>

                                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                        <h3 className="product-heading">Size :</h3>
                                        <div className="d-flex flex-wrap gap-15">
                                            <span className="badge border border-1 bg-white text-dark border-secondary">
                                            S
                                            </span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">
                                            M
                                            </span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">
                                            XL
                                            </span>
                                            <span className="badge border border-1 bg-white text-dark border-secondary">
                                            XXL
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-10 flex-column mt-2 mb-3">
                                        <h3 className="product-heading">Color :</h3>
                                        <Colors />
                                    </div>

                                    <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                                        <h3 className="product-heading">Quantity :</h3>
                                        <div className="">
                                            <input
                                            type="number"
                                            name=""
                                            min={1}
                                            max={10}
                                            className="form-control"
                                            style={{ width: "70px" }}
                                            id=""
                                            />
                                        </div>
                                        <div className="d-flex align-items-center gap-30 ms-5">
                                            <button
                                            className="button border-0"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            type="button"
                                            >
                                            Add to Cart
                                            </button>
                                            <button className="button signup">Buy It Now</button>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center gap-15 mt-4">
                                        <div className="compareandwishlist">
                                            <Link to="">
                                            <TbGitCompare className="fs-5 me-2" /> Add to Compare
                                            </Link>
                                        </div>
                                        <div className="compareandwishlist">
                                            <Link to="">
                                            <AiOutlineHeart className="fs-5 me-2" /> Add to Wishlist
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-10 flex-column my-3 mt-4">
                                        <h3 className="product-heading"><b>Shipping & Returns :</b></h3>
                                        <p className="product-data fs-7">
                                            Free shipping and returns available on all orders! <br /> We
                                            ship all US domestic orders within
                                            <b>5-10 business days!</b>
                                        </p>
                                    </div>

                                    <div className="d-flex gap-10 align-items-center my-3">
                                        <h3 className="product-heading"><b>Product Link:</b></h3>
                                        <Link
                                            to=""
                                            onClick={() => {
                                            copyToClipboard(
                                                "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?cs=srgb&dl=pexels-fernando-arcos-190819.jpg&fm=jpg"
                                            );
                                            }}
                                        >
                                            Copy Product Link
                                        </Link>
                                        
                                    </div>
                                </div>

                            </div>
                            
                        </div>
                    </div>
            </Container>

            <Container class1="description-wrapper home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <h4>Description</h4>
                            <div className='bg-white p-3 description-inner-wrapper'>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium ipsum dolore temporibus sed, est voluptate ea laborum saepe, veniam adipisci ab commodi quas, accusantium pariatur aspernatur quae atque reprehenderit facilis? Culpa a natus corrupti! Assumenda doloribus ea facilis esse asperiores totam animi nam omnis culpa expedita.
                                </p>
                            </div>
                        </div>
                    </div>
            </Container>

            <Container class1="reviews-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <h3 id="review">Reviews</h3>
                            <div className="review-inner-wrapper">

                                <div className="review-head d-flex justify-content-between align-items-end">
                                    <div>
                                    <h4 className="mb-2">Customer Reviews</h4>
                                    <div className="d-flex align-items-center gap-10">
                                        <ReactStars
                                        count={5}
                                        size={24}
                                        value={4}
                                        edit={false}
                                        activeColor="#ffd700"
                                        />
                                        <p className="mb-0">Based on 2 Reviews</p>
                                    </div>
                                    </div>
                                    {orderedProduct && (
                                    <div>
                                        <Link className="text-dark text-decoration-underline" href="">
                                        Write a Review
                                        </Link>
                                    </div>
                                    )}
                                </div>

                                <div id="review" className="review-form py-4">
                                    <h4>Write a Review</h4>
                                    <form action="" className="d-flex flex-column gap-15">
                                    <div>
                                        <ReactStars
                                        count={5}
                                        size={24}
                                        value={4}
                                        edit={true}
                                        activeColor="#ffd700"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                        name=""
                                        id=""
                                        className="w-100 form-control"
                                        cols="30"
                                        rows="4"
                                        placeholder="Comments"
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button className="button border-0">Submit Review</button>
                                    </div>
                                    </form>
                                </div>

                                <div className="reviews mt-4">
                                    <div className="review">
                                    <div className="d-flex gap-10 align-items-center">
                                        <h6 className="mb-0">Navdeep</h6>
                                        <ReactStars
                                        count={5}
                                        size={24}
                                        value={4}
                                        edit={false}
                                        activeColor="#ffd700"
                                        />
                                    </div>
                                    <p className="mt-3">
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                        Consectetur fugit ut excepturi quos. Id reprehenderit
                                        voluptatem placeat consequatur suscipit ex. Accusamus dolore
                                        quisquam deserunt voluptate, sit magni perspiciatis quas
                                        iste?
                                    </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
            </Container>

            <Container class1='popular-wrapper py-4 home-wrapper-2'>
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading'>Our Popular Product</h3>
                        </div>
                    </div>

                    <div className="row">
                        <CardProduct />
                        <CardProduct />
                        <CardProduct />
                        <CardProduct />
                    </div>
            </Container>
        </>
    )
}

export default SingleProduct