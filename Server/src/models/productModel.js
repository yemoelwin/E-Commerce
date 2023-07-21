import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        trim: true
    },
    slug:{
        type:String,
        required: true,
        unique: true,
        lowercase: true
    },
    description:{
        type:String,
        required:true,
        // unique:true,
    },
    price:{
        type:Number,
        required:true,
        unique:true,
    },
    brand: {
        type: String,
        enum: ['Apple', 'Samsung', 'Huawei']
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        enum: ['Black', 'Brown', 'Red']
    },
    ratings: [{
        stars: Number,
        postedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
}
);

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;