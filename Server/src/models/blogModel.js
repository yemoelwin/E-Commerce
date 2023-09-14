import mongoose from "mongoose"; // Erase if already required
import { model } from "mongoose";

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    images: [
        {   
            url: String,
            asset_id: String,
            public_id: String,
        }
    ],
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

//Export the model
export default model('blog', blogSchema);