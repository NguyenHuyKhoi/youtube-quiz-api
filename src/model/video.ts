import { youtube_v3 } from "googleapis";
import { Document, model, Schema } from "mongoose";

export interface IVideoStatistics {
  view_count: number;
  like_count: number;
  favorite_count: number;
  comment_count: number;
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
}

const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
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
