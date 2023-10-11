import React, { useEffect, useState } from "react";
import Meta from '../components/common/Meta'
import BreadCrumb from '../components/common/BreadCrumb'
import CardProduct from '../containers/CardProduct';
import ReactStars from "react-rating-stars-component";
import { Link, useNavigate, useParams } from "react-router-dom";
// import ReactImageZoom from 'react-image-zoom';
import Colors from "../containers/Colors";
import { TbGitCompare } from "react-icons/tb";
import { AiOutlineHeart } from "react-icons/ai";
import Container from "../components/common/Container";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductData } from "../features/products/productSlice";
import { showToast } from "../components/common/ShowToast";
import copy from 'copy-to-clipboard';
import { addToCart } from "../features/cart/cartSlice";

const SingleProduct = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [color, setColor] = useState(null);
    // const [quantity, setQuantity] = useState(1);
    const [alreadyAdded, setAlreadyAdded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const product = useSelector((state) => state?.product?.singleData);
    const cartState = useSelector((state) => state?.cart?.items);

    console.log(product)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setIsLoading(true);
                await dispatch(fetchProductData(id));
            } catch (error) {
                setIsLoading(false);
                console.error('error', error);
                showToast('Something went wrong!');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [id, dispatch]);

    useEffect(() => {
        const fetchProduct = async () => {
            for (let index = 0; index < cartState.length; index++) {
                if (id === cartState[index]?.productId) {
                    setAlreadyAdded(true);
                }
            }
        };
        fetchProduct();
    }, []);

    const props = {
        width: 600,
        height: 720,
        zoomWidth: 600,
        img: product?.images[0].url ? product?.images[0].url : '',
    };

    // setorderedProduct
    const [orderedProduct] = useState(true);
    // const copyToClipboard = (text) => {
    // console.log("text", text);
    // var textField = document.createElement("textarea");
    // textField.innerText = text;
    // document.body.appendChild(textField);
    // textField.select();
    // document.execCommand("copy");
    // textField.remove();
    // };
    
    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };
    
    const handleConfirm = async() => {
        if (!color || color === '') {
            showToast('Please choose the color', 'error')
        } else {
            await dispatch(addToCart({productId: product._id, title: product.title, image: product.images[0].url, color, price: product.price}))
        }
    }
    const handleAddToCart = () => { };
    const closeModal = () => { };

    return (
        <>
            <Meta title={"Product Name"} />
            <BreadCrumb title="Product Name" />
            
            <Container class1="main-product-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-6">
    
                        {/* Main Image */}
                            <div className="main-product-image">
                                {/* <div>
                                    <ReactImageZoom {...props} />
                                </div> */}
                            </div>

                        {/* Sub Images */}
                            <div className="other-product-images d-flex flex-wrap gap-15">
                                <div><img src={product?.images[0].url} className='img-fluid' alt="" /></div>
                                <div><img src={product?.images[0].url} className='img-fluid' alt="" /></div>
                                <div><img src={product?.images[0].url} className='img-fluid' alt="" /></div>
                                <div><img src={product?.images[0].url} className='img-fluid' alt="" /></div>
                                
                            </div>

                        </div>

                        <div className="col-6">

                            <div className="main-product-details">
                            {/* Title */}
                                <div className="border-bottom">
                                    <h3 className="title">
                                    {product?.title}
                                    </h3>
                                </div>
                            
                            {/* Price & Write Review & TotalRating */}
                                <div className="border-bottom py-3">
                                    <p className="price">$ {product?.price}</p>
                                    <div className="d-flex align-items-center gap-10">
                                        <ReactStars
                                            count={5}
                                            size={24}
                                            value={parseFloat(product?.totalrating) || 0}
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
                                {/* Type */}
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Type :</h3>
                                    <p className="product-data">{product?.category}</p>
                                    </div>

                                {/* Brand */}
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Brand :</h3>
                                    <p className="product-data">{product?.brand}</p>
                                    </div>

                                {/* Category */}
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Category :</h3>
                                        <p className="product-data">{product?.category}</p>
                                    </div>

                                {/* Tags */}
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Tags :</h3>
                                        <p className="product-data">{product?.tags}</p>
                                    </div>

                                {/* Availablity */}
                                    <div className="d-flex gap-10 align-items-center my-2">
                                        <h3 className="product-heading">Availablity :</h3>
                                        <p className="product-data">In Stock</p>
                                    </div>

                                {/* Size */}
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

                                {/* Color */}
                                <div className="mt-2 mb-3">
                                    {alreadyAdded === false && 
                                        <>
                                            <div className="d-flex gap-10">
                                                <h3 className="product-heading">Available Color : </h3>
                                                <Colors setColor={setColor} colorData={product} />
                                            </div>
                                            <div>
                                                <h3 className="product-heading">
                                                Selected Color: {color ? color : ""}</h3>
                                            </div>
                                        </>
                                    }
                                </div>

                                <div >
                                    {/* Quantity */}
                                    {/* <div className="d-flex align-items-center gap-10 flex-row mt-3 mb-3">
                                        {alreadyAdded === false && 
                                            <>
                                                <h3 className="product-heading">Quantity :</h3>
                                                <div className="mt-1">
                                                    <input
                                                    type="number"
                                                    name="quantity"
                                                    min={1}
                                                    max={10}
                                                    className="form-control"
                                                    style={{ width: "70px" }}
                                                    id="quantity"
                                                    // value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        }
                                    </div> */}
                                    
                                    <div className={alreadyAdded ? 'ms-0' : "mt-3"}>
                                        {
                                            alreadyAdded ?
                                                <p className="font-sizeX">This item already added.</p>
                                                :
                                                <button
                                                    className="buttonX"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#staticBackdrop"
                                                    type="button"
                                                    onClick={() => handleAddToCart()}
                                                >
                                                    Add to Cart
                                                </button>
                                        }
                                    </div>
                                    
                                    <div
                                        className="modal fade"
                                        id="staticBackdrop"
                                        data-bs-backdrop="static"
                                        data-bs-keyboard="false"
                                        tabIndex="-1"
                                        aria-labelledby="staticBackdropLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                    
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="staticBackdropLabel">
                                                        Are you sure to add this item?
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        data-bs-dismiss="modal"
                                                        aria-label="Close"
                                                    >
                                                                    
                                                    </button>
                                                </div>
                                                        
                                                <div className="modal-body">
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1 w-50 modal-img">
                                                            <img
                                                                src={product?.images[0]?.url}
                                                                className="img-fluid"
                                                                alt="product images"
                                                            />
                                                        </div>
                                                            
                                                        <div className="d-flex flex-column flex-grow-1 w-50 align-items-center p-3">
                                                            <div>
                                                                <h6 className="mb-3">{product?.title}</h6>
                                                                {/* <p className="mb-1 modal-font-size">quantity: {quantity}</p> */}
                                                                <p className="mb-1 modal-font-size">price: ${product?.price}</p>
                                                                <p className="mb-1 modal-font-size">color: {color}</p>
                                                                <p className="mb-1 modal-font-size">Size: abcd</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                        
                                                <div className="modal-footer border-0 gap-10">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        data-bs-dismiss="modal"
                                                        onClick={() => {
                                                            navigate(`/cart`)
                                                        }}
                                                    >View Cart</button>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        data-bs-dismiss="modal"
                                                        onClick={() => { handleConfirm()}}
                                                    >Confirm</button>  
                                                </div>    
                                                            
                                                {/* <div className="cart_Modal">
                                                    <Link
                                                        to={`/product`}
                                                        data-bs-dismiss="modal"
                                                        onClick={() => {
                                                            closeModal();
                                                        }}
                                                    > Continue to Shopping </Link>
                                                </div>     */}
                                                    
                                            </div>

                                        </div>
                                    </div>
                                    
                                </div>

                                {/* Add to Compare & Add to Wishlist*/}
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

                                {/* Shipping & Returns */}
                                    <div className="d-flex gap-10 flex-column my-3 mt-4">
                                        <h3 className="product-heading"><b>Shipping & Returns :</b></h3>
                                        <p className="product-data fs-7">
                                            Free shipping and returns available on all orders! <br /> We
                                            ship all US domestic orders within
                                            <b>5-10 business days!</b>
                                        </p>
                                    </div>

                                {/* Copy ClipBoard */}
                                    <div className="d-flex gap-10 align-items-center my-3">
                                        <h3 className="product-heading"><b>Product Link:</b></h3>
                                        <Link
                                            to=""
                                            onClick={() => {
                                                copy(window.location.href);
                                                showToast('Product link copied to clipboard', 'success');
                                            // copyToClipboard(
                                            // );
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

            {/* Description */}
            <Container class1="description-wrapper home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            <h4>Description</h4>
                            <div className='bg-white p-3 description-inner-wrapper'>
                                <p>
                                    {product?.description}
                                </p>
                            </div>
                        </div>
                    </div>
            </Container>

            {/* Customer Reviews */}
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

            {/* Popular Product */}
            <Container class1='popular-wrapper py-4 home-wrapper-2'>
                    <div className="row">
                        <div className="col-12">
                            <h3 className='section-heading'>Our Popular Product</h3>
                        </div>
                    </div>

                    <div className="row">
                        {isLoading ? ( // Show loading indicator when isLoading is true
                            <div className='loadingX gap-3'>
                                <div className='loading-spinner'></div>
                                <div className='load'>Loading ... </div>
                            </div> 
                        ) : (
                            <>
                            <CardProduct />
                            <CardProduct />
                            <CardProduct />
                            <CardProduct />  
                            </>
                        )}                  
                        
                    </div>
            </Container>

            
                
            
        </>
    )
}

export default SingleProduct