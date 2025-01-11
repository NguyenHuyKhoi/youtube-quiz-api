import { youtube } from "@config";
import { lchown } from "fs";
import { youtube_v3 } from "googleapis";
import { Service } from "typedi";
import VIDEOS from "./videos.json";
@Service()
export class YoutubeUtil {
  async getChannel(
    channel_id: string
  ): Promise<youtube_v3.Schema$Channel | null> {
    var query: youtube_v3.Params$Resource$Channels$List = {
      part: ["snippet", "statistics"],
      id: [channel_id],
    };

    try {
      const response = await youtube.channels.list(query);
      const channel = response?.data?.items?.[0];
      return channel;
    } catch (error) {
      console.error("Error fetching channel by ID:", error);
      return null;
    }
  }

  async getDetailVideos(ids: string[]) {
    try {
      const response = await youtube.videos.list({
        part: ["snippet", "contentDetails", "statistics"],
        id: ids,
      });
      return response.data.items;
    } catch (e) {
      return [];
    }
  }

  async getChannelVideos(
    channelId: string,
    filter?: {
      published_after?: Date;
    }
  ) {
    const videos: youtube_v3.Schema$Video[] = [];
    try {
      var nextPageToken = null;
      do {
        const query: youtube_v3.Params$Resource$Search$List = {
          channelId,
          publishedAfter: filter?.published_after?.toISOString(),
          part: ["snippet"],
          maxResults: 50,
          order: "date",
        };
        if (nextPageToken) {
          query.pageToken = nextPageToken;
        }
        const response = await youtube.search.list(query);

        const video_ids = response.data.items.map((u) => u.id.videoId);
        const detail_videos = await this.getDetailVideos(video_ids);
        videos.push(...detail_videos);

        nextPageToken = response.data.nextPageToken;
      } while (nextPageToken);
      return videos;
    } catch (e) {
      console.log("Get video in channel error: ", e);
      return videos;
    }
  }
}
