import { Schema, model } from 'mongoose';
import cloudinary from '../../config/cloudinary/index.mjs';

const Notifications = new Schema(
  {
    description: {
      type: String,
      required: true,
      maxLength: 1000
    },
    imageUrl: {
      type: String,
      required: true,
      maxLength: 150
    },
    isUnRead: {
      type: Schema.Types.Boolean,
      required: true,
      default: true,
    },
    userID: {
      type: Schema.Types.Array,
      require: true
    },
    actorID: {
      type: Schema.Types.ObjectId,
      require: true
    },
    referenceType: {
      type: String,
      maxLength: 50,
      require: true
    },
    isModal: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    referenceID: {
      type: Schema.Types.ObjectId,
      require: true
    }
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
