import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'; 
import authReducer from '../features/auth/AuthSlice';
import customerReducer from '../features/customer/CustomerSlice';
import productReducer from '../features/products/productSlice';
import brandReducer from '../features/brand/brandSlice';
import categoryReducer from '../features/category/categorySlice';
import colorReducer from '../features/color/colorSlice';
import blogReducer from '../features/blog/blogSlice';
import blogCategoryReducer from '../features/blogCategory/blogCategorySlice';
import inquiryReducer from '../features/inquiry/inquirySlice';
import uploadImgReducer from '../features/upload/uploadSlice';
import blogImgUploadReducer from '../features/upload/blogUploadSlice';
import couponReducer from '../features/coupon/couponSlice';
import userReducer from '../features/users/userSlice';
import cartReducer from '../features/cart/cartSlice';
// import tokenMiddleware from '../middleware/tokenMiddleware';

const persistConfig = {
    key: 'root', // Change this key as needed
    // version: 1,
    storage, // Use the storage option you imported
    whitelist: ['auth', 'cart', 'product'] 
};

const reducers = combineReducers({
        auth: authReducer,
        user: userReducer,
        customer: customerReducer,
        product: productReducer,
        brand: brandReducer,
        category: categoryReducer,
        color: colorReducer,
        blog: blogReducer,
        blogCategory: blogCategoryReducer,
        inquiry: inquiryReducer,
        uploadImg: uploadImgReducer,
        blogUploadImg: blogImgUploadReducer,
        coupon: couponReducer,
        cart: cartReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    
});

export default store;

// export const persistor = persistStore(store);

// export default store;
