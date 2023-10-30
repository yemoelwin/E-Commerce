import React, { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ searchInput }) => {
    const navigate = useNavigate();
    const [productOpt, setProductOpt] = useState([]);
    // console.log(productOpt)
    // const [paginate, setPaginate] = useState(true);
    
    // useEffect(() => {
    //     let data = [];
    //     for (let index = 0; index < products?.length; index++) {
    //         const element = products[index];
    //         data.push({
    //             id: index,
    //             productId: element?._id,
    //             name: element?.title,
    //             brand: element?.brand,
    //             category: element?.category
    //         })
    //     }
    //     setProductOpt(data)
    // }, [products]);

    // const customSearch = (query, option) => {
    //     if (typeof query !== 'string') {
    //         return false;
    //     }
    //     query = query.toLowerCase();
    //     return (
    //         option.name.toLowerCase().includes(query) ||
    //         option.brand.toLowerCase().includes(query) ||
    //         option.category.toLowerCase().includes(query)
    //     );
    // };

    return (
        <>
            {/* <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products"
            /> */}
            {/* <Typeahead
                id="pagination-example"
                onPaginate={() => console.log('Results paginated')}
                labelKey={"category"} 
                // filterBy={customSearch}
                options={productOpt}
                // paginate={paginate}
                placeholder="Search by name, brand, or category..."
                onChange={(selected) => {
                    navigate('/product')
                }}
            /> */}
        </>
    )
}

export default SearchBar