import { configureStore } from '@reduxjs/toolkit';
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
// import tokenMiddleware from '../middleware/tokenMiddleware';


const store = configureStore({
    reducer: {
        // [apiSlice.reducerPath]: apiSlice.reducer,
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
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    
});

export default store;
