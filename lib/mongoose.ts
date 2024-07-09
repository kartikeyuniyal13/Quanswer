import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URI) {
        return console.error('MONGODB_URI is missing');
    }

    if (isConnected) {
        console.log('Using existing connection');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'Quanswer'
           // useNewUrlParser: true,
            //useUnifiedTopology: true
        });
        isConnected = true; // Update the connection status
        console.log('Database connection established');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
};