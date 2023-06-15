// import logo from './logo.svg';
import React from 'react';
import './css/App.css';
import './css/Product.css';
import './css/Contact.css';
import './css/CompareProduct.css';
import './css/Login.css';
import './css/Cart.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/MainLayout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import OurStore from './pages/OurStore';
import Blog from './pages/Blog';
import CompareProducts from './pages/CompareProducts';
import MyWishList from './pages/MyWishList';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import SignUp from './pages/SignUp';
import ResetPassword from './pages/ResetPassword';
import SingleBlog from './pages/SingleBlog';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermAndConditions from './pages/TermAndConditions';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {< Layout />}>
            <Route index element={< Home />} />
            <Route path='about' element={< About />} />
            <Route path='contact' element={< Contact />} />
            <Route path='product' element={< OurStore />} />
            <Route path='product/:id' element={< SingleProduct />} />
            <Route path='blog' element={< Blog />} />
            <Route path='blog/:id' element={< SingleBlog />} />
            <Route path='cart' element={< Cart />} />
            <Route path='checkout' element={< Checkout />} />
            <Route path='compare-product' element={<CompareProducts />} />
            <Route path='wishlist' element={<MyWishList />} />
            <Route path='login' element={<Login />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='reset-password' element={<ResetPassword />} />
            <Route path='shipping-policy' element={<ShippingPolicy/>} />
            <Route path='privacy-policy' element={<PrivacyPolicy />} />
            <Route path='refund-policy' element={<RefundPolicy />} />
            <Route path='term-conditions' element={<TermAndConditions />} />
            
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;
