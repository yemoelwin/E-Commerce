import ejs from "ejs";
import puppeteer from "puppeteer";
import path from "path";
import { sendInvoiceEmail } from "./Email.js";
import { __dirname } from "../utils/path.js";
import orderModel from "../models/orderModel.js";

async function invoiceTemplate(transitionId, email, currency) {
	const details = await orderModel.findOne({
		transitionId: transitionId,
		stripe_response: true,
	});

	if (!details) {
		return res.status(404).json({ message: "No order details found!" });
	}
	const orderData = {
		pageTitle: "Invoice",
		email: email,
		orderId: details._id,
		transitionId: details._id,
		shipping_address: details.shipping_details,
		totalQuantity: details.totalQuantity,
		currency: currency,
		customer_info: details.customer_details,
		items: details.products,
		totalAmount: details.subTotalAmount,
		purchase_Date: details.createdAt,
	};

	console.log("orderData ######", orderData);
	const templatePath = path.join(__dirname, "../views/invoicePDF.ejs");
	ejs.renderFile(templatePath, { order: orderData }, async (err, html) => {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Internal Server Error" });
		}

		try {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.setContent(html);

			const pdfBuffer = await page.pdf();

			await browser.close();

			await sendInvoiceEmail(pdfBuffer, email, html);
		} catch (error) {
			console.error("Error generating PDF:", error);
		}
	});
}

export default invoiceTemplate;
