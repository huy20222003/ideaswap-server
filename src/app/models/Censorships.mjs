import { Schema, model } from 'mongoose';

const Censorships = new Schema(
  {
    contentID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'rejected'],
      default: 'pending',
      required: true,
      maxLength: 10
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
