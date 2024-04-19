import { Schema, model } from 'mongoose';

const Censorships = new Schema(
  {
    contentID: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      maxLength: 500,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Censorships', Censorships);
