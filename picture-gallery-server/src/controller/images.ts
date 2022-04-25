import fs from "fs";
import express from "express";
import sharp from "sharp";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "../paths";
import { a, Folder, Image } from "../models";
import { createThumbnailAsyncForImage } from "../thumbnails";
import { consoleLogger } from "../logging";

function notEmpty<TValue>(
  value: TValue | void | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const getImages =
  (imagesPath: string) =>
  async (req: express.Request, res: express.Response) => {
    const requestedPath = decodeURI(req.path.substring(imagesPath.length));
    const normalizedPath = requestedPath === "/" ? "" : requestedPath;

    try {
      const dirents = fs.readdirSync(publicPath + requestedPath, {
        withFileTypes: true,
      });
      const thumbnails = fs.readdirSync(thumbnailPublicPath + requestedPath);

      const imagesToBeLoaded = dirents
        .filter((f) => f.isFile())
        .map((f) => {
          const thumbnailExists: boolean = thumbnails.includes(f.name);
          if (!thumbnailExists) {
            createThumbnailAsyncForImage(`${requestedPath}/${f.name}`);
          }
          return sharp(`${publicPath}${requestedPath}/${f.name}`)
            .metadata()
            .then((metadata) => {
              const widthAndHeightSwap = metadata.orientation > 4; // see https://exiftool.org/TagNames/EXIF.html
              return a<Image>({
                src: thumbnailExists
                  ? `/staticImages${thumbnailPath}${normalizedPath}/${f.name}`
                  : `/staticImages${normalizedPath}/${f.name}`,
                width: widthAndHeightSwap ? metadata.height : metadata.width,
                height: widthAndHeightSwap ? metadata.width : metadata.height,
              });
            })
            .catch((err) => {
              consoleLogger.error(
                `Reading metadata from ${publicPath}${requestedPath}/${f.name} produced the following error: ${err.message}`
              );
            });
        });
      const images = (await Promise.all(imagesToBeLoaded)).filter(notEmpty);
      res.json(a<Folder>({ images }));
    } catch (e) {
      consoleLogger.warn(`Error when trying to access ${req.path}: ${e}`);
      res.status(400).json({ message: `Path ${req.path} not accessible.` });
    }
  };
