import { Schema, model } from "mongoose"; // Erase if already required
import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        product: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                title: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                brand: {
                    type: String,
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                totalPrice: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalQuantity: {
            type: Number,
            required: true,
        },
        cartTotalAmount: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
        }
    },
    {
        timestamps: true,
    }
    
);

export default model("Cart", cartSchema);

// {
    // products: [
    //     {
    //         product: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "Product",
    //         },
    //         count: Number,
    //         // color: String,
    //         price: Number,
    //     },
    // ],
    // cartTotalPrice: Number,
    // totalAfterDiscount: Number,
    // orderby: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // },
    // {
    //     timestamps: true,
    // }