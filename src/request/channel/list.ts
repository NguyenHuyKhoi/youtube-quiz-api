import { isNullOrUndefined } from "node:util";
import { ListRequest } from "../common.ts/list";
import { IsBoolean, IsOptional } from "class-validator";

export class ChannelListRequest extends ListRequest {}
