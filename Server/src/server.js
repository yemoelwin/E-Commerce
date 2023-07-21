import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import { dbConnect } from './config/dbConnect.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

import authRoute from './routes/authRoute.js';
import productRoute from './routes/productRoute.js';

config();
dbConnect();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/user', authRoute);
app.use('/api/product', productRoute);
app.use(errorHandler.pageNotFound);
app.use(errorHandler.handleError);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});