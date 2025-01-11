import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  HttpError,
  BadRequestError,
} from "routing-controllers";
import * as express from "express";
import { Service } from "typedi";
import { StatusCodes } from "@util";

@Service()
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  public error(
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) {
    const responseObject = {} as any;
    responseObject.success = false;

    if (error.httpCode) {
      responseObject.status = error.httpCode;
      res.status(error.httpCode);
    } else {
      responseObject.status = StatusCodes.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
    // Message
    responseObject.message = error.message;

    // Class validator handle errors
    if (responseObject.status == StatusCodes.BAD_REQUEST) {
      let validatorErrors = {} as any;
      if (typeof error === "object" && error.hasOwnProperty("errors")) {
        error.errors.forEach((element: any) => {
          if (element.property && element.constraints) {
            validatorErrors[element.property] = element.constraints;
          }
        });
      }
      responseObject.errors = validatorErrors;
    }

    // Append stack
    if (
      error.stack &&
      responseObject.status == StatusCodes.INTERNAL_SERVER_ERROR
    ) {
      // responseObject.stack = error.stack;
    }

    // Final response
    if (!res.headersSent) res.json(responseObject);
  }
}
