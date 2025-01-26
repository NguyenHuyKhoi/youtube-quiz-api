import ModuleAlias from "module-alias";

export function fixModuleAlias(dirName: string) {
  ModuleAlias.addAliases({
    "@config": dirName + "/config",
    "@util": dirName + "/util",
    "@helper": dirName + "/helper",
    "@controller": dirName + "/controller",
    "@middleware": dirName + "/middleware",
    "@request": dirName + "/request",
    "@model": dirName + "/model",
    "@service": dirName + "/service",
  });
}
