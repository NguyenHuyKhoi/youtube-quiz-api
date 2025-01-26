import { Service } from "typedi";
import Tesseract from "tesseract.js";
import { fstat } from "fs";
import { IQuiz } from "@model";
import { appConfig } from "@config";
@Service()
export class OCRService {
  async extractQuiz(imagePath: string, index: number) {
    try {
      console.log("Extract quiz: ", imagePath);
      const { data } = await Tesseract.recognize(imagePath, "eng");

      const text = data.text;
      console.log("OCR Result:", JSON.stringify(data, null, 2));

      const questionMatch = text.match(/(.*)\?/);
      const optionsMatch = text.match(/A\)(.*)\nB\)(.*)\nC\)(.*)\nD\)(.*)/);

      if (questionMatch && optionsMatch) {
        const question = questionMatch[1].trim();
        const answers = [optionsMatch[1].trim(), optionsMatch[2].trim(), optionsMatch[3].trim(), optionsMatch[4].trim()];

        const correctAnswer = 1;

        const quiz = {
          question,
          answers,
          answer: correctAnswer,
          index,
        };

        console.log("Extracted Quiz:", quiz);
        return quiz;
      } else {
        console.log("Failed to extract quiz data from the image.");
        return null;
      }
    } catch (error) {
      console.error("Error extracting quiz:", error);
      return null;
    }
  }

  async extractQuizzes(image_paths: string[]) {
    var quizzes: IQuiz[] = [];
    await Promise.allSettled(
      image_paths.slice(3, 4).map(async (u, i) => {
        var quiz = await this.extractQuiz(u.replace(appConfig.public_url + "/", ""), i);
        if (!quiz || quiz.question) {
          quizzes.push(quiz);
        }
      })
    );
    return quizzes;
  }
}
