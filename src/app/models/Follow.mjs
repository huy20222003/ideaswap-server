import { Schema, model } from 'mongoose';

const Follows = new Schema(
  {
    followerID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Follows', Follows);
