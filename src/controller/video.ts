import { VideoListRequest, VideoUpdateRequest } from "@request";
import { VideoService } from "@service";
import { success } from "@util";
import { Body, Get, JsonController, Param, Patch, QueryParams } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/videos")
export class VideoController {
  constructor(private service: VideoService) {}

  @Get("")
  async index(@QueryParams() request: VideoListRequest) {
    return success(await this.service.index(request));
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
