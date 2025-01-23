import { connectMongoose, registerMongooseModels } from "@util";
import bodyParser from "body-parser";
import express from "express";
import http from "http";
import { useContainer as routingControllersUseContainer, useExpressServer } from "routing-controllers";
import { Container } from "typedi";
import { appConfig } from "./config/app";
import { CustomErrorHandler } from "./middleware/CustomErrorHandler";

export class App {
  private app: express.Application = express();
  private port: Number = appConfig.port;

  public httpServer: http.Server;

  public async bootstrap() {
    console.log("Init bootstrap app");
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
    console.log("Start api with configs: ", JSON.stringify(appConfig, null, 2));
    this.httpServer.listen(this.port, () => {
      console.log(`🚀 Server Storage API started at http://localhost:${this.port}\n🚨️ Environment: ${process.env.NODE_ENV}`);

      const listRoutes = (app) => {
        const routes = [];
        app._router.stack.forEach((middleware) => {
          if (middleware.route) {
            // Routes registered directly on the app
            routes.push({
              method: Object.keys(middleware.route.methods)[0].toUpperCase(),
              path: middleware.route.path,
            });
          } else if (middleware.name === "router") {
            // Routes added via router
            middleware.handle.stack.forEach((nestedMiddleware) => {
              if (nestedMiddleware.route) {
                routes.push({
                  method: Object.keys(nestedMiddleware.route.methods)[0].toUpperCase(),
                  path: nestedMiddleware.route.path,
                });
              }
            });
          }
        });
        return routes;
      };
      // console.log(listRoutes(this.app));
    });
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
