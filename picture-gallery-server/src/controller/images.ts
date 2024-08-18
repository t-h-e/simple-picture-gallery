import fs, { Dirent } from "fs";
import express from "express";
import sharp from "sharp";
import path from "path";
import natsort from "natsort";
import { publicPath } from "../paths";
import { a, Folder, Image } from "../models";
import { createThumbnailAsyncForImage } from "../thumbnails";
import { consoleLogger } from "../logging";
import { securityValidation } from "./securityChecks";
import {
  getRequestedPath,
  getSrc,
  getThumbnail,
  readThumbnails,
} from "./common";

const notEmpty = <TValue>(
  value: TValue | void | null | undefined,
): value is TValue => {
  return value !== null && value !== undefined;
};

const toImage = (
  metadata: sharp.Metadata,
  thumbnailExists: boolean,
  requestedPath: string,
  f: Dirent,
): Image => {
  const widthAndHeightSwap = metadata.orientation > 4; // see https://exiftool.org/TagNames/EXIF.html
  return a<Image>({
    src: getSrc(requestedPath, f),
    thumbnail: getThumbnail(thumbnailExists, requestedPath, f),
    width: widthAndHeightSwap ? metadata.height : metadata.width,
    height: widthAndHeightSwap ? metadata.width : metadata.height,
  });
};

const getImagesToBeLoaded = (
  dirents: Dirent[],
  thumbnails: string[],
  requestedPath: string,
): Promise<Image | void>[] =>
  dirents
    .filter((f) => f.isFile())
    // sorts by name in a natural way
    // could be made configurable for sorting in other ways (e.g. date of creation)
    .sort((file1, file2) => natsort()(file1.name, file2.name))
    .map((f) => {
      const thumbnailExists: boolean = thumbnails.includes(f.name);
      if (!thumbnailExists) {
        createThumbnailAsyncForImage(path.posix.join(requestedPath, f.name));
      }
      return sharp(path.posix.join(publicPath, requestedPath, f.name))
        .metadata()
        .then((metadata) =>
          toImage(metadata, thumbnailExists, requestedPath, f),
        )
        .catch((err) => {
          consoleLogger.error(
            `Reading metadata from ${path.posix.join(
              publicPath,
              requestedPath,
              f.name,
            )} produced the following error: ${err.message}`,
          );
        });
    });

export const getImages = async (
  req: express.Request,
  res: express.Response,
) => {
  const requestedPath = getRequestedPath(req);

  try {
    securityValidation(requestedPath);

    const dirents = fs.readdirSync(path.posix.join(publicPath, requestedPath), {
      withFileTypes: true,
    });
    const thumbnails = readThumbnails(requestedPath);

    const imagesToBeLoaded = getImagesToBeLoaded(
      dirents,
      thumbnails,
      requestedPath,
    );
    const images = (await Promise.all(imagesToBeLoaded)).filter(notEmpty);
    res.json(a<Folder>({ images }));
  } catch (e) {
    consoleLogger.warn(`Error when trying to access ${req.path}: ${e}`);
    res.status(400).json({ message: `Path ${req.path} not accessible.` });
  }
};
