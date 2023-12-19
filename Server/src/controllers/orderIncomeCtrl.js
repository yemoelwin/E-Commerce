import asyncHandler from "express-async-handler";
import orderModel from "../models/orderModel.js";

const getMonthlyOrderAndIncome = asyncHandler(async (req, res) => {
	const { selectedYear } = req.params;

	const currentYear = new Date().getFullYear();
	const year = parseInt(selectedYear || currentYear, 10);
	if (isNaN(year)) {
		return res.status(400).json({ message: "Invalid year." });
	}

	let monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	let result = [];

	for (let index = 0; index < monthNames.length; index++) {
		const startOfMonth = new Date(year, index, 1);
		const endOfMonth = new Date(year, index + 1, 0, 23, 59, 59, 999);

		const defaultData = {
			amount: 0,
			totalOrder: 0,
			month: monthNames[index],
			year: year,
		};

		const data = await orderModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startOfMonth,
						$lte: endOfMonth,
					},
					stripe_response: true,
				},
			},
			{
				$group: {
					_id: null,
					amount: {
						$sum: "$subTotalAmount",
					},
					totalOrder: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: 0,
					amount: {
						$cond: {
							if: { $eq: ["$amount", null] }, // Check if $amount is null
							then: 0, // If null, replace with 0
							else: "$amount", // If not null, keep the original value
						},
					},
					totalOrder: {
						$cond: {
							if: { $eq: ["$totalOrder", null] }, // Check if $totalOrder is null
							then: 0, // If null, replace with 0
							else: "$totalOrder", // If not null, keep the original value
						},
					},
					month: monthNames[index],
				},
			},
		]);

		result.push(data.length > 0 ? { ...data[0], year: year } : defaultData);
	}

	if (result.length === 0) {
		return res.json("Data is empty.");
	}

	result = result.sort((a, b) => {
		if (a.year !== b.year) {
			return a.year - b.year;
		}
		return a.numericMonth - b.numericMonth;
	});

	res.status(200).json({ message: "Success", data: result });
});

const getYearlyOrderAndIncome = asyncHandler(async (req, res) => {
	const currentYear = new Date().getFullYear();
	const numberOfYears = 10; // Adjust this value as needed

	const result = [];

	for (let i = 0; i < numberOfYears; i++) {
		const startOfYear = new Date(currentYear - i, 0, 1);
		const endOfYear = new Date(currentYear - i, 11, 31, 23, 59, 59, 999);
		const data = await orderModel.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startOfYear,
						$lte: endOfYear,
					},
					stripe_response: true,
				},
			},
			{
				$group: {
					_id: null, // Group all documents together
					amount: {
						$sum: "$subTotalAmount",
					},
					totalOrder: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: 0,
					year: { $literal: currentYear - i }, // Calculate the year for the response
					amount: 1,
					totalOrder: 1,
				},
			},
		]);

		result.push(
			data.length > 0
				? { ...data[0] }
				: { amount: 0, totalOrder: 0, year: currentYear - i },
		);
	}

	if (result.length === 0) {
		return res.json("Data is empty.");
	}

	res.status(200).json({ message: "Success", result });
});

export const orderIncomeController = {
	getMonthlyOrderAndIncome,
	getYearlyOrderAndIncome,
};
