import { AuthCheck } from "@middleware";
import { ExtractQuizRequest } from "@request";
import { ExtractorQuizService } from "@service";
import { success } from "@util";
import { Body, Get, JsonController, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/extractors")
@UseBefore(AuthCheck)
export class ExtractController {
  constructor(private service: ExtractorQuizService) {}

  @Get("")
  async extractQuiz(@Body() request: ExtractQuizRequest) {
    return success(await this.service.extractVideo(request));
  }

  @Get("/all")
  async extractQuizAll() {
    return success(await this.service.extractVideoAll());
  }
}
