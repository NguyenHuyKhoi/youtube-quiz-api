import { env } from "../util/env";

export const appConfig = {
  port: Number(env("PORT")),
  route_prefix: env("ROUTE_PREFIX"),

  controller_dir: env("CONTROLLER_DIR"),
  middleware_dir: env("MIDDLEWARE_DIR"),

  mongoose_path: env("MONGOOSE_PATH"),

  youtube_api_key: env("YOUTUBE_API_KEY"),
};
