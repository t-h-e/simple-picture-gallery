import express from "express";
import path from "path";
import fs, { Dirent } from "fs";
import { thumbnailPath, thumbnailPublicPath } from "../paths";
import { createThumbnailAsyncForImage } from "../thumbnails";

export const getRequestedPath = (req: express.Request): string =>
  req.params[1] === undefined || req.params[1] === "/" ? "" : req.params[1];

export const readThumbnails = (requestedPath: string): string[] => {
  const requestedThumbnailPath = path.posix.join(
    thumbnailPublicPath,
    requestedPath,
  );
  return fs.existsSync(requestedThumbnailPath)
    ? fs.readdirSync(requestedThumbnailPath)
    : [];
};

export const getSrc = (requestedPath: string, f: Dirent): string =>
  path.posix.join("/staticImages", requestedPath, f.name);

export const getThumbnail = (
  filePath: string,
  f: Dirent,
  thumbnailExists: boolean,
): string => {
  if (thumbnailExists) {
    return path.posix.join("/staticImages", thumbnailPath, filePath, f.name);
  }

  createThumbnailAsyncForImage(path.posix.join(filePath, f.name));
  return getSrc(filePath, f);
};

export const notEmpty = <TValue>(
  value: TValue | void | null | undefined,
): value is TValue => {
  return value !== null && value !== undefined;
};

export const definedOrError = <TValue>(
  value: TValue | void | null | undefined,
): TValue => {
  if (notEmpty(value)) {
    return value;
  }
  throw Error("Value was not defined.");
};

export const definedOrZero = (
  value: number | void | null | undefined,
): number => (notEmpty(value) ? value : 0);
