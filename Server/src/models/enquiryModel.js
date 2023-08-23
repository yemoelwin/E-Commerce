import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
var enquirySchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    comments:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted", "Contacted", "In Progress", "Resolved"],
    },
});

//Export the model
export default model('Enquiry', enquirySchema);