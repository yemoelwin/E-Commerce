import React from 'react';
import { BsArrowDownRight, BsArrowUpRight } from 'react-icons/bs';
// import { Column } from '@ant-design/plots';
import { Table } from 'antd';

const columns = [
    {
        title: 'No',
        dataIndex: 'key',
    },
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Products',
        dataIndex: 'products',
    },
    {
        title: 'Status',
        dataIndex: 'status'
    },
];
const data1 = [];
for (let i = 0; i < 46; i++) {
    data1.push({
        key: i,
        name: `Mr Jerry ${i}`,
        products: `UV Wallet`,
        status: `Master Card, Prepaid`,
    });
}

const DashBoard = () => {

    return (
        <>
            <div>
                <h3 className='mb-4'>DashBoard</h3>
                <div className='d-flex justify-content-between align-items-center gap-5'>
                    <div className='justify_A d-flex bg-white flex-grow-1 p-3 rounded border'>
                            <div>
                                <p className='desc'>Total</p>
                                <h4 className='mb-0 sub-title'>$1100</h4>
                            </div>
                            <div className='d-flex flex-column align-items-end'>
                                <h6 className='red'><BsArrowDownRight/> 32%</h6>
                                <p className='mb-0 desc'>Compared to July</p>
                            </div>
                    </div>
                    <div className='justify_A d-flex bg-white flex-grow-1 p-3 rounded border'>
                        <div>
                            <p className='desc'>Total</p>
                            <h4 className='mb-0 sub-title'>$1100</h4>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                            <h6 className='green'><BsArrowUpRight/> 58%</h6>
                            <p className='mb-0 desc'>Compared to July</p>
                        </div>
                    </div>
                    <div className='justify_A d-flex bg-white flex-grow-1 p-3 rounded border'>
                        <div>
                            <p className='desc'>Total</p>
                            <h4 className='mb-0 sub-title'>$1100</h4>
                        </div>
                        <div className='d-flex flex-column align-items-end'>
                            <h6 className='red'><BsArrowDownRight/> 32%</h6>
                            <p className='mb-0 desc'>Compared to July</p>
                        </div>
                    </div>
                </div>

                {/* <div className='mt-5'>
                    <h3 className="mb-4 title">
                        Income Statics
                    </h3>
                    <div>
                        <Column {...config} />
                    </div>
                </div> */}

                <div className="mt-5">
                    <h3 className="mb-4 title">Recent Orders</h3>
                    <div>
                        <Table columns={columns} dataSource={data1} />
                    </div>
                </div>

            </div>
        </>
    )
}

export default DashBoard;