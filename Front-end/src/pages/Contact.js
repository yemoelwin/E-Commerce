import React from 'react'
import Meta from '../components/Product/Meta';
import BreadCrumb from '../components/Product/BreadCrumb';
import ContactUs from '../components/Contact/ContactUs';


const Contact = () => {
    return (
      <>
        <Meta title={"Contact Us" }/>
        <BreadCrumb title="Contact Us" />
        <ContactUs />
      </>
    )
}

export default Contact