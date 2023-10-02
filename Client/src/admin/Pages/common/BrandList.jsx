import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getBrands, deleteBrand, brandResetState } from '../../../features/brand/brandSlice';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { CustomModal } from '../../../components/common/CustomModal';
import { showToast } from '../../../components/common/ShowToast';
// import { toast } from 'react-toastify';

const columns = [
    {
        title: "No",
        dataIndex: 'no',
    },
    {
        title: "Id",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name) || b.name.localeCompare(a.name),
    },
    {
        title: "Total Views",
        dataIndex: "views",
    },
    {
        title: "Action",
        dataIndex: "action",
    },
];

const BrandList = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [brandId, setBrandId] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBrandName, setSelectedBrandName] = useState("");
    const brandState = useSelector((state) => state.brand.brands);
    // const Brand = useSelector((state) => state.brand);
    // const { isSuccess, isError, deletedBrand } = Brand;

    useEffect(() => {
        setIsLoading(true);
            try {
                dispatch(getBrands());
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
    }, []);

    const showModal = (e) => {
        setOpen(true);
        setBrandId(e);
        const selectedBrand = brandState.find((brand) => brand._id === e);
        setSelectedBrandName(selectedBrand ? selectedBrand.title : "");
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const data1 = [];
    let count = 0;
    for (let i = 0; brandState?.length && i < brandState?.length; i++) {
        count++;
        data1.push({
            no: count,
            key: brandState[i]?._id,
            name: brandState[i]?.title,
            views: brandState[i]?.numSearchs,
            action: (
                <>
                    <Link to={`/admin/edit-product-brand/${brandState[i]?._id}`} className=''>Edit</Link>
                    <button className='ms-3 modalFix' onClick={() => showModal(brandState[i]?._id)}>
                        <MdDelete className='fs-5 text-danger mb-1' />
                    </button>
                </>
            ),
        });
    }

    const deleteBrandItem = async (e) => {
        setIsLoading(true);
        try {
            setOpen(false);
            await dispatch(deleteBrand(e));
            await dispatch((getBrands()));
            showToast('Item has been deleted successfully.');
        } catch (error) {
            console.error('Error while deleting brand:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
        }
    }

    return (
        <div>
            <h3 className="mb-4 title">Brand Lists</h3>
            <div>
                {isLoading ? ( // Show loading indicator when isLoading is true
                    <div className='loading-container gap-3'>
                        <div className='loading-spinner'></div>
                        <div className='load'>Loading ... </div>
                    </div> 
                ) : (
                    <Table columns={columns} dataSource={data1} />
                )}
            </div>
            <CustomModal
                title="Are you sure you want to delete this brand?"
                open={open}
                handleCancel={handleCancel}
                performAction={() => {deleteBrandItem(brandId)}}
                selectedBrandName={selectedBrandName}
            />
        </div>
    )
}

export default BrandList;