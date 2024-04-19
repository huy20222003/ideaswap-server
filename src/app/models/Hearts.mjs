import { Schema, model } from 'mongoose';

const Hearts = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users"
    },
    bvID: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model('Hearts', Hearts);
