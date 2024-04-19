import { Schema, model } from 'mongoose';

const Course = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
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

export default model('Course', Course);
