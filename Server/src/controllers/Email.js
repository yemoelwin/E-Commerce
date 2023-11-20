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

export const sendVerificationEmail = async ({ _id, email }) => {
	// const currentURL = 'http://localhost:8080/api/';
	// const uniqueString = uuidv4() + _id;
	try {
		// const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
		const token = jwt.sign({ _id }, `${process.env.JWT_SECRET}`, {
			expiresIn: "1h",
		});
		console.log("token", token);
		const verificationLink = `http://localhost:8080/api/user/verify_email/${token}/${_id}`;
		const newVerification = new UserVerification({
			userId: _id,
			token: token,
			createdAt: Date.now(),
			expiredAt: Date.now() + 24 * 60 * 60 * 1000,
			// expiredAt: Date.now() + 21600000
		});
		console.log("newVerification", newVerification);
		await newVerification.save();
		const mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Verify Your Email",
			text: `Click the following link to verify your email: ${verificationLink}`,
			// html:
			//     `<p>Verify your email address to complete signup and login your account.</p><br/>
			// <p>This link <b>expires in 6 hours</b>.</p>
			// <p><a href=${currentURL + 'user/verify/' + _id + "/" + encodeURIComponent(accessToken) }>Click here</a>
			// to proceed.</p>`
		};
		await transporter.sendMail(mailOptions);
		// console.log('Email sent successfully.');
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
	console.log("recevied data to send mail", pdfBuffer);
	console.log("email", email);
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
			`, // Set the HTML content here
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
