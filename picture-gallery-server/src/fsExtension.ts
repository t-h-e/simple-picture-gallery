import fs from "fs";
import * as path from "path";
import { Folders } from "./models";

export const publicPath = "../public";

export const walk = (dirPath: string): Folders => {
  const dirEnts = fs.readdirSync(publicPath + dirPath, { withFileTypes: true });

  return {
    name: path.basename(dirPath) || "Home",
    fullPath: dirPath,
    numberOfFiles: dirEnts.filter((f) => f.isFile()).length,
    children: dirEnts
      .filter((d) => d.isDirectory())
      .map((d) => walk(path.posix.join(dirPath, d.name))),
  };
};
