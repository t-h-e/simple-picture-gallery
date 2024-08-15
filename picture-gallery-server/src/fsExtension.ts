import fs from "fs";
import * as path from "path";
import { Folders } from "./models";
import { publicPath, thumbnailPath } from "./paths";

export const walk = async (dirPath: string): Promise<Folders> => {
  const dirEnts = fs.readdirSync(path.posix.join(publicPath, dirPath), {
    withFileTypes: true,
  });

  const numberOfFiles = dirEnts.filter((f) => f.isFile()).length;

  const children = await Promise.all(
    dirEnts
      .filter((d) => d.isDirectory())
      .filter((d) => !d.name.includes(thumbnailPath.substring(1)))
      .map((d) => walk(path.posix.join(dirPath, d.name))),
  );

  return {
    name: path.basename(dirPath) || "Home",
    fullPath: dirPath,
    numberOfFiles,
    children,
  };
};
