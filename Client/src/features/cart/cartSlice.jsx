import { createSlice } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    items: [],
    totalQuantity: 0,
    cartTotalAmount: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.productId === productId);
            if (itemIndex >= 0) {
                state.items[itemIndex].quantity += 1
            } else {
                const tempProduct = { ...action.payload, quantity: 1 }
                state.items.push(tempProduct);
                toast.success(`${tempProduct.title} is added to cart`);
            }
        },
        removeCart: (state, action) => {
            const { productId } = action.payload;
            const nextCartItems = state.items.filter((item) => item.productId !== productId);
            state.items = nextCartItems;
            toast.info(`${action.payload.title} is removed from cart`)
        },
        decreaseQuantity: (state, action) => {
            const { productId } = action.payload;
            const quantityDecrease = state.items.find((item) => item.productId === productId);
            if (quantityDecrease.quantity > 1) {
                quantityDecrease.quantity -= 1;
            } else if (quantityDecrease.quantity === 1) {
                const nextCartItems = state.items.filter((item) => item.productId !== productId);
                state.items = nextCartItems;
            }
        },
        clearCart: (state) => {
            state.items = [];
            toast.info(`All items are removed from cart`);
        },
        getTotals(state) {
            let { total, quantity } = state.items.reduce((cartTotal, item) => {
                const { price, quantity } = item;
                const totalPrice = price * quantity;
                cartTotal.total += totalPrice;
                cartTotal.quantity += quantity;
                return cartTotal;
            }, {
                total: 0,
                quantity: 0
            })
            state.cartTotalAmount = total;
            state.totalQuantity = quantity;
        }
        
    },
    extraReducers: (builder) => {}
});

export const { addToCart, removeCart, decreaseQuantity, clearCart, getTotals } = cartSlice.actions;

export default cartSlice.reducer;


/* 
    addItemToCart: (state, action) => {
            const productId = action.payload.productId;
            const existingItem = state.items.find(product => product.productId === productId);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            // state.totalQuantity[productId] = (state.totalQuantity[productId] || 0) + action.payload.quantity;
            toast.success(`${action.payload.title} is added to cart`);
        },
        removeCart: (state, action) => {
            const nextItem = state.items.filter(product => product.productId !== action.payload.productId);
            state.items = nextItem;
            toast.info(`${action.payload.title} is removed from cart`)
        },
        decreaseQuantity: (state, action) => {
            const indexItem = state.items.findIndex(product => product.productId === action.payload.productId);
            if (state.items[indexItem].quantity > 1) {
                state.items[indexItem].quantity -= 1
            } else if (state.items[indexItem].quantity === 1) {
                const nextItem = state.items.filter(product => product.productId !== action.payload.productId);
                state.items = nextItem;
                toast.info(`${action.payload.title} is removed from cart`)
            }
        },
        increaseQuantity: (state, action) => {
            const productId = action.payload.productId;
            const indexItem = state.items.findIndex(product => product.productId === productId);
            if (indexItem >= 0) {
                indexItem.quantity += 1;
                // Update totalQuantity by productId
                state.totalQuantity[productId] = (state.totalQuantity[productId] || 0) + 1;
            } else {
                toast.error('Product not found in the cart');
            }       
        },
 */

// updateQuantity: (state, action) => {
        //     const { productId, quantity } = action.payload;
//     state.quantities[productId] = quantity;
        
// export const getCart = createAsyncThunk('cart/get-Cart', async (thunkApi) => {
//     // Return the cart items from local state
//     return thunkApi.getState().cart.items;
// });
        // }