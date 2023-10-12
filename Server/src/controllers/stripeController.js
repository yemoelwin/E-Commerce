import { stripe } from '../server.js';
import { config } from 'dotenv';
config();

export const stripeSession = async (req, res) => {
    console.log(req.body)
    const { cartItems, userId } = req.body;
    console.log(cartItems, userId)
    const line_items = cartItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image],
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }
    })
    
    console.log(line_items)
    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({url: session.url});
}




