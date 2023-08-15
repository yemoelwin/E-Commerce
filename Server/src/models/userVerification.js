import mongoose from "mongoose";

const userVerifyEmailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: Date,
    expiredAt: Date,
}, {
    timestamps: true
})

const userVerification = mongoose.model('Email Verification', userVerifyEmailSchema);

export default userVerification;
