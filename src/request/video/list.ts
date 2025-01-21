import { isNullOrUndefined } from "node:util";
import { ListRequest } from "../common.ts/list";
import { IsBoolean, IsOptional } from "class-validator";

export class VideoListRequest extends ListRequest {
  @IsOptional()
  @IsBoolean()
  has_answers?: boolean;
}
