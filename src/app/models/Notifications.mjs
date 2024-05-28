import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Notifications = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isUnRead: {
      type: Schema.Types.Boolean,
      required: true,
      default: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
      default: null
    },
  },
  {
    timestamps: true,
  }
);

Notifications.statics.uploadFileToCloudinary = async function (file) {
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

export default model('Notifications', Notifications);
