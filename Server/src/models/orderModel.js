import { model, Schema } from 'mongoose'; // Erase if already required
import mongoose from 'mongoose';

var orderSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }, 
        shippingInfo: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            other: {
                type: String,
                required: true,
            },
            pincode: {
                type: String,
                required: true,
            }
        },
        paymentInfo: {
            orderId: {
                type: String,
                required: true,
            },
            paymentId: {
                type: String,
                required: true,
            }
        },
        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                color: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: String,
                    required: true,
                },
                price: {
                    type: String,
                    required: true,
                }
            }
        ],
        paidAt: {
            type: Date,
            default: Date.now()
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        discountedPrice: {
            type: Number,
            required: true,
        },
        orderStatus: {
            type: Number,
            default: "Ordered"
        }
    },
    {
        timestamps: true,
    }
    
);


export default model('Order', orderSchema);