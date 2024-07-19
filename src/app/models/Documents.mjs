import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Documents = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
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
    fileUrl: {
      type: String,
      required: true,
      maxLength: 100
    },
    countDownload: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String, 
      require: true,
      maxLength: 150
    },
    status: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Censorships',
      maxLength: 10
    },
    score: {
      type: Number,
      default: 0,
    },
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
      require: true
    }
  },
  {
    timestamps: true,
  }
);

Documents.statics.uploadFileToCloudinary = async function (file) {
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


export default model('Documents', Documents);
