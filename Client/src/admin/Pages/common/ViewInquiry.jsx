import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getInquiry } from '../../../features/inquiry/inquirySlice';
import { BiArrowBack } from 'react-icons/bi';

const ViewInquiry = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const InquiryId = location.pathname.split('/')[3];
    const inquiryState = useSelector((state) => state.inquiry);
    const { inquiryData } = inquiryState;
    const name = inquiryData?.name;
    const email = inquiryData?.email;
    const mobile = inquiryData?.mobile;
    const comments = inquiryData?.comments;
    const status = inquiryData?.status;
    // const { name, email, mobile, comments, status } = inquiryData;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (InquiryId !== undefined) {
                    setIsLoading(true);
                    await dispatch(getInquiry(InquiryId));
                }
            } catch (error) {
                console.error('Error fetching inquiry data:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [InquiryId]);

    const goBack = () => {
        navigate(-1);
    }

    return (
        <>
            <div>
                <div className='d-flex justify-content-between align-items-center'>
                    <h3 className='mb-4 title'>View Inquiry</h3>
                    <button
                        onClick={goBack}
                        className='bg-transparent border-0 fs-6 align-items-center d-flex gap-1'>
                        <BiArrowBack className='fs-5 mt-1'/>Go Back
                    </button>
                </div>

                <div className='mt-4 bg-white p-4 rounded-3 d-flex flex-column gap-3'>
                    {isLoading ? (
                        <div className='loading gap-3'>
                            <div className='loading-spinner'></div>
                            <div className=''>Loading... </div>
                        </div> 
                    ) : (
                        <>
                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='mb-0 selectedHeader'>Name :</h5>
                                <p className='mb-0 spanSelectedItem'>{name}</p>
                            </div>

                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='mb-0 selectedHeader'>Email :</h5>
                                <p className='mb-0 spanSelectedItem'><Link to={`mailto:${email}`}>{email}</Link></p>
                            </div>

                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='mb-0 selectedHeader'>Mobile :</h5>
                                <p className='mb-0 spanSelectedItem'><Link to={`tel:+95${mobile}`}>{mobile}</Link></p>
                            </div>

                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='mb-0 selectedHeader'>Comment :</h5>
                                <p className='mb-0 spanSelectedItem'>{comments}</p>
                            </div>

                            <div className='d-flex align-items-center gap-3'>
                                <h5 className='mb-0 selectedHeader'>Status :</h5>
                                <p className='mb-0 spanSelectedItem'>{status}</p>
                            </div>
                        </>
                    )}
                    

                    {/* <div className='d-flex align-items-center gap-3'>
                        <h5 className='mb-0 selectedHeader'>Change Status :</h5>
                        <div className=''>
                            <select name="" id="" defaultValue={status ? status : 'Select Status'} className="form-control form-select mt-1">
                                <option value="submitted" >Submitted</option>
                                <option value="contacted">Contacted</option>
                                <option value="inprocess">In Process</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                    </div> */}

                </div>
            </div>
        </>
    )
}

export default ViewInquiry