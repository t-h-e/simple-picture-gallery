import express from "express";
import path from "path";
import fs, { Dirent } from "fs";
import { thumbnailPath, thumbnailPublicPath } from "../paths";

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
  thumbnailExists: boolean,
  requestedPath: string,
  f: Dirent,
): string =>
  thumbnailExists
    ? path.posix.join("/staticImages", thumbnailPath, requestedPath, f.name)
    : getSrc(requestedPath, f);
