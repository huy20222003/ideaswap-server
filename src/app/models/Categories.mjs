import { Schema, model } from 'mongoose';

const Categories = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 200
    },
    description: {
      type: String,
      required: true,
      maxLength: 5000,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Categories', Categories);
