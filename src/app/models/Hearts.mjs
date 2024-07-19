import { Schema, model } from 'mongoose';

const Hearts = new Schema(
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

export default model('Hearts', Hearts);
