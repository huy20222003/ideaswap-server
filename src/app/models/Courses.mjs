import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Courses = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      require: true
    },
    title: {
      type: String,
      required: true,
      maxLength: 100
    },
    description: {
      type: String,
      required: true,
      maxLength: 5000
    },
    imageUrl: {
      type: String,
      required: true,
      maxLength: 150
    },
    view: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

Courses.statics.uploadFileToCloudinary = async function (file) {
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

export default model('Courses', Courses);
