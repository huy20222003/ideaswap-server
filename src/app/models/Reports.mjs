import { Schema, model } from 'mongoose';

const Reports = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxLength: 1000
    },
    referenceID: {
        type: Schema.Types.ObjectId,
        require: true
    },
    userID: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Users"
    },
    type: {
        type: String,
        require: true,
        maxLength: 50
    },
    status: {
        type: String,
        require: true,
        maxLength: 50,
    },
    moderatorID: {
        type: Schema.Types.ObjectId,
        ref: "Managers",
        require: true
    },
  },
  {
    timestamps: true,
  }
);

export default model('Reports', Reports);
