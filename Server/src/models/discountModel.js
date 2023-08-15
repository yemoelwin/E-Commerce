import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var discountCodeSchema = new Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    isPercent: {
        type: Boolean,
        required: true,
        default: true
    },
    amount: {
        type: Number,
        required: true
    },
    expiry:{
        type:Date,
        required: true,
        default: '',
    },
    discount:{
        type:Number,
        required:true,
    },
    isActive:{
        type: Boolean,
        required: true,
        default:true
    }
}, {
    timestamps:true
});

couponDiscountSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next()
})

//Export the model
export default model('DiscountCodes', discountCodeSchema);
