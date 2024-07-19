import { Schema, model } from 'mongoose';

const Messages = new Schema(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    content: {
      type: String,
      require: function () {
        return this.type === 'text';
      },
    },
    messageParentID: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    conversationID: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Conversations',
    },
    fileUrl: {
      type: String,
      maxLength: 150,
      require: function () {
        return this.type === 'file';
      },
    },
    type: {
      type: String,
      enum: ['text', 'file'],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Messages', Messages);
