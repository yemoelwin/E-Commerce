import mongoose from "mongoose";

const userVerificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    uniqueString: {
        type: String,
        required: true
    },
    createdAt: Date,
    expiredAt: Date,
}, {
    timestamps: true
})

const userVerification = mongoose.model('UserVerification', userVerificationSchema);

export default userVerification;
