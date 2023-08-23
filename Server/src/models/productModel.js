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
    },
    price:{
        type:Number,
        required: true,
    },
    brand: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        // select: false
    },
    images: [],
    color: [],
    tags: [],
    ratings: [{
        stars: Number,
        comment: String,
        postedby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    totalrating: {
        type: String,
        default: 0
    }
}, {
    timestamps: true
}
);

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;