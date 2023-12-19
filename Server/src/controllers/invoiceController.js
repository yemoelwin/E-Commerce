import PDFDocument from "pdfkit";
import asyncHandler from "express-async-handler";
import fs from "fs";
import orderModel from "../models/orderModel.js";

export const createInvoice = async () => {
	let doc = new PDFDocument({ size: "A4", margin: 50 });

	doc.pipe(
		fs.createWriteStream(
			`invoice (${invoiceData.customer_details.address.name}).pdf`,
		),
	);

	generateHeader(doc);
	generateCustomerInformation(doc, invoiceData);
	generateInvoiceTable(doc, invoiceData);
	generateFooter(doc);

	doc.end();
};

function generateHeader(doc) {
	doc
		// .image("logo", 50, 45, { width: 50 })
		.fillColor("#444444")
		.fontSize(20)
		.text("ShopSphere", 110, 57)
		.fontSize(10)
		.text("ShopSphere", 200, 50, { align: "right" })
		.text("123 Main Street", 200, 65, { align: "right" })
		.text("Yangon, Kamayut, 10025", 200, 80, { align: "right" })
		.moveDown();
}

function generateFooter(doc) {
	doc
		.fontSize(10)
		.text(
			"Your items will be delivered within 10 days. Thank you for your purchasing.",
			50,
			780,
			{ align: "center", width: 500 },
		);
}

function generateCustomerInformation(doc, invoiceData) {
	const invoice = invoiceData;
	console.log("customerInformation from invoice", invoice);
	doc
		.text(`Invoice Number: 232323`, 50, 200)
		.text(`Invoice Date: ${formatDate(new Date())}`, 50, 215)
		.text(`Balance Due: 12345`, 50, 130)
		.text(`Balance Due: ${invoice.subTotalAmount - invoice.createdAt}`, 50, 130)

		.text(invoice?.shipping_details?.address?.name, 300, 200)
		.text(
			`${invoice?.shipping_details?.address?.line1}, ${invoice?.shipping_details?.address?.line2}`,
			300,
			215,
		)
		.text(
			`
                ${invoice?.shipping_details?.address?.city}, 
                ${invoice?.shipping_details?.address?.state}, 
                ${invoice?.shipping_details?.address?.country}
            `,
			300,
			130,
		)
		.moveDown();
}

function generateTableRow(
	doc,
	y,
	title,
	description,
	unitCost,
	quantity,
	lineTotal,
) {
	doc
		.fontSize(10)
		.text(title, 50, y)
		.text(description, 150, y)
		.text(unitCost, 280, y, { width: 90, align: "right" })
		.text(quantity, 370, y, { width: 90, align: "right" })
		.text(lineTotal, 0, y, { align: "right" });
}

function generateInvoiceTable(doc, invoiceData) {
	let i,
		invoiceTableTop = 330;
	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		invoiceTableTop,
		"Title",
		"Description",
		"Unit Cost",
		"Quantity",
		"Line Total",
	);
	generateHr(doc, invoiceTableTop + 20);
	doc.font("Helvetica");

	for (i = 0; i < invoiceData?.products?.length; i++) {
		const item = invoiceData?.products[i];
		const position = invoiceTableTop + (i + 1) * 30;
		generateTableRow(
			doc,
			position,
			item.title,
			item.color,
			item.brand,
			item.price / item.quantity,
			item.quantity,
			item.price,
		);
		generateHr(doc, invoiceTableTop + 20);
	}

	const subtotalPosition = invoiceTableTop + (i + 1) * 30;
	generateTableRow(
		doc,
		subtotalPosition,
		"",
		"",
		"Subtotal",
		"",
		formatCurrency(invoiceData?.subTotalAmount),
	);

	const paidToDatePosition = subtotalPosition + 20;
	generateTableRow(
		doc,
		paidToDatePosition,
		"",
		"",
		"Paid To Date",
		"",
		formatCurrency(invoiceData?.createdAt),
	);

	const duePosition = paidToDatePosition + 25;
	doc.font("Helvetica-Bold");
	generateTableRow(
		doc,
		duePosition,
		"",
		"",
		"Balance Due",
		"",
		formatCurrency(invoiceData?.subTotalAmount - invoiceData?.createdAt),
	);
	doc.font("Helvetica");
}

function generateHr(doc, y) {
	doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatCurrency(cents) {
	return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return year + "/" + month + "/" + day;
}

/* testing pdfkit function */
export const pdfDocument = asyncHandler(async (req, res) => {
	const { orderId } = req.params;
	console.log("orderId from frontend", orderId);
	try {
		const order = await orderModel.findOne({ _id: orderId });
		console.log("orderlistdetail", order);
		if (!order) {
			return res.status(404).json({ message: "Not Found" });
		}
		const doc = new PDFDocument();
		const pdfStream = fs.createWriteStream(`invoice_${orderId}.pdf`);
		doc.pipe(pdfStream);
		doc.fontSize(14);
		doc.text(`Purchase Date: ${order.createdAt.toDateString()}`, {
			align: "right",
		});
		doc.moveDown();
		doc.text(`Invoice for Order: ${order._id}`, { align: "Center" });
		doc.text(`CustomerId: ${order.customerId}`, { align: "left" });
		doc.text(`Email: ${order.customer_details.email}`, { align: "left" });
		doc.text(`Name: ${order.customer_details.name}`, { align: "left" });
		doc.text(`Mobile: ${order.customer_details.phone}`, { align: "left" });
		doc.moveDown();

		order.products.forEach((item) => {
			doc.text(`Name: ${item.title}`, { align: "left" });
			doc.text(`Brand: ${item.brand}`, { align: "left" });
			doc.text(`Unit Price: ${item.price.toFixed(2)}`, { align: "left" });
			doc.text(`Quantity: ${item.quantity}`, { align: "left" });
			doc.text(`Color: ${item.color}`, { align: "left" });
			doc.moveDown();
		});

		doc.text(`TotalQuantity: ${order.totalQuantity}`, { align: "left" });
		doc.text(`SubTotal: ${order.subTotalAmount.toFixed(2)}`, { align: "left" });
		doc.text(
			`Shipping Amount: $${
				order.shipping_amount ? order.shipping_amount.toFixed(2) : "N/A"
			}`,
		);
		doc.text(
			`Total Amount: $${(
				order.subTotalAmount + (order.shipping_amount || 0)
			).toFixed(2)}`,
		);
		// doc.text(`Tax (5.4%): $ + ${(order.subTotalAmount * 0.054).toFixed(2)}`, { align: 'left' });
		// doc.text(`TotalAmount: ${order.subTotalAmount.toFixed(2)}`, { align: 'left' });
		doc.text(
			`Shipping Address: ${order.shipping_details.address.line1} / ${order.shipping_details.address.line2} / ${order.shipping_details.address.city} / ${order.shipping_details.address.country} `,
			{ align: "left" },
		);
		doc.moveDown();
		doc.text("Thank you for your purchase!", { align: "center" });
		doc.end();
		pdfStream.on("finish", () => {
			res.download(
				`invoice_${orderId}.pdf`,
				`invoice_${orderId}.pdf`,
				(err) => {
					if (err) {
						res.status(500).send("Error downloading the invoice PDF.");
					}
				},
			);
		});
	} catch (error) {
		console.error("Error generating PDF: ", error);
		res.status(500).send("Error generating the PDF invoice.");
	}
});
