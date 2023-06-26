import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { dbConnect } from './config/dbConnect.js';
import authRoute from './routes/authRoute.js'

config();
dbConnect();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', authRoute)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});