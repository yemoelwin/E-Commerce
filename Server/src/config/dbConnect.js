import mongoose from 'mongoose';

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
        });
        console.log('db connected successfully.');
    } catch (error) {
        console.error('Failed to connect to the database', error);
    }
};