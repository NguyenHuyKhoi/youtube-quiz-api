import { youtube_v3 } from "googleapis";
import { Document, model, Schema } from "mongoose";

export interface IResult extends Document {
  video: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  best_result: number;
}

const ResultSchema = new Schema<IResult>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    best_result: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "results",
  }
);

export const Result = model<IResult>("Result", ResultSchema);
