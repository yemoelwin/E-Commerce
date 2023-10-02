import React, { useEffect, useState } from 'react';
import { Table } from "antd";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteInquiry, getAllInquiries, updateInquiry } from '../../../features/inquiry/inquirySlice';
import { MdDelete } from 'react-icons/md';
import { BsEyeSlash } from 'react-icons/bs';
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
        sorter: (a, b) => a.name.localeCompare(b.name) || b.name.localeCompare(a.name),
    },
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
    const [open, setOpen] = useState(false);
    const [inquiryId, setInquiryId] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const fetchInquiry = async () => {
            try {
                await dispatch(getAllInquiries());
            } catch (error) {
                console.error('Error fetching inquiries:', error);
            } finally {
                setIsLoading(false); // Set loading to false regardless of success or failure
            }
        }
        fetchInquiry();
    }, []);
    
    const showModal = (e) => {
        setOpen(true);
        setInquiryId(e);
        const inquiryData = inquiryState?.find((data) => data._id === (e));
        setSelectedInquiry(inquiryData ? inquiryData?.name : '');
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const deleteItem = async (e) => {
        setIsLoading(true);
        try {
            await dispatch(deleteInquiry(e));
            // Fetch the updated data
            await dispatch(getAllInquiries());
            showToast('You delete the coupon successfully.');
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
            setOpen(false);
        }
    };

    const enquiryStatus = async (statusData, inquiryId) => {
        setIsLoading(true);
        try {
            const data = { id: inquiryId, inquiryData: statusData };
            await dispatch(updateInquiry(data));
            await dispatch(getAllInquiries());
            showToast('Status has been changed successfully.');
        } catch (error) {
            console.error('Error updating inquiry status:', error);
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or failure
        }
    }
    
    const data1 = [];
    for (let i = 0; i < inquiryState?.length; i++) {
        data1.push({
            key: i + 1,
            name: inquiryState[i]?.name,
            status: (
                <>
                    <select
                        name="" id=""
                        defaultValue={inquiryState[i]?.status ? inquiryState[i]?.status : 'Submitted'} className="form-control form-select"
                        onChange={(e) => enquiryStatus(e.target.value, inquiryState[i]._id)}
                    >
                        <option value="Submitted" >Submitted</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Process">In Process</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </>
            ),
            action: (
                <>
                    <div>
                        <Link to={`/admin/view-inquiry/${inquiryState[i]?._id}`} className='ms-3'>
                            <BsEyeSlash className='fs-5 text-danger mb-1 ' />
                        </Link>
                        <button onClick={() => showModal(inquiryState[i]?._id)} className='ms-3 modalFix'>
                            <MdDelete className='fs-4 text-danger mb-1 '/>
                        </button>
                    </div>
                </>
            ),
        });
    }
    return (
        <>
            <div>
                <h3 className="mb-4 title">Inquiries</h3>
                <div>
                    {isLoading ? ( // Show loading indicator when isLoading is true
                        <div className='loading gap-3'>
                            <div className='loading-spinner'></div>
                            <div className='load'>Loading ... </div>
                        </div> 
                    ) : (
                        <Table columns={columns} dataSource={data1} />
                    )}
                </div>
                <CustomModal
                    title="Are you sure you want to delete this inquiry?"
                    open={open}
                    handleCancel={handleCancel}
                    performAction={() => {deleteItem(inquiryId)}}
                    selectedInquirer={selectedInquiry}
                />
            </div>
        </>
    )
}

export default Inquiry