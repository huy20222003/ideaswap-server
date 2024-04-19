import { Schema, model } from 'mongoose';

const Tags = new Schema(
  {
    tagName: {
      type: Schema.Types.ObjectId,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default model('Tags', Tags);
