import { connectMongoose, registerMongooseModels } from "@util";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import {
  useContainer as routingControllersUseContainer,
  useExpressServer,
} from "routing-controllers";
import { Container } from "typedi";
import { appConfig } from "./config/app";
import { CustomErrorHandler } from "./middleware/CustomErrorHandler";

export class App {
  private app: express.Application = express();
  private port: Number = appConfig.port;

  public httpServer: http.Server;

  public async bootstrap() {
    await connectMongoose();
    registerMongooseModels();

    this.useContainers();

    this.httpServer = new http.Server(this.app);
    this.startApi();

    this.setupPreControllerMiddlewares();
    this.registerRoutingControllers();
    this.setupPostControllerMiddlewares();
  }

  private useContainers() {
    routingControllersUseContainer(Container);
  }

  private setupPreControllerMiddlewares() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
  }

  private setupPostControllerMiddlewares() {
    this.app.use(new CustomErrorHandler().error);
  }
  private startApi() {
    this.httpServer.listen(this.port, () =>
      console.log(
        `🚀 Server Storage API started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`
      )
    );
  }

  private registerRoutingControllers() {
    useExpressServer(this.app, {
      validation: { stopAtFirstError: true },
      cors: true,
      classTransformer: true,
      defaultErrorHandler: false,
      routePrefix: appConfig.route_prefix,
      controllers: [__dirname + appConfig.controller_dir],
      middlewares: [__dirname + appConfig.middleware_dir],
    });
  }
}
