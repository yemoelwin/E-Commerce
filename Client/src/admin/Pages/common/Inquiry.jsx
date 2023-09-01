import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getInquiry } from '../../../features/inquiry/inquirySlice';
import { MdDelete } from 'react-icons/md';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Mobile",
        dataIndex: "mobile",
    },
    // {
    //     title: "Comment",
    //     dataIndex: "comment",
    // },
    {
        title: "Status",
        dataIndex: "status",
    },
    {
        title: "Action",
        dataIndex: "action",
    },
];
const Inquiry = () => {
    const dispatch = useDispatch();
    const inquiryState = useSelector((state) => state.inquiry.inquiries);
    useEffect(() => {
        dispatch(getInquiry());
    },[dispatch]);
    const data1 = [];
    for (let i = 0; i < inquiryState.length; i++) {
        data1.push({
            key: i + 1,
            name: inquiryState[i].name,
            email: inquiryState[i].email,
            mobile: inquiryState[i].mobile,
            // comment: inquiryState[i].comments,
            status: (
                <>
                    <select name="" id='' className='form-control form-select'>
                        <option value="" className=''>Set Status</option>
                    </select>
                </>
            ),
            action: (
                <>
                    <Link className=''>Edit</Link>
                    <Link className='ms-3'><MdDelete  className='fs-5 text-danger mb-1 '/></Link>
                </>
            ),
        });
    }
    return (
        <>
            <div>
                <h3 className="mb-4 title">Enquiries</h3>
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
        </>
    )
}

export default Inquiry