import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional } from "class-validator";
import { ListRequest } from "../common.ts/list";
import { IQuiz } from "@model";

export class VideoUpdateRequest {
  @IsOptional()
  @IsNumber()
  video_begin_time: number;

  @IsOptional()
  @IsNumber()
  video_end_time: number;

  @IsOptional()
  @IsNumber()
  quiz_count: number;

  @IsOptional()
  @IsNumber()
  quiz_time: number;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  quizzes: IQuiz[];
}
