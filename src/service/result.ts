import { ILoggedUser } from "@middleware";
import { Result } from "@model";
import { ResultCreateRequest } from "@request";
import { Service } from "typedi";

@Service()
export class ResultService {
  async create(request: ResultCreateRequest, user: ILoggedUser) {
    const { score, video } = request;
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
