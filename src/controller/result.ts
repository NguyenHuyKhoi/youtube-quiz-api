import { AuthCheck, ILoggedUser, LoggedUser } from "@middleware";
import { ResultCreateRequest } from "@request";
import { ResultService } from "@service";
import { success } from "@util";
import { Body, Get, JsonController, Post, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/results")
@UseBefore(AuthCheck)
export class ResultController {
  constructor(private service: ResultService) {}

  @Post("")
  async create(@Body() request: ResultCreateRequest, @LoggedUser() user: ILoggedUser) {
    return success(await this.service.create(request, user));
  }
}
