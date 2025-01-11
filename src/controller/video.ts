import {
  Body,
  BodyParam,
  Get,
  JsonController,
  Param,
  Patch,
  Post,
} from "routing-controllers";
import { Service } from "typedi";
import { success } from "@util";
import { ChannelService } from "@service";
import { ChannelCreateRequest } from "@request";

@Service()
@JsonController("/videos")
export class VideoController {
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
}
