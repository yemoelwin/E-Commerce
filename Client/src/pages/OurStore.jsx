import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import CardProduct from "../containers/CardProduct";
import Container from "../containers/common/Container";
import BreadCrumb from "../containers/common/BreadCrumb";
import Meta from "../containers/common/Meta";
import { useDispatch, useSelector } from "react-redux";
import {
	clearSearchState,
	getProducts,
} from "../features/products/productSlice";
import NoData from "../containers/common/NoData";
import ShowMoreList from "../containers/ShowMoreList";
import { getBrands } from "../features/brand/brandSlice";
import { getAllCategory } from "../features/category/categorySlice";
import Paginate from "../containers/common/Paginate";

const OurStore = () => {
	const dispatch = useDispatch();

	const [grid, setGrid] = useState(3);

	const [isLoading, setIsLoading] = useState(true);

	const [option, setOption] = useState("Categories");

	const [brands, setBrands] = useState("");

	const [categories, setCategories] = useState("");

	const [tags, setTags] = useState("");

	/* Filter */

	const [brand, setBrand] = useState("");

	const [category, setCategory] = useState("");

	const [tag, setTag] = useState("");

	const [minPrice, setMinPrice] = useState("");

	const [maxPrice, setMaxPrice] = useState("");

	const [sort, setSort] = useState("");

	const searchProductState = useSelector(
		(state) => state?.product?.searchProducts,
	);

	const [searchProducts, setSearchProducts] = useState(searchProductState);

	const [filteredProducts, setFilteredProducts] = useState([]);

	/* Filter */

	/* Global */

	const productState = useSelector((state) => state?.product?.products);

	const brandState = useSelector((state) => state?.brand?.brands);

	const categoryState = useSelector((state) => state?.category?.categories);

	/* Global */

	/* Pagination */

	const [productPagination, setProductPagination] = useState([]);

	/* Pagination */

	useEffect(() => {
		const getAllProducts = async () => {
			try {
				setIsLoading(true);
				await Promise.all([
					dispatch(
						getProducts({
							sort,
							tag,
							brand,
							category,
							minPrice,
							maxPrice,
						}),
					),
					dispatch(getBrands()),
					dispatch(getAllCategory()),
				]);
			} catch (error) {
				console.error("error", error);
				throw new Error("An error occurred while fetching all products.");
			} finally {
				setIsLoading(false);
			}
		};
		getAllProducts();
	}, [dispatch, sort, tag, brand, category, minPrice, maxPrice]);

	useEffect(() => {
		if (searchProducts?.length > 0) {
			setFilteredProducts(searchProducts);
		} else {
			setFilteredProducts(productState);
		}
	}, [searchProducts, productState]);

	/* for brand and category search */

	useEffect(() => {
		let newTag = [];

		for (let index = 0; index < productState?.length; index++) {
			const element = productState[index];
			newTag.push(element.tags);
		}

		setTags(newTag);
	}, [productState]);

	const extractValues = (array, key) => {
		return array.map((element) => element[key]);
	};

	useEffect(() => {
		setBrands(extractValues(brandState, "title"));
	}, [brandState]);

	useEffect(() => {
		setCategories(extractValues(categoryState, "title"));
	}, [categoryState]);

	/* for brand and category search */

	useEffect(() => {
		setSearchProducts(searchProductState);
	}, [searchProductState]);

	const fetchAllProducts = async () => {
		await Promise.all([dispatch(getProducts()), dispatch(clearSearchState())]);
		setBrand("");
		setCategory("");
		setTag("");
		setMinPrice("");
		setMaxPrice("");
		setSort("");
	};

	return (
		<>
			<Meta title={"Our Store"} />
			<BreadCrumb title='Our Store' />
			<Container class1='store-wrapper home-wrapper-2 py-5'>
				<div className='row'>
					<div className='col-3'>
						<div className='filter-card mb-3'>
							<div>
								<h3 className='filter-title'>
									Shop By
									<select
										name='shopby'
										id=''
										className='shopby'
										value={option}
										onChange={(e) => setOption(e.target.value)}
									>
										<option>Categories</option>
										<option>Brand</option>
									</select>
								</h3>
							</div>
							<ShowMoreList
								brands={[...new Set(brands)]}
								categories={[...new Set(categories)]}
								option={option}
								setCategory={setCategory}
								setBrand={setBrand}
								setTag={setTag}
								setMinPrice={setMinPrice}
								setMaxPrice={setMaxPrice}
							/>
						</div>

						{/* Price */}
						<div className='filter-card mb-3'>
							<div>
								<h5 className='sub-title'>Price</h5>
								<div className='d-flex align-items-center gap-10'>
									<div className='form-floating'>
										<input
											type='email'
											className='form-control py-3 mt-2'
											id='floatingInput'
											placeholder='From'
											value={minPrice}
											onChange={(e) => setMinPrice(e.target.value)}
										/>
										<label htmlFor='floatingInput'>From</label>
									</div>
									<div className='form-floating'>
										<input
											type='email'
											className='form-control py-1 mt-2'
											id='floatingInput1'
											placeholder='To'
											value={maxPrice}
											onChange={(e) => setMaxPrice(e.target.value)}
										/>
										<label htmlFor='floatingInput1'>To</label>
									</div>
								</div>
							</div>
						</div>

						{/* Product Tags */}
						<div className='filter-card mb-3'>
							<h3 className='filter-title'>Product Tags</h3>
							<div className='product-tags d-flex flex-wrap align-items-center gap-10'>
								{tags &&
									[...new Set(tags)].map((item, index) => {
										return (
											<div key={index} className='sub-division'>
												<span
													className='badge bg-light rounded-3 py-2 px-3 text-dark border'
													onClick={() => setTag(item)}
												>
													{item}
												</span>
											</div>
										);
									})}
							</div>
						</div>

						{/* Random Product */}
						<div className='filter-card mb-3'>
							<h3 className='filter-title'>Random Product</h3>

							<div>
								<div className='random-products mb-4 d-flex '>
									<div className='w-50'>
										<img
											src='images/watch.jpg'
											className='img-fluid'
											alt='watch'
										/>
									</div>
									<div className='w-50 mb-3'>
										<h5>
											Kids headphone bulk 10packs multi colored for students
										</h5>
										<ReactStars
											count={5}
											size={24}
											// value={4}
											// edit={false}
											activeColor='#ffd700'
										/>
										<b> $ 300</b>
									</div>
								</div>

								<div className='random-products d-flex'>
									<div className='w-50'>
										<img
											src='images/watch.jpg'
											className='img-fluid'
											alt='watch'
										/>
									</div>
									<div className='w-50'>
										<h5>
											Kids headphone bulk 10packs multi colored for students
										</h5>

										<ReactStars
											count={5}
											size={24}
											// value={4}
											// edit={false}
											activeColor='#ffd700'
										/>

										<b> $ 300</b>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Featured */}
					<div className='col-9'>
						<div className='filter-sort-grid mb-4'>
							<div className='d-flex justify-content-between align-items-center'>
								{/* Sort By */}
								<div className='d-flex align-items-center gap-10'>
									<p className='mb-0' style={{ width: "100px" }}>
										Sort By:
									</p>
									<select
										name=''
										className='form-control form-select'
										id=''
										onChange={(e) => setSort(e.target.value)}
									>
										<option value='title'>Alphabetically, A-Z</option>
										<option value='-title'>Alphabetically, Z-A</option>
										<option value='price'>Price, low to high</option>
										<option value='-price'>Price, high to low</option>
										<option value='createdAt'>Date, old to new</option>
										<option value='-createdAt'>Date, new to old</option>
									</select>
								</div>

								{/* Display Grid */}
								<div className='d-flex align-items-center gap-10'>
									<button
										className='totalproducts mb-0'
										onClick={() => fetchAllProducts()}
									>{`View All Products`}</button>
									<div className='d-flex gap-10 align-items-center grid'>
										<img
											onClick={() => {
												setGrid(3);
											}}
											src='images/gr4.svg'
											className='d-block img-fluid'
											alt='grid'
										/>

										<img
											onClick={() => {
												setGrid(4);
											}}
											src='images/gr3.svg'
											className='d-block img-fluid'
											alt='grid'
										/>

										<img
											onClick={() => {
												setGrid(6);
											}}
											src='images/gr2.svg'
											className='d-block img-fluid'
											alt='grid'
										/>

										<img
											onClick={() => {
												setGrid(12);
											}}
											src='images/gr.svg'
											className='d-block img-fluid'
											alt='grid'
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='products-list pb-5'>
							<div className='d-flex flex-wrap gap-10'>
								{isLoading ? (
									<div className='loadingX gap-3'>
										<div className='loading-spinner'></div>
										<div className='load'>Loading ... </div>
									</div>
								) : productPagination.length > 0 ? (
									<CardProduct
										grid={grid}
										prodData={productPagination ? productPagination : []}
									/>
								) : (
									<NoData />
								)}
							</div>

							<div>
								<Paginate
									items={filteredProducts}
									perPage={8}
									setPaginateDisplay={setProductPagination}
								/>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
};

export default OurStore;
