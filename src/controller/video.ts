import { VideoListRequest } from "@request";
import { VideoService } from "@service";
import { success } from "@util";
import { Get, JsonController, QueryParams } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/videos")
export class VideoController {
  constructor(private service: VideoService) {}

  @Get("")
  async index(@QueryParams() request: VideoListRequest) {
    return success(await this.service.index(request));
  }
}
