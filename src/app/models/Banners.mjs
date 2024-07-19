import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Banners = new Schema(
  {
    managerID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Manager',
    },
    name: {
      type: String,
      required: true,
      maxLength: 30
    },
    site: {
      type: String,
      required: true,
      maxLength: 30
    },
    imageUrl: {
      type: String,
      required: true,
      maxLength: 150
    },
  },
  {
    timestamps: true,
  }
);

Banners.statics.uploadFileToCloudinary = async function (file) {
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

export default model('Banners', Banners);
