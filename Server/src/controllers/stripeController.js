import { Stripe } from "stripe";
import { config } from "dotenv";
import orderModel from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import invoiceTemplate from "./templatePDF.js";
config();
// 09264779748
const stripe = Stripe(process.env.STRIPE_APIKEYS);

export const stripeSession = async (req, res) => {
	const { cartItemData, userId, transitionId } = req.body;
	const { cartData } = cartItemData;
	console.log("usrId", userId, "transitionId", transitionId);
	try {
		const customer = await stripe.customers.create({
			metadata: {
				userId: userId,
			},
		});

		const line_items = cartData.map((item) => {
			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: item.title,
						images: [item.image],
						metadata: {
							id: item.productId,
							brand: item.brand,
						},
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			};
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			shipping_address_collection: {
				allowed_countries: ["US", "CA", "JP", "CH", "GB"],
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 0,
							currency: "usd",
						},
						display_name: "Free shipping",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 5,
							},
							maximum: {
								unit: "business_day",
								value: 7,
							},
						},
					},
				},
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 1500,
							currency: "usd",
						},
						display_name: "Next day air",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 1,
							},
							maximum: {
								unit: "business_day",
								value: 1,
							},
						},
					},
				},
			],
			phone_number_collection: {
				enabled: true,
			},
			customer: customer.id,
			client_reference_id: transitionId,
			line_items,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/checkout-success/${userId}/${transitionId}`,
			cancel_url: `${process.env.CLIENT_URL}/canceled`,
		});
		res.send({ url: session.url });
	} catch (error) {
		console.error("Error:", error);
		res.status(400).send(`Error: ${error.message}`);
	}
};

export const webHook = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	let endpointSecret;
	let eventType;
	let data;

	if (endpointSecret) {
		let event;
		try {
			event = stripe.webhooks.constructEvent(
				req["rawBody"],
				sig,
				endpointSecret,
			);
			data = event.data.object;
			eventType = event.type;
			console.log("Webhook verified:", eventType);
		} catch (err) {
			console.log(err);
			res.status(400).send(`Webhook Error: ${err.message}`);
			return;
		}
	} else {
		console.log("No endpoint secret found in the environment variables");
		data = req.body.data.object;
		eventType = req.body.type;
	}

	console.log("Event Data:", data);

	if (eventType === "checkout.session.completed") {
		try {
			// const customer = await stripe.customers.retrieve(data.customer);
			const transitionId = data?.client_reference_id;
			const email = data?.customer_details?.email;
			const currency = data?.currency;

			const order = await orderModel.find({
				transitionId: transitionId,
				stripe_response: false,
			});

			if (!order) {
				return res.status(404).json({ message: "No order found!" });
			}
			await orderModel.updateOne(
				{ transitionId: transitionId },
				{
					$set: {
						stripe_response: true,
						stripe_payment_id: data.id,
						shipping_amount: data.shipping_amount,
						payment_intent: data.payment_intent,
						customer_details: data.customer_details,
						shipping_details: data.shipping_details,
						shipping_amount: data.shipping_options.shipping_amount,
						payment_status: data.payment_status,
						createdAt: Date.now(),
					},
				},
			);

			if (order && order.length > 0 && order[0].products) {
				const productsArray = order[0].products;

				for (const productObj of productsArray) {
					if (productObj && productObj.productId) {
						const productId = productObj.productId;

						console.log("ProductId:", productId);

						const prod = await ProductModel.find({ _id: productId });

						console.log("matched product", prod);

						if (prod && prod.length > 0) {
							console.log("matched product quantity", prod[0].quantity);

							prod[0].quantity = Math.max(
								0,
								prod[0].quantity - productObj.quantity,
							);

							await prod[0].save();
						} else {
							return res.status(404).json({ message: "Not Found!" });
						}
					} else {
						return "Not Found";
					}
				}
			}

			await invoiceTemplate(transitionId, email, currency);
		} catch (error) {
			console.error(error);
		}
	}
	res.send();
};
