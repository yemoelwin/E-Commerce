import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new Schema({
    code:{
        type:String,
        required:true,
        // unique: true,
    },
    expiry:{
        type:Date,
        required: true,
    },
    discount:{
        type:Number,
        required:true,
    },
}, {
    timestamps:true
});

//Export the model
export default model('Coupon', couponSchema);
