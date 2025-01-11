import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChannelCreateRequest {
  @IsNotEmpty()
  @IsString()
  channel_id: string;
}
