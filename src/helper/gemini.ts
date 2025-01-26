import { Service } from "typedi";
import { FileDataPart, GenerativeModel, GoogleGenerativeAI, Part } from "@google/generative-ai";
import { appConfig } from "@config";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
@Service()
export class GeminiService {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;

  constructor() {
    this.genAI = new GoogleGenerativeAI(appConfig.gemini_key);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async extractQuizzes(image_paths: string[]) {
    try {
      const prompt = `Extract quizzes from YouTube quiz images with url. Ignore images dont display any quiz. For quizzes, return a JSON array: {question: string, answers: string[], answer: number, index: number}. Return the content as plain text I can parse to JSON`;

      const imageParts: any[] = [];
      for (var image_path of image_paths) {
        const local_path = image_path.replace(appConfig.public_url + "/", "");
        if (local_path.includes("video") || !fs.existsSync(local_path)) {
          continue;
        }
        imageParts.push({
          inlineData: {
            data: Buffer.from(fs.readFileSync(local_path)).toString("base64"),
            mimeType: "image/png",
          },
        });
      }

      const result = await this.model.generateContent([prompt, ...imageParts]);

      const result_text = result.response.text();
      if (!result_text) {
        return [];
      }
      const quizzes = JSON.parse(result_text.replace("```json", "").replace("```", ""));
      return quizzes;
    } catch (e) {
      console.log("error: ", e);
      return [];
    }
  }

  async extractQuiz(image_path: string) {
    try {
      const prompt = `Extract quiz from image with url. return a JSON object: {question: string, answers: string[], answer: number, index: number}. Return the content as plain text I can parse to JSON`;

      const local_path = image_path.replace(appConfig.public_url + "/", "");
      const imageParts: any[] = [
        {
          inlineData: {
            data: Buffer.from(fs.readFileSync(local_path)).toString("base64"),
            mimeType: "image/png",
          },
        },
      ];

      const result = await this.model.generateContent([prompt, ...imageParts]);

      const result_text = result.response.text();
      if (!result_text) {
        return null;
      }
      const quiz = JSON.parse(result_text.replace("```json", "").replace("```", ""));
      return quiz;
    } catch (e) {
      console.log("error: ", e);
      return null;
    }
  }
}
