import ModuleAlias from "module-alias";

export function fixModuleAlias(dirName: string) {
  ModuleAlias.addAliases({
    "@config": dirName + "/config",
    "@util": dirName + "/util",
    "@controller": dirName + "/controller",
    "@middleware": dirName + "/middleware",
    "@request": dirName + "/request",
    "@model": dirName + "/model",
    "@service": dirName + "/service",
  });
}
