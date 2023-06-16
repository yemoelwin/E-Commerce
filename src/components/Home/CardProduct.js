import React from 'react'
import ReactStars from "react-rating-stars-component";
import { Link, useLocation } from 'react-router-dom';
import prodcompare from "../../images/prodcompare.svg";
import wish from '../../images/wish.svg'
// import wishlist from "../images/wishlist.svg";
import watch from "../../images/watch.jpg";
import watch2 from "../../images/watch-1.avif";
import addcart from "../../images/add-cart.svg";
import view from "../../images/view.svg";

const CardProduct = (props) => {
    const { grid } = props;
    let location = useLocation()
    // alert (location)
    return (
        <>
            <div className={`${location.pathname === '/product' ? `gr-${grid}` : "col-3"}`}>
        
                <Link
                    to={`${
                    location.pathname === "/"
                    ? "/product/:id"
                    : location.pathname === "/product/:id"
                    ? "/product/:id"
                    : ":id"
                }`} className="product-card position-relative">

                <div className="wishlist-icon position-absolute">
                    <button className='border-0 bg-transparent'>
                        <img src={wish} alt="wishlist" />
                    </button>
                </div>

                <div className="product-image">
                    <img src={watch} className='img-fluid' alt='product' />
                    <img src={watch2} className='img-fluid' alt='product' />
                </div>

                <div className="product-details">
                    <h6 className="brand">Harvels</h6>
                    <h5 className="product-title">work smart with smart watch</h5>
                    <ReactStars
                        count={5}
                        size={24}
                        // value={4}
                        // edit={false}
                        activeColor="#ffd700"
                    />
                    <p className={`description ${grid === 12 ? "d-block" : "d-none"}`}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, vero? Soluta molestiae reprehenderit quod? Dolorum facere commodi reiciendis, molestias quos libero odit voluptas obcaecati est quam.
                    </p>
                    <p className="price">$100</p>
                </div>

                <div className="action-bar position-absolute">
                    <div className="d-flex flex-column">
                        <button className='mb-1 border-0 bg-transparent'>
                            <img src={prodcompare} alt="addcart" />
                        </button>
                        <button className='mb-1 border-0 bg-transparent'>
                            <img src={view} alt="addcart" />
                        </button>
                        <button className='mb-1 border-0 bg-transparent'>
                            <img src={addcart} alt="addcart" />
                        </button>
                    </div>
                </div>
            </Link>
            
            </div>
        </>
    )
}

export default CardProduct