import React, { useEffect } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../../features/customer/CustomerSlice';

const columns = [
    {
        title: "No",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.name.localeCompare(b.name) || b.name.localeCompare(a.name),
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Mobile",
        dataIndex: "mobile",
    },
];

const Customers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);
    const customerState = useSelector((state) => state.customer.users);
    const data1 = [];
    let counter = 0;
    for (let i = 0; i < customerState.length; i++) {
        if (customerState[i].role !== 'admin') {
            counter++;
            data1.push({
                key: counter,
                name: customerState[i].firstname + " " + customerState[i].lastname,
                email: customerState[i].email,
                mobile: customerState[i].mobile,
            });
        }
    }
    // console.log(data1);
    return (
        <>
            <div>
                <h3 className="mb-4 title">Customer Lists</h3>
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

export default Customers