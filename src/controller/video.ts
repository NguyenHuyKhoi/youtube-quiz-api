import { AuthCheck, ILoggedUser, LoggedUser } from "@middleware";
import { VideoListRequest, VideoUpdateRequest } from "@request";
import { VideoService } from "@service";
import { success } from "@util";
import { Body, Get, JsonController, Param, Patch, QueryParams, UseBefore } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/videos")
@UseBefore(AuthCheck)
export class VideoController {
  constructor(private service: VideoService) {}

  @Get("")
  async index(@QueryParams() request: VideoListRequest, @LoggedUser() user: ILoggedUser) {
    return success(await this.service.index(request, user));
  }

  @Get("/:id")
  async show(@Param("id") id: string) {
    return success(await this.service.show(id));
  }

  @Patch("/:id")
  async update(@Param("id") id: string, @Body() request: VideoUpdateRequest) {
    return success(await this.service.update(id, request));
  }
}
