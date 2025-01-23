import { IsNotEmpty, IsNumber } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";

export class ResultCreateRequest {
  @IsNotEmpty()
  @IsObjectId()
  video: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
