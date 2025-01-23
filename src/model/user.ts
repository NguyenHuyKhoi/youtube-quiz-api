import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  device_id: string;
  is_admin: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    device_id: {
      type: String,
      unique: true,
    },
    is_admin: {
      type: Boolean,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    collection: "users",
  }
);

export const User = model<IUser>("User", UserSchema);
