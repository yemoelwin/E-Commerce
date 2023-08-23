import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var colorSchema = new Schema({
    color :{
        type:String,
        required:true,
    },
    numSearchs:{
        type:Number,
        default: 0,
    }
});

//Export the model
export default model('Color', colorSchema);