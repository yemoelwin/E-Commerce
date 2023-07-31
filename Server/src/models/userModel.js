import mongoose from "mongoose"; // Erase if already required
// import crypto from 'crypto';
// import bcrypt from 'bcryptjs';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        default: "user"
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    }],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    refreshToken: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,
    // passwordResetToken: String,
    // passwordResetTokenExpires: Date
}, {
    timestamps: true
}
);

// generate reset token and validate that token

// function generateResetToken() {
//     return crypto.randomBytes(20).toString('hex');
// }

// export class generatePasswordResetToken {
//     constructor() {
//         // const resetToken = crypto.randomBytes(32).toString('hex');
//         // console.log('resetToken',resetToken);
//         // this.passwordResetToken = crypto
//         //     .createHash('yml142996')
//         //     .update(resetToken)
//         //     .digest('hex')
//         // this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;
//         // return resetToken;
//         this.passwordResetToken = generateResetToken();
//         this.passwordResetTokenExpires = Date.now() + 15 * 60 * 1000;
//         this.save();
//         return {
//             passwordResetToken: this.passwordResetToken,
//             passwordResetTokenExpires: this.passwordResetTokenExpires,
//         };
//     }
// }

// userSchema.methods.validatePasswordResetToken = function(resetToken) {
//     return this.passwordResetToken === resetToken && this.passwordResetTokenExpires > Date.now();
// }

// generate reset token and validate that token

// userSchema.pre("save", async function (next) {
//     const salt = await bcrypt.genSaltSync(10);
//     this.password = await bcrypt.hash(this.password, salt)
// })

// userSchema.methods.isPasswordMatched = async function (enterPassword) {
//     return await bcrypt.compare(enterPassword,this.password)
// }
const UserModel = mongoose.model("user", userSchema);
export default UserModel;