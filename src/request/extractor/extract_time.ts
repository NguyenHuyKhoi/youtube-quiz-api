import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExtractTimeRequest {
  @IsNotEmpty()
  @IsString()
  video: string;
}
