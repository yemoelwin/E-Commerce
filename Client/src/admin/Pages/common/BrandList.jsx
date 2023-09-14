import React, { useEffect, useMemo, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getBrands } from '../../../features/brand/brandSlice';
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { CustomModal } from '../../../components/common/CustomModal';

const columns = [
    {
        title: "No",
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
    const brandState = useSelector((state) => state.brand.brands);
    const [open, setOpen] = useState(false);
    const [brandId, setBrandId] = useState("");
    const [selectedBrandName, setSelectedBrandName] = useState("");
    const showModal = (e) => {
        setOpen(true);
        setBrandId(e);
        const selectedBrand = brandState.find((brand) => brand._id === e);
        setSelectedBrandName(selectedBrand ? selectedBrand.title : "");
    };
    console.log(brandId);

    const handleCancel = () => {
        setOpen(false);
    };
        
    useEffect(() => {
        dispatch(getBrands());
    }, [dispatch]);

    const data1 = [];
    for (let i = 0; brandState?.length && i < brandState.length; i++) {
        data1.push({
            key: i + 1,
            name: brandState[i].title,
            views: brandState[i].numSearchs,
            action: (
                <>
                    <Link to={`/admin/edit-product-brand/${brandState[i]._id}`} className=''>Edit</Link>
                    <button className='ms-3 modalFix' onClick={() => showModal(brandState[i]._id)}>
                        <MdDelete className='fs-5 text-danger mb-1' />
                    </button>
                </>
            ),
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Brand Lists</h3>
                <div>
                    <Table columns={columns} dataSource={data1} />
                </div>
            <CustomModal
                title="Are you sure you want to delete this brand?"
                open={open}
                handleCancel={handleCancel}
                selectedBrandName={selectedBrandName}
            />
        </div>
    )
}

export default BrandList;