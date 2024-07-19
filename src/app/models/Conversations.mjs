import { Schema, model } from 'mongoose';

const Conversations = new Schema(
  {
    members: {
      type: Schema.Types.Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Conversations', Conversations);
