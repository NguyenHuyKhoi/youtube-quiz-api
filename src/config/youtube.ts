import { google } from "googleapis";
import { appConfig } from "./app";
export const youtube = google.youtube({
  version: "v3",
  auth: appConfig.youtube_api_key,
});
