import mongoose from "mongoose";

const userVerifyEmailSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
		},
		digit_code: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const userVerification = mongoose.model(
	"Email Verification",
	userVerifyEmailSchema,
);

export default userVerification;
