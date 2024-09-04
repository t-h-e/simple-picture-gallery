import fs, { Dirent } from "fs";
import express from "express";
import sharp from "sharp";
import path from "path";
import natsort from "natsort";
import { publicPath } from "../paths";
import { a, Folder, Image } from "../models";
import { consoleLogger } from "../logging";
import { securityValidation } from "./securityChecks";
import {
  definedOrZero,
  getRequestedPath,
  getSrc,
  getThumbnail,
  notEmpty,
  readThumbnails,
} from "./common";

const toImage = (
  metadata: sharp.Metadata,
  filePath: string,
  f: Dirent,
  thumbnailExists: boolean,
): Image => {
  const widthAndHeightSwap =
    metadata.orientation !== undefined && metadata.orientation > 4; // see https://exiftool.org/TagNames/EXIF.html
  return a<Image>({
    src: getSrc(filePath, f),
    thumbnail: getThumbnail(filePath, f, thumbnailExists),
    width: definedOrZero(widthAndHeightSwap ? metadata.height : metadata.width),
    height: definedOrZero(
      widthAndHeightSwap ? metadata.width : metadata.height,
    ),
  });
};

export const getImage = async (
  f: Dirent,
  filePath: string,
  thumbnailExists: boolean,
): Promise<Image | void> =>
  sharp(path.posix.join(publicPath, filePath, f.name))
    .metadata()
    .then((metadata) => toImage(metadata, filePath, f, thumbnailExists))
    .catch((err) => {
      consoleLogger.error(
        `Reading metadata from ${path.posix.join(
          publicPath,
          filePath,
          f.name,
        )} produced the following error: ${err.message}`,
      );
    });

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
    .map(async (f) => {
      const thumbnailExists: boolean = thumbnails.includes(f.name);
      return getImage(f, requestedPath, thumbnailExists);
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
