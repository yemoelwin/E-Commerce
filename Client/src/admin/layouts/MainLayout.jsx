import React, { useState } from "react";
import {
	// DesktopOutlined,
	// FileOutlined,
	// PieChartOutlined,
	// TeamOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	AiOutlineDashboard,
	AiOutlineShoppingCart,
	AiOutlineBgColors,
} from "react-icons/ai";
import { SiBrandfolder } from "react-icons/si";
import { BiCategory } from "react-icons/bi";
import { FaClipboardList, FaBlogger } from "react-icons/fa";
import { ImBlog } from "react-icons/im";
import { RiHomeOfficeLine, RiLogoutCircleRLine } from "react-icons/ri";
// import { IoIosNotifications } from "react-icons/io";
import { CiDiscount1, CiViewList } from "react-icons/ci";
import { CgPlayListAdd } from "react-icons/cg";
import { Layout, Menu } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../../containers/common/Meta";
import { logout } from "../../features/auth/AuthSlice";
import { clearCartItem } from "../../features/cart/cartSlice";
import { persistor } from "../../app/store";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
	return {
		key,
		icon,
		children,
		label,
	};
}
const items = [
	getItem("DashBoard", "admin", <AiOutlineDashboard className='fs-6' />),
	getItem("Customers", "customers", <UserOutlined className='fs-6' />),
	getItem("Catalog", "catalog", <AiOutlineShoppingCart className='fs-6' />, [
		getItem(
			"Add Products",
			"add-product",
			<AiOutlineShoppingCart className='fs-6' />,
		),
		getItem(
			"Product-Lists",
			"product-lists",
			<AiOutlineShoppingCart className='fs-6' />,
		),
		getItem(
			"Add Brand",
			"add-product-brand",
			<SiBrandfolder className='fs-6' />,
		),
		getItem("Brand-Lists", "brand-lists", <SiBrandfolder className='fs-6' />),
		getItem("Add Category", "add-category", <BiCategory className='fs-6' />),
		getItem(
			"Category-Lists",
			"category-lists",
			<BiCategory className='fs-6' />,
		),
		getItem("Add Color", "add-color", <AiOutlineBgColors className='fs-6' />),
		getItem(
			"Color-Lists",
			"color-lists",
			<AiOutlineBgColors className='fs-6' />,
		),
	]),
	getItem("Orders", "orders", <FaClipboardList className='fs-6' />),
	getItem("Marketing", "Marketing", <CiDiscount1 className='fs-6' />, [
		getItem("Add Coupon", "add-coupon", <CgPlayListAdd className='fs-5' />),
		getItem("Coupon Lists", "coupon-lists", <CiViewList className='fs-5' />),
	]),
	getItem("Blogs", "blogs", <FaBlogger className='fs-6' />, [
		getItem("Add Blog", "add-blog", <ImBlog className='fs-6' />),
		getItem("Blog List", "blog-list", <FaBlogger className='fs-6' />),
		getItem(
			"Add Blog Category",
			"add-blog-category",
			<ImBlog className='fs-6' />,
		),
		getItem(
			"Blog Category List",
			"blog-category-list",
			<FaBlogger className='fs-6' />,
		),
	]),
	getItem("Inquiry", "inquiry", <FaClipboardList className='fs-7' />),
	getItem("Logout", "logout", <RiLogoutCircleRLine className='fs-6' />),
];

const MainLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [showText, setShowText] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const authState = useSelector((state) => state.auth.users);

	const userName = `${authState?.firstname} ${authState?.lastname}`;

	const handleSideBarTrigger = () => {
		setShowText((prevShowLargeText) => !prevShowLargeText);
	};

	const handleLogout = async () => {
		try {
			await dispatch(logout());
			dispatch(clearCartItem());
			/* clear all data in the localStorage */
			localStorage.clear();

			// clear all data which are persisted by redux persist library
			persistor.purge();
			navigate("/login");
		} catch (error) {
			console.error("error", error);
		}
	};
	return (
		<>
			<Meta title={" Admin DashBoard "} />
			<Layout
				style={{
					minHeight: "100vh",
				}}
			>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={(value) => {
						setCollapsed(value);
						handleSideBarTrigger();
					}}
				>
					<div className='logo p-2'>
						<Link to='/'>
							<span className={`sm-logo ${showText ? "hidden" : ""}`}>
								ECommerce
							</span>
						</Link>
						<span className={`lg-logo ${showText ? "" : "hidden"}`}>
							<RiHomeOfficeLine />
						</span>
					</div>

					<div className='demo-logo-vertical' />
					<Menu
						theme='dark'
						defaultSelectedKeys={["1"]}
						mode='inline'
						onClick={({ key }) => {
							if (key === "logout") {
								handleLogout();
							} else if (key === "admin") {
								navigate("/admin");
							} else {
								navigate(key);
							}
						}}
						items={items}
					/>
				</Sider>

				<Layout>
					<Header
						style={{ padding: 0, background: "#001529 " }}
						className='d-flex justify-content-end ps-1 pe-5'
					>
						<div className='d-flex gap-4 align-items-center'>
							<div className='d-flex gap-1 align-items-center'>
								<div
									className='image_div'
									role='button'
									id='dropdownMenuLink'
									data-bs-toggle='dropdown'
									aria-expanded='false'
								>
									<img
										className='img-thumbnail'
										src='https://stroyka-admin.html.themeforest.scompiler.ru/variants/ltr/images/customers/customer-4-64x64.jpg'
										alt=''
									/>
								</div>
								<div className='pe-4'>
									<h5 className='font-size'>{userName}</h5>
								</div>
								{/* <div
									className='dropdown-menu '
									aria-labelledby='dropdownMenuLink'
								>
									<li>
										<Link
											className='dropdown-item py-3 border-bottom'
											style={{ lineHeight: "20px" }}
											to='#'
										>
											View Profile
										</Link>
									</li>
									<li>
										<Link
											className='dropdown-item py-3'
											style={{ lineHeight: "20px" }}
											to='#'
										>
											Sign Out
										</Link>
									</li>
								</div> */}
							</div>
						</div>
					</Header>

					<Content style={{ margin: "0 16px" }}>
						<div className='dashboard'>
							<ToastContainer
								position='top-right'
								autoClose={2500}
								hideProgressBar={false}
								newestOnTop={true}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								// pauseOnHover
								theme='light'
							/>
							<Outlet />
						</div>
					</Content>

					<Footer style={{ textAlign: "center" }}>
						Admin ©2023 Created by YML
					</Footer>
				</Layout>
			</Layout>
		</>
	);
};

export default MainLayout;
