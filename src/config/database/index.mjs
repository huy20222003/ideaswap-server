import dotenv from 'dotenv';
dotenv.config();
import { connect } from 'mongoose';

async function connectDB() {
  try {
    await connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learning-app.3an83io.mongodb.net/ideaswap?retryWrites=true&w=majority&appName=learning-app`
      
    );
    console.log('Connect successfully');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

export default connectDB;
