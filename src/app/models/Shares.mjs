import { Schema, model } from 'mongoose';

const Shares = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users"
    },
    referenceID: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model('Shares', Shares);
