import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Blogs = new Schema(
  {
    content: {
        type: String,
        maxLength: 2000,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Users', 
    }
  },
  {
    timestamps: true,
  }
);

Blogs.statics.uploadFileToCloudinary = async function (file) {
  try {
    if (!file) {
      return {
        status: false,
        message: 'Missing information',
      };
    } else {
      const result = await cloudinary.uploader.upload(file, {
        upload_preset: process.env.UPLOAD_PRESET,
      });
      return {
        status: true,
        message: 'Upload successful',
        imageUrl: result.secure_url,
      };
    }
  } catch (error) {
    return {
      status: false,
      message: 'Error uploading image',
    };
  }
};

export default model('Blogs', Blogs);
