import React, { useEffect } from 'react';
import { Table } from "antd";
import { Link } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getColors } from '../../../features/color/colorSlice';

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
    const colorState = useSelector((state) => state.color.colors);
    useEffect(() => {
        dispatch(getColors());
    }, [dispatch]);
    const data1 = [];
    for (let i = 0; i < colorState.length; i++) {
        data1.push({
            key: i + 1,
            name : colorState[i].color,
            views: colorState[i].numSearchs,
            action: (
                <>
                    <Link className=''>Edit</Link>
                    <Link className='ms-3'><MdDelete  className='fs-5 text-danger mb-1 '/></Link>
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
                {/* <CustomModal
                    hideModal={hideModal}
                    open={open}
                    performAction={() => {
                    deleteEnq(enqId);
                    }}
                    title="Are you sure you want to delete this enquiry?"
                /> */}
            </div>
    )
}

export default Colors