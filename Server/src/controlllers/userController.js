import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import path from 'path';

const userRegister = async (req, res) => {
    try {
        // Extract the required fields from the request body
        const { firstname, lastname, email, mobile, password } = req.body;
        const existingUser = await
            UserModel.findOne({ $or: [{ email }, { mobile }] });
            if (existingUser) {
                return res.status(409)
                    .json({ error: 'User already exists' });
            }

        // Encrypt the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user object with the hashed password
        const newUser = new UserModel({
        firstname,
        lastname,
        email,
        mobile,
        password: hashedPassword,
        });
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (error) {
        // Handle any errors that occur during registration
        res.status(500).json({ error: error.message });
    }
};


export const userInfo = { userRegister };