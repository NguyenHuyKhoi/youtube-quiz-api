import { youtube_v3 } from "googleapis";
import { Document, model, Schema } from "mongoose";

export interface IChannelStatistic {
  view_count: number;
  subcsriber_count: number;
  video_count: number;
}
export interface IChannel extends Document {
  title: string;
  description: string;
  custom_url: string;
  published_at: Date;
  youtube_id: string;
  deleted_at: null;
  thumbnails: youtube_v3.Schema$ThumbnailDetails;
  sync_youtube_at: Date;
  statistics: IChannelStatistic;
}

const ChannelSchema = new Schema<IChannel>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    custom_url: {
      type: String,
    },
    published_at: {
      type: Date,
    },
    thumbnails: {
      type: Object,
    },
    statistics: {
      type: Object,
    },
    youtube_id: {
      type: String,
      unique: true,
    },
    sync_youtube_at: {
      type: Date,
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
    collection: "channels",
  }
);

export const Channel = model<IChannel>("Channel", ChannelSchema);
