import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var productCategorySchema = new Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    numSearchs:{
        type:Number,
        default: 0,
    }
}, {
    timestamps: true,
});

//Export the model
export default model('Product Category', productCategorySchema);