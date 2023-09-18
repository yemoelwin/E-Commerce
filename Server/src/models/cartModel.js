import { Schema, model } from "mongoose"; // Erase if already required
import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var cartSchema = new Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
            // color: String,
            price: Number,
        },
    ],
    cartTotalPrice: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        timestamps: true,
    }
);

//Export the model
export default model("Cart", cartSchema);