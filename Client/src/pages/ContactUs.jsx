import React from 'react'
// import Maps from './Maps';
import { AiOutlineHome, AiOutlineMail } from 'react-icons/ai'
import { BiPhoneCall, BiInfoCircle } from 'react-icons/bi'
import Container from '../components/common/Container';
import Meta from '../components/common/Meta';
import BreadCrumb from '../components/common/BreadCrumb';

const ContactUs = () => {
    return (
        <>
            <Meta title={"Contact Us" }/>
            <BreadCrumb title="Contact Us" />
            <Container class1="contact-wrapper py-5 home-wrapper-2">
                    <div className="row">
                        <div className="col-12">
                            {/* <Maps />             */}
                        </div>

                        <div className="col-12 mt-5">
                            <div className="contact-inner-wrapper d-flex justify-content-between">
                                <div>
                                    <h3 className='contact-title mt-4'>Contact</h3>
                                    <form action="" className='d-flex flex-column gap-15 mt-4'>
                                        <div>
                                            <input type="text" className='form-control' style={{'height':"50px"}} placeholder='Name'/>
                                        </div>
                                        <div>
                                            <input type="email" className='form-control' style={{'height':'50px'}} placeholder='Email'/>
                                        </div>
                                        <div>
                                            <input type="number" className='form-control' style={{'height':'50px'}} placeholder='Phone Number'/>
                                        </div>
                                        <div>
                                            <textarea name="" id=""  className='w-100 form-control' cols="30" rows="5" style={{'height':'150px'}} placeholder='Comments'></textarea>
                                        </div>
                                        <div>
                                            <button className='button border-0'>Submit</button>
                                        </div>
                                    </form>
                                </div>

                                <div>
                                    <h3 className='contact-title mt-4'>Get in Touch With Us</h3>
                                    <div className='mt-4'>
                                        <ul className="ps-0">
                                            <li className='mb-3 d-flex align-items-center gap-15'>
                                                <AiOutlineHome className='fs-5 ' />
                                                <address className='mb-0'>No-8, Park street, Near School Bus-stop, Kamayut Township</address>
                                            </li>
                                            <li className='mb-3 d-flex align-items-center gap-15'>
                                                <BiPhoneCall className='fs-5 ' />
                                                <a href="tel:+95 9257879097" >+95 9257879097</a>
                                            </li>
                                            <li className='mb-3 d-flex align-items-center gap-15'>
                                                <AiOutlineMail className='fs-5' />
                                                <a href="mailto:yemoelwin142@gmail.com">yemoelwin142@gmail.com</a>
                                            </li>
                                            <li className='mb-3 d-flex align-items-center gap-15'>
                                                <BiInfoCircle className='fs-5' />
                                                <p className='mb-0'>Monday - Friday, 9AM - 7PM</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default ContactUs