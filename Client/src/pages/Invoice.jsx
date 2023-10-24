import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// Define your custom styles here
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        padding: 20,
    },
    section: {
        margin: 6,
        padding: 8,
        border: 1,
        borderColor: '#cccccc',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333', // Example color
    },
    shopsphere: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    text: {
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
    },
    product: {
        marginLeft: 0,
        fontSize: 11,
        border: 1,
        borderColor: '#cccccc',
        padding: 10,
        pageBreakBefore: 'auto',
    },
    footer: {
        textAlign: 'center',
        fontSize: 10,
        color: '#777',
    }

});

const Invoice = ({ orderData }) => {
    const products = orderData?.products;

    return (
        <PDFDownloadLink
        document={
            <Document>
            <Page size="A4" style={styles.page} wrap>
                <Text style={styles.shopsphere}>ShopSphere</Text>

                <View style={styles.section}>
                    <Text style={styles.header}>Order Invoice</Text>
                    <Text style={styles.text}>
                        Purchase Date: {new Date(orderData.paidAt).toLocaleString()}
                    </Text>
                    <Text style={styles.text}>Order ID: {orderData._id}</Text>
                    <Text style={styles.text}>Customer ID: {orderData.customerId}</Text>
                    <Text style={styles.text}>Customer Name: {orderData.customer_details.name}</Text>
                    <Text style={styles.text}>Email: {orderData.customer_details.email}</Text>
                    <Text style={styles.text}>Mobile: {orderData.customer_details.phone}</Text>
                    <Text break style={styles.text}>Shipping Address:</Text>
                    <View style={styles.product}>
                        <Text style={styles.text}>Street: {orderData.shipping_details.address.line1},{orderData.shipping_details.address.line2}</Text>
                        <Text style={styles.text}>City: {orderData.shipping_details.address.city}</Text>
                        <Text style={styles.text}>State: {orderData.shipping_details.address.state}</Text>
                        <Text style={styles.text}>Country: {orderData.shipping_details.address.country}</Text>
                    </View>
                </View>

                <View style={styles.section} break>
                    <Text style={styles.header}>Product Lists</Text>
                        {products.map((product, index) => (
                            <View key={index} style={styles.product}>
                                <Text style={styles.text}>Product Title: {product.title}</Text>
                                <Text style={styles.text}>Brand: {product.brand}</Text>
                                <Text style={styles.text}>Color: {product.color}</Text>
                                <Text style={styles.text}>Price: $ {product.price}</Text>
                                <Text style={styles.text}>Quantity: {product.quantity}</Text>
                                <Text style={styles.text}>Total: $ {(product.price * product.quantity).toFixed(2)}</Text>
                            </View>
                        ))}
                    <Text style={styles.text}>Total Quantity: {orderData.totalQuantity}</Text>
                    <Text style={styles.text}>SubTotal Amount: $ {(orderData.subTotalAmount).toFixed(2)}</Text>
                </View>
                <Text style={styles.footer}>Thank you for your purchase!</Text>  
            </Page>
            </Document>
        }
        fileName="invoice.pdf"
        >
        {({ blob, url, loading, error }) => (
            <button
            className="btn btn-sm btn-white m-b-10 p-l-5 me-2"
            disabled={loading || error}
            >
            <i className="fa fa-file t-plus-1 text-danger fa-fw fa-lg"></i>
            Export as PDF
            </button>
        )}
        </PDFDownloadLink>
    );
};

export default Invoice;



