import { model, Schema } from "mongoose"; // Erase if already required

const orderSchema = new Schema(
	{
		transitionId: {
			type: String,
			required: true,
		},
		customerId: {
			type: String,
			required: true,
		},
		// customer_details: {
		//     name: {
		//         type: String,
		//     },
		//     email: {
		//         type: String,
		//     },
		//     mobile: {
		//         type: Number,
		//     },
		// },
		products: [],
		totalQuantity: {
			type: Number,
			required: true,
		},
		subTotalAmount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			defautl: "usd",
		},
		payment_intent: {
			type: String,
		},
		customer_details: {
			type: Object,
			default: {},
		},
		shipping_details: {
			type: Object,
			default: {},
		},
		shipping_amount: {
			type: Number,
		},
		delivery_status: {
			type: String,
			default: "Pending",
		},
		stripe_response: {
			type: Boolean,
			default: false,
		},
		payment_status: {
			type: String,
		},
		createdAt: {
			type: Date,
		},
		paidAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

export default model("Order", orderSchema);

// var orderSchema = new Schema(
//     {
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true,
//         },
//         shippingInfo: {
//             firstName: {
//                 type: String,
//                 required: true,
//             },
//             lastName: {
//                 type: String,
//                 required: true,
//             },
//             address: {
//                 type: String,
//                 required: true,
//             },
//             city: {
//                 type: String,
//                 required: true,
//             },
//             state: {
//                 type: String,
//                 required: true,
//             },
//             other: {
//                 type: String,
//                 required: true,
//             },
//             pincode: {
//                 type: String,
//                 required: true,
//             }
//         },
//         paymentInfo: {
//             orderId: {
//                 type: String,
//                 required: true,
//             },
//             paymentId: {
//                 type: String,
//                 required: true,
//             }
//         },
//         orderItems: [
//             {
//                 product: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: 'Product',
//                     required: true,
//                 },
//                 color: {
//                     type: String,
//                     required: true,
//                 },
//                 quantity: {
//                     type: String,
//                     required: true,
//                 },
//                 price: {
//                     type: String,
//                     required: true,
//                 }
//             }
//         ],
//         paidAt: {
//             type: Date,
//             default: Date.now()
//         },
//         totalPrice: {
//             type: Number,
//             required: true,
//         },
//         discountedPrice: {
//             type: Number,
//             required: true,
//         },
//         orderStatus: {
//             type: Number,
//             default: "Ordered"
//         }
//     },
//     {
//         timestamps: true,
//     }

// );
