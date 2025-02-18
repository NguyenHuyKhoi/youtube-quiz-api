import { env } from "../util/env";

export const appConfig = {
  port: Number(env("PORT", "3000")),
  route_prefix: env("ROUTE_PREFIX"),

  controller_dir: env("CONTROLLER_DIR"),
  middleware_dir: env("MIDDLEWARE_DIR"),

  mongoose_path: env("MONGOOSE_PATH"),

  youtube_api_key: env("YOUTUBE_API_KEY"),

  openai_key: env("OPENAI_KEY"),
  gemini_key: env("GEMINI_KEY"),
  public_url: env("PUBLIC_URL"),
};
