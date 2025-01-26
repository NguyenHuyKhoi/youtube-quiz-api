import { ILoggedUser } from "@middleware";
import { Result, Video } from "@model";
import { ResultCreateRequest } from "@request";
import { MsgError } from "@util";
import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

@Service()
export class ResultService {
  async create(request: ResultCreateRequest, user: ILoggedUser) {
    const { score, video } = request;
    var video_data: any = await Video.findById(video).lean();
    if (!video_data || video_data.deleted_at) {
      throw new BadRequestError(MsgError.VIDEO_NOT_FOUND);
    }
    if (!video_data.quiz_count) {
      throw new BadRequestError(MsgError.VIDEO_NOT_CONFIG_TO_PLAY);
    }
    var data = await Result.findOne({ video, user: user._id }).lean();
    if (!data) {
      await Result.create({
        user: user._id,
        video,
        best_result: score,
      });
      return true;
    }
    if (data.best_result < score) {
      await Result.findByIdAndUpdate(data._id, { $set: { best_result: score } });
      return true;
    }
    return true;
  }
}
