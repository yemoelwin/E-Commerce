import React, { useEffect, lazy, Suspense, startTransition } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/AuthSlice";
import { PrivateRoutes } from "./routes/privateRoutes";
import "./css/App.css";
import "./css/Product.css";
import "./css/Contact.css";
import "./css/invoice.css";
import "./css/CompareProduct.css";
import "./css/Login.css";
import "./css/signup.css";
import "./css/Cart.css";
import "./css/Dashboard.css";
import "./admin/layouts/MainLayout.css";

/* Main Application */

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Layout from "./containers/layout/Layout";
import IsLoading from "./containers/common/IsLoading";
// import VerificationPage from "./pages/auth/VerificationPage";
// import EmailVerification from "./pages/auth/EmailVerification";

const OurStore = lazy(() => import("./pages/OurStore"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const SingleBlog = lazy(() => import("./pages/SingleBlog"));
const OrderList = lazy(() => import("./pages/OrderList"));
const CompareProduct = lazy(() => import("./pages/CompareProduct"));
const WishList = lazy(() => import("./pages/WishList"));
const Login = lazy(() => import("./pages/auth/Login"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const VerificationPage = lazy(() => import("./pages/auth/VerificationPage"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Cart = lazy(() => import("./pages/Cart"));
const CheckoutCancel = lazy(() => import("./containers/common/CheckoutCancel"));
const CheckoutSuccess = lazy(() => import("./pages/CheckoutSuccess"));

/* Admin */
const MainLayout = lazy(() => import("./admin/layouts/MainLayout"));
const Inquiry = lazy(() => import("./admin/Pages/common/Inquiry"));
const BlogList = lazy(() => import("./admin/Pages/common/BlogList"));
const BlogCategoryList = lazy(() =>
	import("./admin/Pages/common/BlogCategoryList"),
);
const Orders = lazy(() => import("./admin/Pages/common/Orders"));
const Customers = lazy(() => import("./admin/Pages/customers/Customers"));
const Colors = lazy(() => import("./admin/Pages/common/Colors"));
const CategoryList = lazy(() => import("./admin/Pages/common/CategoryList"));
const BrandList = lazy(() => import("./admin/Pages/common/BrandList"));
const ProductList = lazy(() => import("./admin/Pages/common/ProductList"));
const DashBoard = lazy(() => import("./admin/Pages/dashBoard/DashBoard"));
const AddBlog = lazy(() => import("./admin/Pages/common/AddBlog"));
const AddBlogCategory = lazy(() =>
	import("./admin/Pages/common/AddBlogCategory"),
);
const AddColor = lazy(() => import("./admin/Pages/common/AddColor"));
const AddCategory = lazy(() => import("./admin/Pages/common/AddCategory"));
const AddBrand = lazy(() => import("./admin/Pages/common/AddBrand"));
const AddProduct = lazy(() => import("./admin/Pages/common/AddProduct"));
const AddCoupon = lazy(() => import("./admin/Pages/common/AddCoupon"));
const CouponList = lazy(() => import("./admin/Pages/common/CouponList"));
const ViewInquiry = lazy(() => import("./admin/Pages/common/ViewInquiry"));
const DataTable = lazy(() => import("./containers/common/DataTable"));
const SpecificDataPage = lazy(() =>
	import("./admin/Pages/common/SpecificDataPage"),
);
const ViewOrders = lazy(() => import("./admin/Pages/common/ViewOrders"));

function AdminRoutes() {
	return (
		<Routes>
			<Route element={<MainLayout />}>
				<Route index element={<DashBoard />} />
				<Route path='product-lists' element={<ProductList />} />
				<Route path='add-product' element={<AddProduct />} />
				<Route path='edit-product/:id' element={<AddProduct />} />
				<Route path='add-blog' element={<AddBlog />} />
				<Route path='edit-blog/:id' element={<AddBlog />} />
				<Route path='blog-list' element={<BlogList />} />
				<Route path='add-blog-category' element={<AddBlogCategory />} />
				<Route path='edit-blog-category/:id' element={<AddBlogCategory />} />
				<Route path='blog-category-list' element={<BlogCategoryList />} />
				<Route path='orders' element={<Orders />} />
				<Route
					path='view-orders/:userId/:transitionId'
					element={<ViewOrders />}
				/>
				<Route path='customers' element={<Customers />} />
				<Route path='color-lists' element={<Colors />} />
				<Route path='add-color' element={<AddColor />} />
				<Route path='edit-color/:id' element={<AddColor />} />
				<Route path='category-lists' element={<CategoryList />} />
				<Route path='add-category' element={<AddCategory />} />
				<Route path='edit-category/:id' element={<AddCategory />} />
				<Route path='brand-lists' element={<BrandList />} />
				<Route path='add-product-brand' element={<AddBrand />} />
				<Route path='edit-product-brand/:id' element={<AddBrand />} />
				<Route path='add-coupon' element={<AddCoupon />} />
				<Route path='coupon-lists' element={<CouponList />} />
				<Route path='inquiry' element={<Inquiry />} />
				<Route path='view-inquiry/:id' element={<ViewInquiry />} />
				<Route path='specific-data' element={<SpecificDataPage />} />
				<Route path='table' element={<DataTable />} />
			</Route>
		</Routes>
	);
}

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		startTransition(() => {
			// Attempt to retrieve user data from local storage
			try {
				const user = JSON.parse(localStorage.getItem("user"));
				if (user) {
					// Dispatch the user data to set the user in your Redux store
					dispatch(setUser(user));
				}
			} catch (error) {
				// Handle any errors that occur while retrieving or parsing user data
				console.error("Error retrieving user data:", error);
			}
		});
	}, [dispatch]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Layout />}>
						<Route index exact element={<Home />} />
						<Route path='*' element={<NotFound />} />
						<Route
							path='contact'
							element={
								<Suspense fallback={<IsLoading />}>
									<ContactUs />
								</Suspense>
							}
						/>
						<Route
							path='product'
							element={
								<Suspense fallback={<IsLoading />}>
									<OurStore />
								</Suspense>
							}
						/>
						<Route
							path='product/:id'
							element={
								<Suspense fallback={<IsLoading />}>
									<SingleProduct />
								</Suspense>
							}
						/>
						<Route
							path='blog'
							element={
								<Suspense fallback={<IsLoading />}>
									<BlogPage />
								</Suspense>
							}
						/>
						<Route
							path='blog/:id'
							element={
								<Suspense fallback={<IsLoading />}>
									<SingleBlog />
								</Suspense>
							}
						/>
						<Route
							path='cart'
							element={
								<PrivateRoutes>
									<Suspense fallback={<IsLoading />}>
										<Cart />
									</Suspense>
								</PrivateRoutes>
							}
						/>
						<Route
							path='checkout-success/:userId/:transitionId'
							element={
								<Suspense fallback={<IsLoading />}>
									<CheckoutSuccess />
								</Suspense>
							}
						/>
						<Route
							path='orderlists/:id'
							element={
								<Suspense fallback={<IsLoading />}>
									<OrderList />
								</Suspense>
							}
						/>
						<Route
							path='canceled'
							element={
								<Suspense fallback={<IsLoading />}>
									<CheckoutCancel />
								</Suspense>
							}
						/>
						<Route
							path='compare-product'
							element={
								<Suspense fallback={<IsLoading />}>
									<CompareProduct />
								</Suspense>
							}
						/>
						<Route
							path='wishlist'
							element={
								<PrivateRoutes>
									<Suspense fallback={<IsLoading />}>
										<WishList />
									</Suspense>
								</PrivateRoutes>
							}
						/>
						<Route
							path='login'
							element={
								<Suspense fallback={<IsLoading />}>
									<Login />
								</Suspense>
							}
						/>
						<Route
							path='signup'
							element={
								<Suspense fallback={<IsLoading />}>
									<SignUp />
								</Suspense>
							}
						/>

						<Route
							path='forgot-password'
							element={
								<Suspense fallback={<IsLoading />}>
									<ForgotPassword />
								</Suspense>
							}
						/>
						<Route
							path='reset-password/:id/:uniqueToken'
							element={
								<Suspense fallback={<IsLoading />}>
									<ResetPassword />
								</Suspense>
							}
						/>
					</Route>
					<Route
						path='/admin/*'
						element={
							<Suspense fallback={<IsLoading />}>
								<AdminRoutes />
							</Suspense>
						}
					/>
					<Route
						path='/verify/email/:_id'
						element={
							<Suspense fallback={<IsLoading />}>
								<VerificationPage />
							</Suspense>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
