import sharp from "sharp";
import fs from "fs";
import path from "path";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "./paths";
import { consoleLogger } from "./logging";

const percentage = 25;
const minimumPixelForThumbnail = 1024;

export const createThumbnailAsyncForImage = (image: string) => {
  const publicImagePath = path.posix.join(publicPath, image);
  sharp(publicImagePath)
    .metadata()
    .then((info) => {
      if (info.width === undefined || info.height === undefined) {
        return;
      }
      const width = Math.max(
        Math.min(info.width, minimumPixelForThumbnail),
        Math.round((info.width * percentage) / 100),
      );
      const height = Math.max(
        Math.min(info.height, minimumPixelForThumbnail),
        Math.round((info.height * percentage) / 100),
      );

      fs.mkdir(
        path.posix.join(thumbnailPublicPath, path.dirname(image)),
        { recursive: true },
        () => {
          if (info.width === undefined || info.height === undefined) {
            return;
          }
          sharp(publicImagePath)
            .withMetadata()
            .resize(info.width > info.height ? { width } : { height })
            .toFile(`${path.posix.join(thumbnailPublicPath, image)}`);
        },
      );
    })
    .catch((err) => {
      consoleLogger.error(
        `Thumbnail creation of ${publicImagePath} produced the following error: ${err.message}`,
      );
    });
};

export const initThumbnailsAsync = (dirPath: string) => {
  if (dirPath.includes(thumbnailPath)) {
    return;
  }
  const dirEnts = fs.readdirSync(path.posix.join(publicPath, dirPath), {
    withFileTypes: true,
  });
  fs.mkdirSync(path.posix.join(thumbnailPublicPath, dirPath), {
    recursive: true,
  });
  const thumbnails = fs.readdirSync(
    path.posix.join(thumbnailPublicPath, dirPath),
  );

  dirEnts
    .filter((f) => f.isFile())
    .filter((f) => !thumbnails.includes(f.name))
    .map((f) => createThumbnailAsyncForImage(`${dirPath}/${f.name}`));
  dirEnts
    .filter((f) => f.isDirectory())
    .forEach((d) => initThumbnailsAsync(`${dirPath}/${d.name}`));
};
