import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new Schema({
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
});

//Export the model
export default model('Brand', brandSchema);