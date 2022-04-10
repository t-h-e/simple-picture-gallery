import sharp from "sharp";
import fs from "fs";
import path from "path";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "./paths";

const percentage = 25;
const minimumPixelForThumbnail = 1024;

export const createThumbnailAsyncForImage = (image: string) => {
  sharp(`${publicPath}${image}`)
    .metadata()
    .then((info) => {
      const width = Math.max(
        Math.min(info.width, minimumPixelForThumbnail),
        Math.round((info.width * percentage) / 100)
      );
      const height = Math.max(
        Math.min(info.height, minimumPixelForThumbnail),
        Math.round((info.height * percentage) / 100)
      );

      fs.mkdir(
        thumbnailPublicPath + path.dirname(image),
        { recursive: true },
        () => {
          sharp(`${publicPath}${image}`)
            .withMetadata()
            .resize(info.width > info.height ? { width } : { height })
            .toFile(`${thumbnailPublicPath}${image}`);
        }
      );
    });
};

export const initThumbnailsAsync = (dirPath: string) => {
  if (dirPath.includes(thumbnailPath)) {
    return;
  }
  const dirEnts = fs.readdirSync(publicPath + dirPath, { withFileTypes: true });
  fs.mkdirSync(thumbnailPublicPath + dirPath, { recursive: true });
  const thumbnails = fs.readdirSync(thumbnailPublicPath + dirPath);

  dirEnts
    .filter((f) => f.isFile())
    .filter((f) => !thumbnails.includes(f.name))
    .map((f) => createThumbnailAsyncForImage(`${dirPath}/${f.name}`));
  dirEnts
    .filter((f) => f.isDirectory())
    .forEach((d) => initThumbnailsAsync(`${dirPath}/${d.name}`));
};
