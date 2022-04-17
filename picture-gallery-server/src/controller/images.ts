import fs from "fs";
import sizeOf from "image-size";
import express from "express";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "../paths";
import { a, Folder, Image } from "../models";
import { createThumbnailAsyncForImage } from "../thumbnails";
import { consoleLogger } from "../logging";

export const getImages =
  (imagesPath: string) => (req: express.Request, res: express.Response) => {
    const requestedPath = decodeURI(req.path.substring(imagesPath.length));
    const normalizedPath = requestedPath === "/" ? "" : requestedPath;

    try {
      const dirents = fs.readdirSync(publicPath + requestedPath, {
        withFileTypes: true,
      });
      const thumbnails = fs.readdirSync(thumbnailPublicPath + requestedPath);

      const images: Image[] = dirents
        .filter((f) => f.isFile())
        .map((f) => {
          const thumbnailExists: boolean = thumbnails.includes(f.name);
          if (!thumbnailExists) {
            createThumbnailAsyncForImage(`${requestedPath}/${f.name}`);
          }

          const dimensions = sizeOf(`${publicPath}${requestedPath}/${f.name}`);
          const widthAndHeightSwap = dimensions.orientation > 4; // see https://exiftool.org/TagNames/EXIF.html
          return {
            src: thumbnailExists
              ? `/staticImages${thumbnailPath}${normalizedPath}/${f.name}`
              : `/staticImages${normalizedPath}/${f.name}`,
            width: widthAndHeightSwap ? dimensions.height : dimensions.width,
            height: widthAndHeightSwap ? dimensions.width : dimensions.height,
          };
        });
      res.json(a<Folder>({ images }));
    } catch (e) {
      consoleLogger.warn(`Error when trying to access ${req.path}: ${e}`);
      res.status(400).json(`Path ${req.path} not accessible.`);
    }
  };
