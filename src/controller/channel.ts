import { Body, BodyParam, Get, JsonController, Param, Patch, Post, QueryParam, QueryParams } from "routing-controllers";
import { Service } from "typedi";
import { success } from "@util";
import { ChannelService } from "@service";
import { ChannelCreateRequest, ChannelListRequest } from "@request";

@Service()
@JsonController("/channels")
export class ChannelController {
  constructor(private service: ChannelService) {}

  @Get("")
  async index(@QueryParams() request: ChannelListRequest) {
    return success(await this.service.index(request));
  }

  @Get("/:id")
  async show(@Param("id") id: string) {
    return success(await this.service.show(id));
  }

  @Post("")
  async create(@Body() request: ChannelCreateRequest) {
    return success(await this.service.create(request));
  }

  @Patch("/:id")
  async update(@Param("id") id: string) {
    return success(await this.service.update(id));
  }

  @Patch("/:id/sync-youtube-videos")
  async syncYoutubeVideos(@Param("id") id: string, @QueryParam("all") all: boolean) {
    return success(await this.service.syncYoutubeVideos(id, all));
  }
}
