import fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { Folders } from "./models";
import { publicPath, thumbnailPath } from "./paths";
import { consoleLogger } from "./logging";

const isImageProcessable = async (filePath: string): Promise<boolean> =>
  sharp(filePath)
    .metadata()
    .then(() => true)
    .catch((err) => {
      consoleLogger.error(
        `Reading metadata from ${filePath} produced the following error: ${err.message}`
      );
      return false;
    });

export const walk = async (dirPath: string): Promise<Folders> => {
  const dirEnts = fs.readdirSync(path.posix.join(publicPath, dirPath), {
    withFileTypes: true,
  });

  dirEnts.filter((f) => f.isFile());

  const numberOfFiles = (
    await Promise.all(
      dirEnts
        .filter((f) => f.isFile())
        .map((f) => path.posix.join(publicPath, dirPath, f.name))
        .map(isImageProcessable)
    )
  ).filter((a) => a).length;

  const children = await Promise.all(
    dirEnts
      .filter((d) => d.isDirectory())
      .filter((d) => !d.name.includes(thumbnailPath.substring(1)))
      .map((d) => walk(path.posix.join(dirPath, d.name)))
  );

  return {
    name: path.basename(dirPath) || "Home",
    fullPath: dirPath,
    numberOfFiles,
    children,
  };
};
