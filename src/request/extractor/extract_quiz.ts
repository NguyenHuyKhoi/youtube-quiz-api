import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ExtractQuizRequest {
  @IsNotEmpty()
  @IsString()
  video: string;
}
