import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../features/blog/blogSlice";
import { getProducts } from "../features/products/productSlice";
import Container from "../containers/common/Container";
import Meta from "../containers/common/Meta";
import BlogCart from "../containers/BlogCart";
import CardProduct from "../containers/CardProduct";
import SpecialProduct from "../containers/SpecialProduct";
import FamousProduct from "../containers/FamousProduct";
import MarqueeSlider from "../containers/Marquee";
import Offer from "../containers/Offer";
import Items from "../containers/Items";
import BannerProduct from "../containers/BannerProduct";

const Home = () => {
	const dispatch = useDispatch();
	const indexBlogData = useSelector((state) => state?.blog?.blogs);
	const indexProductData = useSelector((state) => state?.product?.products);

	useEffect(() => {
		const indexPosts = async () => {
			try {
				await dispatch(getProducts());
				await dispatch(getAllBlog());
			} catch (error) {
				console.error("error", error);
				throw new Error("Something went wrong while fetching blog data");
			}
		};

		indexPosts();
	}, []);

	const latest4Blogs = [...(indexBlogData || [])]
		.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			return dateB - dateA;
		})
		.slice(0, 4);

	const popularProducts = indexProductData
		? indexProductData.filter((item) => item?.tags === "popular").slice(0, 8)
		: [];

	const featuredProducts = indexProductData
		? indexProductData.filter((item) => item?.tags === "featured").slice(0, 8)
		: [];

	return (
		<>
			<Meta title={"Home"} />
			<BannerProduct />

			<Offer />

			{/* <Items /> */}

			<Container class1='featured-wrapper py-5 home-wrapper-2 '>
				<div className='row'>
					<div className='col-12'>
						<h3 className='section-heading'>Featured Product Collections</h3>
					</div>

					<div className='col-12 d-flex justify-content-between flex-wrap'>
						<CardProduct prodData={featuredProducts ? featuredProducts : []} />
					</div>
				</div>
			</Container>

			<FamousProduct />

			<Container class1='special-wrapper py-5 home-wrapper-2'>
				<div className='row'>
					<div className='col-12'>
						<div className='section-heading'>Special Products</div>
					</div>
				</div>

				<div className=''>
					<SpecialProduct
						specialData={indexProductData ? indexProductData : []}
					/>
				</div>
			</Container>

			<Container class1='popular-wrapper py-3 home-wrapper-2 '>
				<div className='row'>
					<div className='col-12'>
						<h3 className='section-heading'>Our Popular Products</h3>
					</div>

					<div className='col-12 popular-product'>
						<CardProduct prodData={popularProducts ? popularProducts : []} />
					</div>
				</div>
			</Container>

			<MarqueeSlider />

			<Container class1='blog-wrapper py-5 home-wrapper-2'>
				<div className='row'>
					<div className=''>
						<h3 className='section-heading'>Our Latest Blogs</h3>
					</div>

					<div className='d-flex gap-20 blogCart'>
						<BlogCart
							className='blogCart'
							blogData={latest4Blogs ? latest4Blogs : []}
						/>
					</div>
				</div>
			</Container>
		</>
	);
};

export default Home;
