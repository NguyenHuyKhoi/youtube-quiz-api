import { appConfig } from "@config";
import { IQuiz } from "@model";
import axios from "axios";
import { Service } from "typedi";

@Service()
export class OpenAIService {
  async extractQuizzes(image_paths: string[]) {
    try {
      console.log("Image paths: ", image_paths[0], image_paths.length);
      var res: any = axios.post(
        `https://api.openai.com/v1/chat/completions`,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract quizzes from YouTube quiz images, with urls: ${image_paths.join(
                    ", "
                  )}. Ignore images without quizzes. For quizzes, return a JSON array: {question: string, answers: string[], answer: number, index: number}. Return the content as plain text I can parse, not with json in begin`,
                  //   text: "I have many images extract from youtube quiz videos, each images can be a quiz or not, with image dont contain quiz, please ignore it, and many images can extract same quiz (same index quiz). So i send list of images, return me only array json object with format of each object is a quiz:  {question: string, answers: string[], answer: number, index: number}. Please return content is string can i copy and parse to object, not with json in begin ",
                },
                // ...image_paths.map((image_path) => ({
                //   type: "image_url",
                //   image_url: {
                //     url: image_path,
                //   },
                // })),
              ],
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ` + appConfig.openai_key,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(
        "Text request ",
        `Extract quizzes from YouTube quiz images, with urls: ${image_paths.join(
          ", "
        )}. Ignore images without quizzes. For quizzes, return a JSON array: {question: string, answers: string[], answer: number, index: number}. Return the content as plain text I can parse, not with json in begin`
      );
      console.log("Res: ", JSON.stringify(res));
      var content = res?.choices?.[0]?.message?.content;
      console.log("Content ", content);
      if (!content) {
        return [];
      }
      var quizzes = JSON.parse(content);
      return quizzes;
    } catch (e) {
      console.log("Open ai extract quizzes error: ", e);
      return [];
    }
  }
}
