import React, { useEffect, useState } from 'react'
import ReactStars from 'react-rating-stars-component'
import CardProduct from '../containers/CardProduct';
import Colors from '../containers/Colors';
import Container from '../containers/common/Container';
import BreadCrumb from '../containers/common/BreadCrumb';
import Meta from '../containers/common/Meta';
import { useDispatch, useSelector } from 'react-redux';
import { clearSearchState, getProducts } from '../features/products/productSlice';
import ShowMoreList from '../containers/ShowMoreList';
import { getAllCategory } from '../features/category/categorySlice';
import NoData from '../containers/common/NoData';
import { getBrands } from '../features/brand/brandSlice';

const ProductPage = () => {
    const dispatch = useDispatch();
    const [grid, setGrid] = useState(4);    
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedOption, setSelectedOption] = useState('Categories');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productState = useSelector((state) => state.product.products);
    const searchProductState = useSelector((state) => state.product.searchProducts);
    const categoryList = useSelector(state => state.category.categories);
    const brandList = useSelector(state => state.brand.brands);

    useEffect(() => {
        const getAllProducts = async () => {
            try {
                setIsLoading(true);
                await dispatch(getProducts());
                await dispatch(getAllCategory());
                await dispatch(getBrands());
            } catch (error) {
                console.error("error", error);
                setIsLoading(false);
                throw new Error('An error occurred while fetching all products.'); // Fallback error message
            } finally {
                setIsLoading(false);
            }
        }
        getAllProducts();
    },[])

    // alert (grid)
    const filterProducts = () => {
        let filtered = productState;
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }

        if (selectedBrand) {
            filtered = filtered.filter(product => product.brand === selectedBrand);
        }
        setFilteredProducts(filtered);
    }    

    // console.log('filteredProducts', filteredProducts)
    // console.log("selectedBrand", selectedBrand)
    // console.log("selectedCategory", selectedCategory)
    // console.log("searchProductState", searchProductState)

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleOption = async (e) => {
        setSelectedOption(e.target.value);
        if (e.target.value === 'Brand') {
            setSelectedCategory(null);
        } else {
            setSelectedBrand(null);
        }
    }

    const handleAllProduct = () => {
        setFilteredProducts(productState);
        clearSelectedFilters()
    }

    const clearSelectedFilters = () => {
        setSelectedCategory(null);
        setSelectedBrand(null);
    }

    const displayProducts = searchProductState ? searchProductState : filteredProducts;

    // useEffect(() => {
    //     if (searchProductState && searchProductState.length > 0) {
    //         // Create a set of unique product IDs from the search results
    //         const searchProductIds = new Set(searchProductState.map(product => product._id));

    //         // Filter the productState to include only products whose IDs are in searchProductIds
    //         const filtered = productState.filter(product => searchProductIds.has(product._id));
    //         setFilteredProducts(filtered);
    //     } else {
    //         setFilteredProducts(productState); 
    //     }
    // }, [searchProductState, productState]);

    useEffect(() => {
        filterProducts();
    }, [selectedCategory, selectedBrand, productState]);

    return (
        <>
            <Meta title={"Our Store"} />
            <BreadCrumb title='Our Store' />
            <Container class1='store-wrapper home-wrapper-2 py-5'>
            
                <div className="row">

                    <div className="col-3">
                        <div className='filter-card mb-3'>
                            <div>
                                <h3 className='filter-title'>
                                    Shop By 
                                    <select
                                        name="shopby" id=""
                                        className='shopby'
                                        value={selectedOption}
                                        onChange={handleOption}
                                    >
                                        <option>Categories</option>
                                        <option>Brand</option>
                                    </select>
                                </h3>
                            </div>
                            <ShowMoreList
                                selectedOption={selectedOption}
                                categories={categoryList}
                                brands={brandList}
                                onCategoryClick={(category) => setSelectedCategory(category)}
                                onBrandClick={(brand) => setSelectedBrand(brand)}
                            />
                        </div>

                        <div className='filter-card mb-3'>

                            <h3 className='filter-title'>Filter By</h3>

                            <div>
                                <h5 className='sub-title'>Availabilty</h5>
                                <div>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="availability-checkbox"
                                            value=''
                                        />
                                        <label htmlFor="availability-checkbox" className="form-check-label">Instock (2)</label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="unavailability-checkbox"
                                            value=''
                                            checked={isChecked}
                                            onChange={handleCheckboxChange} />
                                        <label htmlFor="unavailability-checkbox" className="form-check-label">Out of Stock (0)</label>
                                    </div>
                                </div>

                                {/* Price */}
                                <h5 className='sub-title'>Price</h5>
                                <div className='d-flex align-items-center gap-10'>
                                    <div className="form-floating">
                                    <input type="email" className="form-control py-1" id="floatingInput" placeholder="From" />
                                    <label htmlFor="floatingInput">From</label>
                                    </div>
                                    <div className="form-floating">
                                    <input type="email" className="form-control py-1" id="floatingInput1" placeholder="To" />
                                    <label htmlFor="floatingInput1">To</label>
                                    </div>
                                </div>
                                
                                {/* Colors */}
                                <h5 className="sub-title">Colors</h5>
                                <div>
                                    <Colors />
                                </div>

                                {/* Size */}
                                <h5 className='sub-title'>Size</h5>
                                <div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" value='' id='color-1'/>
                                        <label htmlFor="color-1" className="form-check-label">S (2)</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" value='' id='color-2'/>
                                        <label htmlFor="color-2" className="form-check-label">M (2)</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" value='' id='color-3'/>
                                        <label htmlFor="color-3" className="form-check-label">L (2)</label>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Product Tags */}
                        <div className='filter-card mb-3'>
                            <h3 className='filter-title'>
                                Product Tags
                            </h3>
                            <div>
                                <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        HeadPhone
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Laptop
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Pants
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Pet Supplies
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        3D Sticker
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Funiture
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Chairs
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Clothes
                                    </span>
                                    <span className="badge bg-light rounded-3 py-2 px-3 text-dark border">
                                        Instrument
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Random Product */}
                        <div className='filter-card mb-3'>
                            <h3 className='filter-title'>
                                Random Product
                            </h3>

                            <div>
                                <div className="random-products mb-4 d-flex ">
                                    <div className="w-50">
                                        <img src="images/watch.jpg" className='img-fluid' alt="watch" />
                                    </div>
                                    <div className="w-50 mb-3">
                                        <h5>Kids headphone bulk 10packs multi colored for students</h5>
                                            <ReactStars
                                            count={5}
                                            size={24}
                                            // value={4}
                                            // edit={false}
                                            activeColor="#ffd700"
                                        />
                                        <b> $ 300</b>
                                    </div>
                                </div>

                                <div className="random-products d-flex">
                                    <div className="w-50">
                                        <img src="images/watch.jpg" className='img-fluid' alt="watch" />
                                    </div>
                                    <div className="w-50">
                                        <h5>Kids headphone bulk 10packs multi colored for students</h5>
                                        
                                            <ReactStars
                                            count={5}
                                            size={24}
                                            // value={4}
                                            // edit={false}
                                            activeColor="#ffd700"
                                        />
                                        
                                        <b> $ 300</b>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Featured */}
                    <div className="col-9">
                        <div className="filter-sort-grid mb-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-10">
                                <p className='mb-0' style={{'width':"100px"}}>Sort By:</p>
                                <select name="" className='form-control form-select' id="">
                                        <option value="manual">Featured</option>
                                        <option value="best-selling" select='selected'>
                                            Best selling
                                        </option>
                                        <option value="title-ascending">
                                            Alphabetically, A-Z
                                        </option>
                                        <option value="title-descending">
                                            Alphabetically, Z-A
                                        </option>
                                        <option value="price-ascending">
                                            Price, low to high
                                        </option>
                                        <option value="price-descending">
                                            Price, high to low
                                        </option>
                                        <option value="created-ascending">
                                            Date, old to new
                                        </option>
                                        <option value="created-descending">
                                            Date, new to old
                                        </option>
                                </select>   
                                </div>
                            
                                <div className='d-flex align-items-center gap-10'>
                                    <button className="totalproducts mb-0" onClick={handleAllProduct}>{`All Products`}</button>
                                    <div className="d-flex gap-10 align-items-center grid">
                                        <img
                                            onClick={() => {
                                                setGrid(3)
                                            }}
                                            src="images/gr4.svg"
                                            className='d-block img-fluid'
                                            alt="grid" />
                                        
                                        <img
                                            onClick={() => {
                                                setGrid(4)
                                            }}
                                            src="images/gr3.svg" 
                                            className='d-block img-fluid' 
                                            alt="grid" />
                                        
                                        <img
                                            onClick={() => {
                                                setGrid(6)
                                            }}
                                            src="images/gr2.svg" 
                                            className='d-block img-fluid' 
                                            alt="grid" />
                                        
                                        <img
                                            onClick={() => {
                                                setGrid(12)
                                            }}
                                            src="images/gr.svg" 
                                            className='d-block img-fluid' 
                                            alt="grid" />
                                    </div>
                                </div>
                            </div>
                    
                        </div>

                        <div className="products-list pb-5">
                            <div className='d-flex flex-wrap gap-10'>
                                {isLoading ? ( // Show loading indicator when isLoading is true
                                    <div className='loadingX gap-3'>
                                        <div className='loading-spinner'></div>
                                        <div className='load'>Loading ... </div>
                                    </div> 
                                ) : (
                                    displayProducts?.length > 0 ? (
                                        <CardProduct
                                            prodData={filteredProducts}
                                            grid={grid}
                                            searchProducts={searchProductState}
                                        />
                                    ) : (
                                        <NoData />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            
            </Container>

            
        </>
        
    )
}

export default ProductPage