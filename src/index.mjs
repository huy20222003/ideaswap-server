import dotenv from 'dotenv';
dotenv.config();
import express, { json, urlencoded } from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/database/index.mjs';
import route from './routes/index.mjs';
import setUpSocket from './setUpSocket.mjs';
import Hearts from './app/models/Hearts.mjs';
import Comments from './app/models/Comments.mjs';
import Shares from './app/models/Shares.mjs';
import Courses from './app/models/Courses.mjs';
import Blogs from './app/models/Blogs.mjs';
import Documents from './app/models/Documents.mjs';

const PORT = process.env.PORT || 3000;

app.use(json({ limit: '100mb' }));
app.use(urlencoded({ limit: '100mb', extended: true }));

// connect database
await connectDB();

// Cập nhật các tài liệu hiện có
async function updateCollections() {
  try {
    // Cập nhật tất cả tài liệu trong Hearts collection
    await Hearts.updateMany(
      {"bvID": { $ne: null }},
      { $rename: { 'bvID': 'referenceID' } }
    );
    console.log('Updated Hearts collection successfully');

    // Cập nhật tất cả tài liệu trong Comments collection
    await Comments.updateMany({"bvID": { $ne: null }}, { $rename: { 'bvID': 'referenceID' } });
    console.log('Updated Comments collection successfully');

    // Cập nhật tất cả tài liệu trong Shares collection
    await Shares.updateMany({"bvID": { $ne: null }}, { $rename: { 'bvID': 'referenceID' } });
    console.log('Updated Shares collection successfully');

    await Courses.updateMany({}, { $set: { categoryID: '66972257159f6c59d6be3730' } }, { upsert: true });
    console.log('Updated Courses collection successfully');

    await Blogs.updateMany({}, { $set: { categoryID: '66972257159f6c59d6be3730' } }, { upsert: true });
    console.log('Updated Blogs collection successfully');

    await Documents.updateMany({}, { $set: { categoryID: '66972257159f6c59d6be3730' } }, { upsert: true });
    console.log('Updated Documents collection successfully');

  } catch (error) {
    console.error('Update failed:', error);
  }
}

// Thực hiện cập nhật
// await updateCollections();

//cors
const corsOptions = {
  origin: [
    'https://ideaswap.netlify.app',
    'http://localhost:5173',
    'https://ideaswap-management.netlify.app',
  ],
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
app.get('/', (req, res) => {
  res.send('Hello World');
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});

setUpSocket(server);
