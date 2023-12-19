import React, { useCallback, useEffect, useState } from "react";
import { Table } from "antd";

import { useDispatch, useSelector } from "react-redux";
import {
	getMonthly,
	getYearly,
} from "../../../features/incomeAndOrder/incomeAndOrderSlice";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { allUserOrders } from "../../../features/users/userSlice";

const columns = [
	{
		title: "No",
		dataIndex: "key",
	},
	{
		title: "Date",
		dataIndex: "date",
	},
	{
		title: "Name",
		dataIndex: "name",
	},
	{
		title: "Quantity",
		dataIndex: "totalQuantity",
	},
	{
		title: "Amount",
		dataIndex: "totalAmount",
	},
];

const DashBoard = () => {
	const [yearlyStatistic, setYearlyStatistic] = useState("");

	const [monthlyStatistic, setMonthlyStatistic] = useState("");

	const [viewMode, setViewMode] = useState("monthly");

	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const [isLoading, setIsLoading] = useState(false);

	const [monthlyLoading, setMonthlyLoading] = useState(false);

	const [yearlyLoading, setYearlyLoading] = useState(false);

	const [orders, setOrders] = useState("");

	const dispatch = useDispatch();

	const totalYearlyIncomesAndOrders = useSelector(
		(state) => state?.totalIncomeAndOrder?.yearly?.result,
	);

	const totalMonthlyIncomesAndOrders = useSelector(
		(state) => state?.totalIncomeAndOrder?.monthly?.data,
	);

	const userOrders = useSelector((state) => state.user?.userOrders);

	const currentMonthName = new Date().toLocaleString("default", {
		month: "short",
	});

	const monthAbbreviations = {
		Jan: "January",
		Feb: "February",
		Mar: "March",
		Apr: "April",
		May: "May",
		Jun: "June",
		Jul: "July",
		Aug: "August",
		Sep: "September",
		Oct: "October",
		Nov: "November",
		Dec: "December",
	};

	const currentYear = new Date().getFullYear();

	useEffect(() => {
		setMonthlyLoading(true);
		dispatch(getMonthly(selectedYear))
			.catch((error) => console.log("Monthly data fetch error", error))
			.finally(() => setMonthlyLoading(false));
	}, [dispatch, selectedYear]);

	useEffect(() => {
		setYearlyLoading(true);
		dispatch(getYearly())
			.catch((error) => console.log("Yearly data fetch error", error))
			.finally(() => setYearlyLoading(false));
	}, [dispatch]);

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				await dispatch(allUserOrders());
			} catch (error) {
				console.error("Error fetching all orders:", error);
			} finally {
				setIsLoading(false); // Set loading to false regardless of success or failure
			}
		};
		fetchData();
	}, [dispatch]);

	const mapData = (data, keyName) => {
		return data
			? data?.map((element) => ({
					[keyName]: element[keyName],
					total_Income: element.amount,
					total_Orders: element.totalOrder,
			  }))
			: [];
	};

	useEffect(() => {
		setYearlyStatistic(mapData(totalYearlyIncomesAndOrders, "year"));
	}, [totalYearlyIncomesAndOrders]);

	useEffect(() => {
		setMonthlyStatistic(mapData(totalMonthlyIncomesAndOrders, "month"));
	}, [totalMonthlyIncomesAndOrders]);

	useEffect(() => {
		const formattedDate = (createdAt) => {
			const newDate = new Date(createdAt);
			return newDate.toLocaleString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		};

		let data = userOrders
			? userOrders?.map((element, index) => ({
					key: index,
					date: formattedDate(element.createdAt),
					totalAmount: `$ ${element.subTotalAmount.toFixed(2)}`,
					totalQuantity: element.totalQuantity,
					name: element.customer_details.name,
			  }))
			: [];
		setOrders(data);
	}, [userOrders]);

	const handleSwitch = async (e) => {
		setViewMode(e);
	};

	const changeYear = async (e) => {
		setIsLoading(true);
		try {
			setSelectedYear(e);
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
		}
	};

	const filteredMonthlyStatistic =
		totalMonthlyIncomesAndOrders &&
		totalMonthlyIncomesAndOrders?.filter((data) => {
			return data?.month === currentMonthName && data?.year === currentYear;
		});

	const filteredYearlyStatistic =
		totalYearlyIncomesAndOrders &&
		totalYearlyIncomesAndOrders?.filter((data) => {
			return data?.year === currentYear;
		});

	return (
		<>
			<div>
				<h3 className='mb-4'>DashBoard</h3>
				{/*  */}
				{isLoading ? (
					<div className='loading gap-3'>
						<div className='loading-spinner'></div>
						<div className=''>Loading ... </div>
					</div>
				) : (
					<div className='d-flex gap-20'>
						{filteredMonthlyStatistic &&
							filteredMonthlyStatistic?.map((data, index) => (
								<div className='d-flex flex-grow-1 gap-2' key={index}>
									<div className='bg-white flex-grow-1 p-3 rounded border'>
										<p className='desc'>
											Total income for
											<span> {monthAbbreviations[data?.month]}</span>
										</p>
										<h4 className='mb-0 sub-title'>
											${data?.amount.toFixed(2)}
										</h4>
									</div>

									<div className='bg-white flex-grow-1 p-3 rounded border'>
										<p className='desc'>
											Total Orders for{" "}
											<span> {monthAbbreviations[data?.month]}</span>
										</p>
										<h4 className='mb-0 sub-title'>{data?.totalOrder}</h4>
									</div>
								</div>
							))}

						{filteredYearlyStatistic &&
							filteredYearlyStatistic?.map((data, index) => (
								<div className='d-flex flex-grow-1 gap-2' key={index}>
									<div className='bg-white flex-grow-1 p-3 rounded border'>
										<p className='desc'>
											Total Income for <span> {data?.year}</span>
										</p>
										<h4 className='mb-0 sub-title'>
											${data?.amount.toFixed(2)}
										</h4>
									</div>

									<div className='bg-white flex-grow-1 p-3 rounded border'>
										<p className='desc'>
											Total orders for <span> {data?.year}</span>
										</p>
										<h4 className='mb-0 sub-title'>{data?.totalOrder}</h4>
									</div>
								</div>
							))}
					</div>
				)}

				{/* Graph Data */}
				<div className='mt-5'>
					<h3 className='mb-4 title'>Income Statistics</h3>

					<div>
						<div className='d-flex justify-content-end align-items-center mb-3'>
							<div className='switch-to'>Switch To:</div>
							<select
								name=''
								id=''
								className='switch-to-select-box'
								onChange={(e) => handleSwitch(e.target.value)}
							>
								<option value='monthly'>Monthly</option>
								<option value='yearly'>Yearly</option>
							</select>
							{viewMode && viewMode === "monthly" ? (
								<select
									name=''
									id=''
									className='switch-to-select-box'
									onChange={(e) => changeYear(e.target.value)}
								>
									<option value='2023'>2023</option>
									<option value='2022'>2022</option>
									<option value='2021'>2021</option>
									<option value='2020'>2020</option>
									<option value='2019'>2019</option>
								</select>
							) : (
								""
							)}
						</div>

						<p className='yearly-income-text'>
							{viewMode === "monthly" ? "Monthly" : "Yearly"} Incomes and Orders
						</p>

						<div className='d-flex'>
							{monthlyLoading || yearlyLoading ? (
								<div className='loading gap-3'>
									<div className='loading-spinner'></div>
									<div className=''>Loading ... </div>
								</div>
							) : (
								<>
									{(viewMode === "monthly" &&
										monthlyStatistic &&
										monthlyStatistic.length > 0) ||
									(viewMode === "yearly" &&
										yearlyStatistic &&
										yearlyStatistic.length > 0) ? (
										<>
											<div>
												<p className='yearly-income-text'>Incomes</p>
												<BarChart
													width={500}
													height={300}
													data={
														viewMode === "monthly"
															? monthlyStatistic
															: yearlyStatistic
													}
													margin={{
														top: 5,
														right: 30,
														left: 20,
														bottom: 5,
													}}
												>
													<CartesianGrid strokeDasharray='3 3' />
													<XAxis
														dataKey={viewMode === "monthly" ? "month" : "year"}
													/>
													<YAxis />
													<Tooltip />
													<Legend />
													<Bar dataKey='total_Income' fill='#8884d8' />
												</BarChart>
											</div>

											<div>
												<p className='yearly-income-text'>Orders</p>
												<BarChart
													width={600}
													height={300}
													data={
														viewMode === "monthly"
															? monthlyStatistic
															: yearlyStatistic
													}
													margin={{
														top: 5,
														right: 30,
														left: 20,
														bottom: 5,
													}}
												>
													<CartesianGrid strokeDasharray='3 3' />
													<XAxis
														dataKey={viewMode === "monthly" ? "month" : "year"}
													/>
													<YAxis />
													<Tooltip />
													<Legend />
													<Bar dataKey='total_Orders' fill='#82ca9d' />
												</BarChart>
											</div>
										</>
									) : (
										<div className='no_data_found'>
											<p>No data was found for the year {selectedYear}.</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</div>

				{/* Recent Orders */}
				<div className='mt-5'>
					<h3 className='mb-4 title'>Recent Orders</h3>
					<div>
						{isLoading ? (
							<div className='loading gap-3'>
								<div className='loading-spinner'></div>
								<div className=''>Loading ... </div>
							</div>
						) : (
							<Table columns={columns} dataSource={orders} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default DashBoard;
