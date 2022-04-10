import sharp from "sharp";
import fs from "fs";
import path from "path";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "./paths";

const percentage = 25;
const minimumPixelForThumbnail = 1000;

export const createThumbnailAsyncForImage = (image: string) => {
  sharp(`${publicPath}${image}`)
    .metadata()
    .then((info) => {
      let width = Math.round((info.width * percentage) / 100);
      let height = Math.round((info.height * percentage) / 100);
      // no thumbnail if both sides are smaller than minimumPixelForThumbnail
      if (
        info.width <= minimumPixelForThumbnail &&
        info.height <= minimumPixelForThumbnail
      ) {
        width = info.width;
        height = info.height;
      }

      fs.mkdir(
        thumbnailPublicPath + path.dirname(image),
        { recursive: true },
        () => {
          sharp(`${publicPath}${image}`)
            .resize(width, height)
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
