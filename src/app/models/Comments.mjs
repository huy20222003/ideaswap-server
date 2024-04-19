import { Schema, model } from 'mongoose';

const Comments = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    parentCommentID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users"
    },
    bvID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Comments', Comments);
