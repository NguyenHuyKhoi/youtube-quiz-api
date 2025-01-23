import { Service } from "typedi";
import { Channel, IChannel } from "@model";
import { youtube } from "@config";
import { youtube_v3 } from "googleapis";
import { ChannelCreateRequest, ChannelListRequest } from "@request";
import { BadRequestError } from "routing-controllers";
import { format_page, format_per_page, MsgError, paginate } from "@util";
import { YoutubeUtil } from "./youtube";
import { VideoService } from "./video";

@Service()
export class ChannelService {
  constructor(private youtubeUtil: YoutubeUtil, private videoService: VideoService) {}
  async index(request: ChannelListRequest) {
    const page = format_page(request.page);
    const per_page = format_per_page(request.per_page);

    let query: any = {};
    var data = await Channel.find(query)
      .limit(per_page)
      .skip((page - 1) * per_page)
      .lean();
    const total = await Channel.countDocuments(query);

    return paginate(data, total, per_page, page);
  }

  async update(id: string) {
    const data = await Channel.findById(id).lean();
    if (!data || data.deleted_at) {
      throw new BadRequestError(MsgError.CHANNEL_NOT_FOUND);
    }
    const yt_channel = await this.youtubeUtil.getChannel(data.youtube_id);
    if (!yt_channel) {
      throw new BadRequestError(MsgError.CHANNEL_NOT_EXIST_IN_YOUTUBE);
    }
    await Channel.findByIdAndUpdate(id, {
      $set: this.convertData(yt_channel),
    });
  }

  private convertData(data: youtube_v3.Schema$Channel): Partial<IChannel> {
    const { snippet, statistics, id } = data;
    return {
      title: snippet?.title,
      description: snippet?.description,
      custom_url: snippet?.customUrl,
      published_at: snippet?.publishedAt ? new Date(snippet?.publishedAt) : null,
      thumbnails: snippet?.thumbnails,
      statistics: {
        view_count: Number(statistics.viewCount),
        video_count: Number(statistics.videoCount),
        subcsriber_count: Number(statistics.subscriberCount),
      },
      youtube_id: id,
    };
  }

  async create({ channel_id }: ChannelCreateRequest) {
    const channel = await Channel.findOne({
      youtube_id: channel_id,
      deleted_at: null,
    }).lean();
    if (channel) {
      throw new BadRequestError(MsgError.CHANNEL_EXISTED);
    }
    const yt_channel = await this.youtubeUtil.getChannel(channel_id);
    if (!yt_channel) {
      throw new BadRequestError(MsgError.CHANNEL_NOT_EXIST_IN_YOUTUBE);
    }
    await Channel.create(this.convertData(yt_channel));
    return true;
  }
  async show(id: string) {
    var data = await Channel.findById(id).lean();
    return data;
  }

  async syncYoutubeVideos(id: string, all?: boolean) {
    var data = await Channel.findById(id).lean();
    if (!data) {
      throw new BadRequestError(MsgError.CHANNEL_NOT_FOUND);
    }

    const yt_videos = await this.youtubeUtil.getChannelVideos(data.youtube_id, {
      published_after: all ? undefined : data.sync_youtube_at,
    });
    await Promise.allSettled(yt_videos.map(async (yt_video) => await this.videoService.upsert(yt_video, data._id?.toString())));
    await Channel.findByIdAndUpdate(id, {
      $set: { sync_youtube_at: new Date() },
    });
    return true;
  }
}
