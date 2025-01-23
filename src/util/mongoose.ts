import { appConfig } from "@config";
import mongoose from "mongoose";

export async function connectMongoose() {
  try {
    console.log("Connection path: ", appConfig.mongoose_path);
    await mongoose.connect(appConfig.mongoose_path);
    console.log("Connect to mongoose is successful!");
  } catch (error) {
    console.log("Caught! Cannot connect to mongodb: ", error);
  }
}
export const registerMongooseModels = () => {
  import("../model/index");
};
