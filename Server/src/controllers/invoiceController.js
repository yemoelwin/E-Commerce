import PDFDocument from 'pdfkit';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import orderModel from '../models/orderModel.js';

export const pdfDocument = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    console.log("orderId from frontend", orderId);
    try {
        const order = await orderModel.findOne({ _id: orderId });
        console.log('orderlistdetail', order);
        if (!order) {
            return res.status(404).json({ message: 'Not Found' });
        }
        const doc = new PDFDocument();
        const pdfStream = fs.createWriteStream(`invoice_${orderId}.pdf`);
        doc.pipe(pdfStream);
        doc.fontSize(14)
        doc.text(`Purchase Date: ${order.paidAt.toDateString()}`, { align: 'right' });
        doc.moveDown();
        doc.text(`Invoice for Order: ${order._id}`, { align: 'Center' });
        doc.text(`CustomerId: ${order.customerId}`, { align: 'left' });
        doc.text(`Email: ${order.customer_details.email}`, { align: 'left' });
        doc.text(`Name: ${order.customer_details.name}`, { align: 'left' });
        doc.text(`Mobile: ${order.customer_details.phone}`, { align: 'left' });
        doc.moveDown()

        order.products.forEach((item) => {
            doc.text(`Name: ${item.title}`, { align: 'left' });
            doc.text(`Brand: ${item.brand}`, { align: 'left' });
            doc.text(`Unit Price: ${item.price.toFixed(2)}`, { align: 'left' });
            doc.text(`Quantity: ${item.quantity}`, { align: 'left' });
            doc.text(`Color: ${item.color}`, { align: 'left' });
            doc.moveDown();
        });

        doc.text(`TotalQuantity: ${order.totalQuantity}`, { align: 'left' });
        doc.text(`SubTotal: ${order.subTotalAmount.toFixed(2)}`, { align: 'left' });
        doc.text(`Shipping Amount: $${order.shipping_amount ? order.shipping_amount.toFixed(2) : 'N/A'}`);
        doc.text(`Total Amount: $${(order.subTotalAmount + (order.shipping_amount || 0)).toFixed(2)}`);
        // doc.text(`Tax (5.4%): $ + ${(order.subTotalAmount * 0.054).toFixed(2)}`, { align: 'left' });
        // doc.text(`TotalAmount: ${order.subTotalAmount.toFixed(2)}`, { align: 'left' });
        doc.text(
            `Shipping Address: ${order.shipping_details.address.line1} / ${order.shipping_details.address.line2} / ${order.shipping_details.address.city} / ${order.shipping_details.address.country} `,
            { align: 'left' }
        );
        doc.moveDown();
        doc.text('Thank you for your purchase!', {align: 'center'});
        doc.end();
        pdfStream.on('finish', () => {
            res.download(`invoice_${orderId}.pdf`, `invoice_${orderId}.pdf`, (err) => {
                if (err) {
                    res.status(500).send('Error downloading the invoice PDF.');
                }
            });
        }) 
    } catch (error) {
        console.error('Error generating PDF: ', error);
        res.status(500).send('Error generating the PDF invoice.');
    }
})