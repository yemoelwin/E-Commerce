import nodeMailer from 'nodemailer';
import UserVerification from '../models/userVerification.js';
import userPasswordVerification from "../models/passwordVerification.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';
config()

let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    },
    debug: true // Enable debugging
});

transporter.verify((error, success) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Ready for messages');
        console.log(success);
    }
})



export const sendVerificationEmail = async ({ _id, email }) => {
    const currentURL = 'http://localhost:8080/api/';
    const uniqueString = uuidv4() + _id;
    console.log('uniqueString01',uniqueString);
    try {
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiredAt: Date.now() + 24 * 60 * 60 * 1000 
            // expiredAt: Date.now() + 21600000
        });

        console.log('uniqueStringVerify :', uniqueString);
        await newVerification.save();
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            text: "Hello world?",
            html:
                `<p>Verify your email address to complete signup and login your account.</p><br/>
            <p>This link <b>expires in 6 hours</b>.</p>
            <p><a href=${currentURL + 'user/verify/' + _id + "/" + hashedUniqueString }>Click here</a> 
            to proceed.</p>`
        };
        await transporter.sendMail(mailOptions);
        return {
            status: 'PENDING',
            message: 'Verification Email Sent.'
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            status: 'FAILED',
            message: 'An error occurred while sending the verification email.'
        };
    }
    
}

const generateResetToken = () => {
    const uniqueToken = crypto.randomBytes(20).toString('hex');
    return uniqueToken;
}

export const ResetPasswordToken = async ({ _id, email }) => {
    try {
        const resetURL = 'http://localhost:8080/api/';
        const resetPasswordToken = generateResetToken();
        const expiryDurationInMilliseconds = 1 * 60 * 60 * 1000;
        const newUserPassVerification = new userPasswordVerification({
            userId: _id,
            email,
            uniqueToken: resetPasswordToken,
            changedAt: Date.now(),
            uniqueTokenExpiredAt: Date.now() + expiryDurationInMilliseconds
        })
        await newUserPassVerification.save();
        const EmailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Reset Your Email Password' + + new Date(),
            html:
                `<p>You have been sent an email to reset your password.</p><br/>
                <p>This link expires in <b>1 hour.</b></p>
                <p><a href=${resetURL + 'user/reset-password/' + _id + "/" + resetPasswordToken}>Click here</a>
            to proceed.</p>`
        }
        await transporter.sendMail(EmailOptions)
        return {
            status: 'PENDING',
            message: 'An email has been sent to your account to reset your password.Pls check your email and change your password.'
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            status: 'FAILED',
            message: 'An error occurred while sending the attached reset token email.'
        };
    }
}
