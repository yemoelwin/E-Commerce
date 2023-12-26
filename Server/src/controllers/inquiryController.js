import asyncHandler from "express-async-handler";

import { validateMongodbID } from "../utils/validateMongodbID.js";

import inquiryModel from "../models/inquiryModel.js";

import axios from "axios"; // Import axios for making HTTP requests

const createInquiry = asyncHandler(async (req, res) => {
	try {
		const { values, captchaValue } = req.body;

		const { name, email, mobile, comments } = values;

		console.log(
			`name:${name} , email: ${email}, mobile: ${mobile}, comments: ${comments}`,
		);

		console.log("captchaValue", captchaValue);

		const recaptchaSecretKey = "6Lf6VzwpAAAAAPXhqS9Jz7qSfi6oFMiAhD4gpz0u";

		const recaptchaResponse = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaValue}`,
		);

		if (!recaptchaResponse.data.success) {
			console.log("BOT");
			return res.status(400).json({ message: "reCAPTCHA verification failed" });
		}

		//site key - 6LcVUzwpAAAAAO3ppw8z32a7v4PH0i6Gt9g4j9NH

		//secret key - 6LcVUzwpAAAAABQN6TsJsn8VZj-1BtTenzOiRZmP

		console.log("success and you are human");
		const newInquiry = await inquiryModel.create({
			name,
			email,
			mobile,
			comments,
		});
		return res
			.status(201)
			.json({ message: "Inquiry successfully created.", newInquiry });
	} catch (error) {
		console.log("error", error);
		res
			.status(500)
			.json({ message: "Error occurred while creating the Inquiry." });
	}
});

const updateInquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	validateMongodbID(id);
	try {
		const updatedInquiry = await inquiryModel.findByIdAndUpdate(
			id,
			{ status },
			{ new: true },
		);
		updatedInquiry.message = "Successfully updated the category.";
		return res.status(200).json(updatedInquiry);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Occurred while updating the Inquiry." });
	}
});

const getInquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const Inquiry = await inquiryModel.findById(id);
		if (!Inquiry) return res.status(404).json({ message: "Not Found." });
		const getInquiry = await inquiryModel.findByIdAndUpdate(
			{ _id: id },
			{ $inc: { numSearchs: 1 } },
			{ new: true },
		);
		res.status(203).json(getInquiry);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Occurred while retrieving single Inquiry." });
	}
});

const getAllInquiry = asyncHandler(async (req, res) => {
	try {
		const allInquiry = await inquiryModel.find();
		res.status(200).json(allInquiry);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Occurred while retrieving all the inquiries." });
	}
});

const deleteInquiry = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const deletedInquiry = await inquiryModel.findByIdAndDelete(id);
		if (!deletedInquiry) return res.status(404).json({ message: "Not found." });
		return res
			.status(200)
			.json({ message: "successfully deleted Inquiry", deletedInquiry });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Occurred while deleting the category." });
	}
});

export const Inquiry = {
	createInquiry,
	updateInquiry,
	getInquiry,
	getAllInquiry,
	deleteInquiry,
};
