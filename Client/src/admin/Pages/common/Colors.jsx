import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getColors, deleteColor } from '../../../features/color/colorSlice';
import { CustomModal } from '../../../components/common/CustomModal';
import { showToast } from '../../../components/common/ShowToast';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
        sorter: (a, b) => a.color.localeCompare(b.color) || b.name.localeCompare(a.name),
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

const Colors = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [colorId, setColorId] = useState('');
    const [selectedColor, setSelectedColor] = useState([]);
    const colorState = useSelector((state) => state.color.colors);

    useEffect(() => {
        dispatch(getColors());
    }, [dispatch]);

    const showModal = (e) => {
        setOpen(true);
        setColorId(e);
        const findColor = colorState.find((colour) => colour._id === (e));
        setSelectedColor(findColor ? findColor.color : '');
    }

    const deleteItem = async(e) => {
        await dispatch(deleteColor(e))
            .then(() => {
                dispatch(getColors());
                setTimeout(() => {
                    showToast('Product Category deleted successfully.');
                },[400])
            })
            .catch(error => {
                console.log(error);
                showToast('Something went wrong and cannot add.Try again.');
            });
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };
    
    const data1 = [];
    for (let i = 0; i < colorState.length; i++) {
        data1.push({
            key: i + 1,
            name : colorState[i].color,
            views: colorState[i].numSearchs,
            action: (
                <>
                    <Link to={`/admin/edit-color/${colorState[i]._id}`} className=''>Edit</Link>
                    <button onClick={() => showModal(colorState[i]._id)} className='ms-3 modalFix'>
                        <MdDelete className='fs-5 text-danger mb-1 '/>
                    </button>
                    
                </>
            ),
        });
    }
    return (
        <div>
                <h3 className="mb-4 title">Color Lists</h3>
                <div>
                    <Table columns={columns} dataSource={data1} />
                </div>
                <CustomModal
                    title="Are you sure you want to delete this Category?"
                    open={open}
                    handleCancel={handleCancel}
                    performAction={() => {deleteItem(colorId)}}
                    selectedColor={selectedColor}
                />
            </div>
    )
}

export default Colors