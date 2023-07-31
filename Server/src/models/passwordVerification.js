import mongoose from "mongoose";

let resetPasswordVerification = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    uniqueToken: {
        type: String,
        required: true
    },
    changedAt: Date,
    uniqueTokenExpiredAt: Date
}, {
    timestamps: true
});

const userPasswordVerification = mongoose.model('reset token verification', resetPasswordVerification);
export default userPasswordVerification;