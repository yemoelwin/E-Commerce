import nodeMailer from "nodemailer";
import UserVerification from "../models/userVerification.js";
import userPasswordVerification from "../models/passwordVerification.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import path from "path";
import fs from "fs";
config();

let transporter = nodeMailer.createTransport({
	service: "gmail",
	auth: {
		// TODO: replace `user` and `pass` values from <https://forwardemail.net>
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASSWORD,
	},
	debug: true, // Enable debugging
});

transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("Ready for messages");
		console.log(success);
	}
});

const generateResetToken = () => {
	const uniqueToken = crypto.randomBytes(20).toString("hex");
	return uniqueToken;
};

const generateVerificationCode = () => {
	// Generate a random 6-digit code
	return Math.floor(100000 + Math.random() * 900000);
};

export const sendVerificationEmail = async ({ _id, email }) => {
	console.log("email", email);
	try {
		const verificationCode = generateVerificationCode();
		// const verificationLink = `http://localhost:8080/api/user/verify_email/${token}/${_id}`;
		const newVerification = new UserVerification({
			userId: _id,
			digit_code: verificationCode,
		});
		await newVerification.save();
		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Dear Customer, Please Verify Your Email",
			html: `
				<p>Dear Customer,</p>
				<p>Thank you for your registration with ShopSphere, Inc. Here is a mail sent to you to confirm your registration.</p><br/>
				<p>This link will expire in <b>1 hour.</b></p>
				<p>Verification Code: <b>${verificationCode}</b></p>
				<p><a href=${
					"http://localhost:3000/verify/email/" + _id
				}>Click here to verify your email and proceed to login.</p><br/>
				<p>If you have any questions or concerns, please feel free to contact us. We appreciate your business!</p>
				<p>Best regards,</p>
				<p>The ShopSphere Team</p>
			`,
		};
		await transporter.sendMail(mailOptions);
		return {
			status: "SUCCESS",
			message: "Verification email sent successfully",
		};
	} catch (error) {
		console.error("Error sending verification email:", error);
		return {
			status: "FAILED",
			message: "An error occurred while sending the verification email.",
		};
	}
};

export const ResetPasswordToken = async ({ _id, email }) => {
	try {
		const resetURL = "http://localhost:3000/";
		const resetPasswordToken = generateResetToken();
		const expiryDurationInMilliseconds = 1 * 60 * 60 * 1000;
		const newUserPassVerification = new userPasswordVerification({
			userId: _id,
			email,
			uniqueToken: resetPasswordToken,
			changedAt: Date.now(),
			uniqueTokenExpiredAt: Date.now() + expiryDurationInMilliseconds,
		});
		await newUserPassVerification.save();
		const EmailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Link To Reset Your Email Password" + +new Date(),
			html: `<p>An email have been sent to reset your password.</p><br/>
                <p>This link will expires in <b>1 hour.</b></p>
                <p><a href=${
									resetURL + "reset-password/" + _id + "/" + resetPasswordToken
								}>Click here</a>
            to proceed.</p>`,
		};
		await transporter.sendMail(EmailOptions);
		return {
			status: "PENDING",
			message:
				"An email has been sent to your account to reset your password.Pls check your email and change your password.",
		};
	} catch (error) {
		console.error("Error sending verification email:", error);
		return {
			status: "FAILED",
			message:
				"An error occurred while sending the attached reset token email.",
		};
	}
};

export const sendInvoiceEmail = async (pdfBuffer, email, html) => {
	try {
		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Your Invoice and Order Details",
			html: `
				<p>Dear Customer,</p>
				<p>Thank you for your recent purchase with ShopSphere, Inc. Attached is summary of your invoice and order details.</p>
				<div style="display: flex; justify-content: center;">
					<table width="100%" cellspacing="0" cellpadding="0">
						<tr>
							<td align="center">
								${html}
							</td>
						</tr>
					</table>
				</div>
				<p>If you have any questions or concerns, please feel free to contact us. We appreciate your business!</p>
				<p>Best regards,</p>
				<p>The ShopSphere Team</p>
			`,
			text: "Thank you for your purchase! Invoice details attached as PDF.",
			attachments: [
				{
					filename: "invoicePDF.pdf",
					content: pdfBuffer,
					encoding: "base64",
				},
			],
		};
		await transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error("Error sending email:", error);
			} else {
				console.log("email sent", info.response);
			}
		});
		return {
			status: "SUCCESS",
			message: "Invoice email sent successfully",
		};
	} catch (error) {
		console.error("Error sending Invoice email:", error);
		return {
			status: "FAILED",
			message: "An error occurred while sending the Invoice email.",
		};
	}
};
