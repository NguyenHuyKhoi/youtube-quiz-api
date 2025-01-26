import { youtube_v3 } from "googleapis";
import { Document, model, Schema } from "mongoose";

export interface IVideoStatistics {
  view_count: number;
  like_count: number;
  favorite_count: number;
  comment_count: number;
}

export interface IQuiz {
  index: number;
  answers: string[];
  question: string;
  answer: number;
}
export interface IVideo extends Document {
  title: string;
  description: string;
  channel: Schema.Types.ObjectId;
  channel_youtube_id: string;
  duration: number;
  published_at: Date;
  tags: string[];
  youtube_id: string;
  deleted_at: null;
  thumbnails: youtube_v3.Schema$ThumbnailDetails;
  statistics: IVideoStatistics;
  video_end_time: number;
  video_begin_time: number;
  quiz_count: number;
  quiz_explanation_time: number;
  quiz_time: number;
  quizzes: IQuiz[];
  quiz_extracted: boolean;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    quiz_extracted: { type: Boolean, default: false },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "Channel",
    },
    channel_youtube_id: {
      type: String,
    },
    duration: {
      type: Number,
    },
    statistics: {
      type: Object,
    },
    published_at: {
      type: Date,
    },
    tags: [
      {
        type: String,
        default: [],
      },
    ],
    thumbnails: {
      type: Object,
    },
    youtube_id: {
      type: String,
      unique: true,
    },
    video_begin_time: {
      type: Number,
    },
    video_end_time: {
      type: Number,
    },
    quiz_count: {
      type: Number,
    },
    quiz_explanation_time: {
      type: Number,
    },
    quiz_time: {
      type: Number,
    },
    quizzes: [
      {
        type: Object,
        default: [],
      },
    ],
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "videos",
  }
);

export const Video = model<IVideo>("Video", VideoSchema);
