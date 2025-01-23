import { ILoggedUser } from "@middleware";
import { IVideo, Result, Video } from "@model";
import { VideoListRequest, VideoUpdateRequest } from "@request";
import { format_page, format_per_page, paginate } from "@util";
import { youtube_v3 } from "googleapis";
import { Service } from "typedi";

@Service()
export class VideoService {
  async index(request: VideoListRequest, user: ILoggedUser) {
    const page = format_page(request.page);
    const per_page = format_per_page(request.per_page);

    let query: any = {};
    const { has_answers } = request;
    if (has_answers) {
      query.quiz_count = { $gt: 0 };
    } else if (has_answers === false) {
      query.quiz_count = null;
    }
    var data = await Video.find(query)
      .sort({ "statistics.view_count": -1 })
      .limit(per_page)
      .skip((page - 1) * per_page)
      .lean();
    const total = await Video.countDocuments(query);

    data = data.map((u) => ({
      ...u,
      thumbnail: u.thumbnails.medium ?? u.thumbnails.default ?? u.thumbnails.high,
    }));

    data = await this.appendResults(data, user);
    return paginate(data, total, per_page, page);
  }

  async appendResults(data: any[], user: ILoggedUser) {
    const video_ids = data.map(({ _id }) => _id);
    const results = await Result.find({ video: { $in: video_ids }, user: user._id }).lean();
    data = data.map((u: any) => ({
      ...u,
      best_score: results.find((result: any) => result.video?._id?.toString() === u?._id?.toString())?.best_result,
    }));
    return data;
  }

  convertData(video: youtube_v3.Schema$Video): Partial<IVideo> {
    const { id, snippet, statistics, contentDetails } = video;
    const { title, description, channelId, thumbnails, publishedAt, tags } = snippet;
    const { duration } = contentDetails;
    const { viewCount, likeCount, commentCount, favoriteCount } = statistics;
    return {
      title,
      description,
      channel_youtube_id: channelId,
      duration: this.convertDurationToSeconds(duration),
      published_at: new Date(publishedAt),
      tags,
      youtube_id: id,
      thumbnails,
      statistics: {
        view_count: Number(viewCount),
        like_count: Number(likeCount),
        comment_count: Number(commentCount),
        favorite_count: Number(favoriteCount),
      },
    };
  }

  convertDurationToSeconds(duration: string) {
    const regex = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;

    const matches = duration.match(regex);
    if (!matches) return 0;

    const hours = matches[1] ? parseInt(matches[1], 10) : 0;
    const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
    const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  async upsert(video: youtube_v3.Schema$Video, channel_oid: string) {
    var converted = this.convertData(video);
    converted.channel = channel_oid as any;
    await Video.findOneAndUpdate(
      { youtube_id: video.id },
      {
        $set: converted,
      },
      { upsert: true }
    );
  }

  async show(id: string) {
    var data = await Video.findById(id).lean();
    return data;
  }

  async update(id: string, request: VideoUpdateRequest) {
    await Video.findByIdAndUpdate(id, { $set: request });
  }
}
