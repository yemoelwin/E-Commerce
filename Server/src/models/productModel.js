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
    images: {
        type: Array,
    },
    color: {
        type: String,
        required: true
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