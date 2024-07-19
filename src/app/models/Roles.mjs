import { Schema, model } from 'mongoose';

const Roles = new Schema(
  {
    name: {
      type: String,
      maxLength: 10,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Roles', Roles);
