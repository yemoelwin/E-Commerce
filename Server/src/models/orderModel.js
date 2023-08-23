import { model, Schema } from 'mongoose'; // Erase if already required
import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
var orderSchema = new Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            count: Number,
            color: String,
            price: Number,
        }
    ],
    payment: [],
    orderStatus: {
        type: String,
        default: 'Not Processed',
        enum: [
            "Not Processed",
            "Cash on Delivery",
            "Prepaid",
            "Processing",
            "Dispatched",
            "Cancelled",
            "Delivered",
        ],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
}
);

//Export the model
export default model('Order', orderSchema);