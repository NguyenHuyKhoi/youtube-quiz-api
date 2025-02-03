import { appConfig } from "@config";
import { GeminiService } from "@helper";
import { Video } from "@model";
import { ExtractQuizRequest } from "@request";
import { MsgError } from "@util";
import fs from "fs";
import { BadRequestError } from "routing-controllers";
import { Service } from "typedi";

import youtubeDl from "youtube-dl-exec";
const ffmpeg = require("fluent-ffmpeg");

@Service()
export class ExtractorQuizService {
  constructor(private geminiService: GeminiService) {}
  public_folder = "public";

  screenshot_folder = "public/screenshots";

  async takeScreenshots(video_path: string, video_duration: number, time_step: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const timestamps: number[] = [];
      var seconds = time_step;
      while (seconds <= video_duration) {
        timestamps.push(seconds);
        seconds += time_step;
      }

      ffmpeg(video_path)
        .outputOptions([
          `-vf`,
          `select='${timestamps.map((timestamp) => `eq(t,${timestamp})`).join("+")}',scale=640:360`, // Filters for timestamps and scaling
          `-vsync vfr`,
        ])
        .output(`${this.screenshot_folder}/%03d.png`)
        .on("end", () => {
          resolve(true);
        })
        .on("error", (err) => {
          reject(err);
        })
        .run();
    });
  }

  downloadVideo(video_id: string, outputPath: string): Promise<any> {
    return youtubeDl(`https://www.youtube.com/watch?v=${video_id}`, {
      output: outputPath,
      format: "worst",
    });
  }

  async extractVideo(request: ExtractQuizRequest) {
    var video = await Video.findById(request.video).lean();
    if (!video || video.deleted_at) {
      throw new BadRequestError(MsgError.VIDEO_NOT_FOUND);
    }

    try {
      this.screenshot_folder = this.public_folder + "/" + video.youtube_id;
      if (!fs.existsSync(this.screenshot_folder)) {
        fs.mkdirSync(this.screenshot_folder);
      }

      var video_path = this.public_folder + "/" + video.youtube_id + "/" + "video.mp4";
      console.time("DOWNLOAD");

      var download_retry = 3;
      while (download_retry > 0) {
        await this.delay(5);
        try {
          //  console.log(`Try download video ${video.youtube_id} with ${3 - download_retry + 1} times`);
          await this.downloadVideo(video.youtube_id, video_path);
          break;
        } catch (e) {
          //console.log("Error down: ", e);
          download_retry--;
        }
      }
      if (download_retry === 0) {
        console.log(`Download error, return`);
        return;
      }
      console.timeEnd("DOWNLOAD");

      console.time("SCREENSHOTS");
      await this.takeScreenshots(video_path, video.duration, 10);
      console.timeEnd("SCREENSHOTS");

      console.time("EXTRACT_QUIZZES");
      const files = await fs.readdirSync(`${this.screenshot_folder}`);
      const image_paths = files.map((u) => `${appConfig.public_url}/${this.screenshot_folder}/${u}`);

      var quizzes = await this.geminiService.extractQuizzes(image_paths);
      if (quizzes != null) {
        console.log(`Video has ${quizzes.length}  quizzes`);
        video = await Video.findByIdAndUpdate(request.video, { $set: { quizzes, quiz_extracted: true } }, { new: true }).lean();
      } else {
        // Gemini api error, try later
      }
      console.timeEnd("EXTRACT_QUIZZES");
    } catch (e) {
      console.log("error: ", e);
    }

    return video;
  }

  async delay(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), seconds * 1000);
    });
  }
  async extractVideoAll() {
    const videos: any[] = await Video.find({ quiz_extracted: { $ne: true }, deleted_at: null }, {}, { sort: { created_at: -1 } }).lean();
    console.log("Video count: ", videos.length);
    for (var i = 0; i < videos.length; i++) {
      console.log(`\n\n\n******************Process for video ${i}: ${videos[i].youtube_id} --- ${videos[i].title}*********************`);
      console.time(`VIDEO_${i}`);
      await this.extractVideo({ video: videos[i]._id?.toString() });
      console.timeEnd(`VIDEO_${i}`);
      this.delay(10);
    }
  }
}
