// import logo from './logo.svg';
import React, { useEffect } from 'react';
import './css/App.css';
import './css/Product.css';
import './css/Contact.css';
import './css/CompareProduct.css';
import './css/Login.css';
// import './pages/auth/Login.css'
import './css/Cart.css';
import './css/Dashboard.css';
import './admin/layouts/MainLayout.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import OurStore from './pages/OurStore';
import CompareProduct from './pages/CompareProduct';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import SignUp from './pages/auth/SignUp';
import ResetPassword from './pages/auth/ResetPassword';
import SingleBlog from './pages/SingleBlog';
import ShippingPolicy from './pages/ShippingPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import TermAndConditions from './pages/TermAndConditions';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ContactUs from './pages/ContactUs';
import BlogPage from './pages/BlogPage';
import WishList from './pages/WishList';

/* admin */
import MainLayout from "./admin/layouts/MainLayout";
import Inquiry from "./admin/Pages/common/Inquiry";
import BlogList from "./admin/Pages/common/BlogList";
import BlogCategoryList from "./admin/Pages/common/BlogCategoryList";
import Orders from "./admin/Pages/common/Orders";
import Customers from "./admin/Pages/customers/Customers";
import Colors from "./admin/Pages/common/Colors";
import CategoryList from "./admin/Pages/common/CategoryList";
import BrandList from "./admin/Pages/common/BrandList";
import ProductList from "./admin/Pages/common/ProductList";
import DashBoard from "./admin/Pages/dashBoard/DashBoard";
import AddBlog from "./admin/Pages/common/AddBlog";
import AddBlogCategory from "./admin/Pages/common/AddBlogCategory";
import AddColor from "./admin/Pages/common/AddColor";
import AddCategory from "./admin/Pages/common/AddCategory";
import AddBrand from "./admin/Pages/common/AddBrand";
import AddProduct from "./admin/Pages/common/AddProduct";

import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './features/auth/AuthSlice';
import AddCoupon from './admin/Pages/common/AddCoupon';
import CouponList from './admin/Pages/common/CouponList';
// import ProtectedRoute from './routes/protectedRoute';

function App() {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element = {< Layout />}>
            <Route index element={< Home />} />
            <Route path='about' element={< About />} />
            <Route path='contact' element={< ContactUs />} />
            <Route path='product' element={< OurStore />} />
            <Route path='product/:id' element={< SingleProduct />} />
            <Route path='blog' element={< BlogPage />} />
            <Route path='blog/:id' element={< SingleBlog />} />
            <Route path='cart' element={< Cart />} />
            <Route path='checkout' element={< Checkout />} />
            <Route path='compare-product' element={<CompareProduct />} />
            <Route path='wishlist' element={<WishList />} />
            <Route path='login' element={<Login />} />
            {/* <Route path='login' element={<Loggedin />} /> */}
            <Route path='signup' element={<SignUp />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
            <Route path='shipping-policy' element={<ShippingPolicy/>} />
            <Route path='privacy-policy' element={<PrivacyPolicy />} />
            <Route path='refund-policy' element={<RefundPolicy />} />
            <Route path='term-conditions' element={<TermAndConditions />} />
          </Route>

          <Route path="admin" element={<MainLayout />} >
                <Route index element= {<DashBoard />} />
                <Route path="inquiry" element= {<Inquiry />} />
                <Route path="blog-list" element= {<BlogList />} />
                <Route path="blog-category-list" element={<BlogCategoryList />} />
                <Route path="add-blog" element={<AddBlog />} />
                <Route path="add-blog-category" element={<AddBlogCategory />} />
                <Route path="orders" element= {<Orders />} />
                <Route path="customers" element= {<Customers />} />
                <Route path="color-lists" element= {<Colors />} />
                <Route path="add-color" element= {<AddColor />} />
                <Route path="edit-color/:id" element= {<AddColor />} />
                <Route path="category-lists" element= {<CategoryList />} />
                <Route path="add-category" element= {<AddCategory />} />
                <Route path="edit-category/:id" element= {<AddCategory />} />
                <Route path="brand-lists" element= {<BrandList />} />
                <Route path="add-product-brand" element= {<AddBrand mode='add' />} />
                <Route path="edit-product-brand/:id" element= {<AddBrand mode='update'/>} />
                <Route path="product-lists" element= {<ProductList />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="add-coupon" element={<AddCoupon/>} />
                <Route path="coupon-lists" element={<CouponList/>} />
          </Route>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/admin" /> : <Login />}
          />
        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;

