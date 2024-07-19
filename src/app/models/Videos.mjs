import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Videos = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    description: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    imageUrl: {
      type: String,
      required: true,
      maxLength: 150,
    },
    videoUrl: {
      type: String,
      required: true,
      maxLength: 100,
    },
    view: {
      type: Number,
      required: true,
    },
    courseID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Courses',
    },
  },
  {
    timestamps: true,
  }
);

Videos.statics.uploadFileToCloudinary = async function (file) {
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

export default model('Videos', Videos);
