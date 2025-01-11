import "reflect-metadata";
import { fixModuleAlias } from "./util/module-alias";
fixModuleAlias(__dirname);
import { App } from "./app";

const app = new App();
app.bootstrap().then();
