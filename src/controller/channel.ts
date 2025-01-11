import {
  Body,
  BodyParam,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
  QueryParam,
} from "routing-controllers";
import { Service } from "typedi";
import { success } from "@util";
import { ChannelService } from "@service";
import { ChannelCreateRequest } from "@request";

@Service()
@JsonController("/channels")
export class ChannelController {
  constructor(private service: ChannelService) {}

  @Get("")
  async index() {
    return success(await this.service.index());
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
  async syncYoutubeVideos(
    @Param("id") id: string,
    @QueryParam("all") all: boolean
  ) {
    return success(await this.service.syncYoutubeVideos(id, all));
  }
}
