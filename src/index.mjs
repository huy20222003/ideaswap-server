import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/database/index.mjs';
import route from './routes/index.mjs';

const PORT = process.env.PORT || 3000;

app.use(json({ limit: '100mb' }));
app.use(urlencoded({ limit: '100mb', extended: true }));

// connect database
await connectDB();

//cors
const corsOptions = {
  origin: ['http://localhost:5173', 'https://ideaswap.netlify.app', 'https://ideaswap-management.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors());

//morgan
app.use(morgan('dev'));

//router
route(app);

// Định nghĩa các route cho ứng dụng của bạn
app.get('/', (req, res)=>{
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});

