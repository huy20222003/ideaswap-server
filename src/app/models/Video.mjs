import { Schema, model } from 'mongoose';

const Video = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    courseID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Courses',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Video', Video);
