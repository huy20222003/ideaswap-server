import { Schema, model } from 'mongoose';

const Comments = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxLength: 1000
    },
    parentCommentID: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users"
    },
    referenceID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Comments', Comments);
