import { IsNotEmpty, isNumber, IsNumber, IsOptional } from "class-validator";

export class ListRequest {
  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  per_page: number = 10;
}
