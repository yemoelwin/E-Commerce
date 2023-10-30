import React, { useEffect, useState } from 'react';

const ShowMoreList = ({ categories, brands, selectedOption, onBrandClick, onCategoryClick }) => {
    const [showAll, setShowAll] = useState(false);
    const [showCategory, setShowCategory] = useState([]);
    const [showBrand, setShowBrand] = useState([]);
    const maxItemsToShow = 6;

    useEffect(() => {
        let data = [];
        for (let index = 0; index < categories.length; index++) {
            const element = categories[index];
            data.push({
                name: element?.title
            });
            setShowCategory(data)
        }
    }, [categories])

    useEffect(() => {
        let brandData = [];
        for (let index = 0; index < brands.length; index++) {
            const element = brands[index];
            brandData.push({
                name: element?.title
            });
            setShowBrand(brandData)
        }
    }, [brands])

    const handleChangeOption = (itemName) => {
        if (selectedOption === 'Categories') {
            onCategoryClick(itemName);
        } else if (selectedOption === 'Brand') {
            onBrandClick(itemName);
        }
    }

    const visibleCategoryItems = showAll ? showCategory : showCategory.slice(0, maxItemsToShow);

    const visibleBrandItems = showAll ? showBrand : showBrand.slice(0, maxItemsToShow);
    
    return (
        <div className='side-bar-display' style={{ overflow: 'hidden', transition: 'height 0.3s' }}>
            <ul style={{ margin: 0, padding: 0 }}>
                {(selectedOption === 'Categories' ? visibleCategoryItems : visibleBrandItems).map(
                    (item, index) => (
                    <li
                        key={index}
                        className='item-name'
                        onClick={() => handleChangeOption(item.name)}
                    >   
                        {item.name}
                    </li>
                ))}
            </ul>
            <div className=''>
                {(showCategory ? showCategory : showBrand)?.length > maxItemsToShow && (
                    <button
                        className='see-more-button'
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'See Less' : 'See More'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ShowMoreList;