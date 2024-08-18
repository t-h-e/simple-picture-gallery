import fs from "fs";
import * as path from "path";
import express from "express";
import { a, FolderPreview, Folders } from "../models";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "../paths";
import { securityValidation } from "./securityChecks";
import { getRequestedPath, getThumbnail } from "./common";
import { consoleLogger } from "../logging";

export const walk = async (dirPath: string): Promise<Folders> => {
  const dirEnts = fs.readdirSync(path.posix.join(publicPath, dirPath), {
    withFileTypes: true,
  });

  const numberOfFiles = dirEnts.filter((f) => f.isFile()).length;

  const children = await Promise.all(
    dirEnts
      .filter((d) => d.isDirectory())
      .filter((d) => !d.name.includes(thumbnailPath.substring(1)))
      .map((d) => walk(path.posix.join(dirPath, d.name))),
  );

  return {
    name: path.basename(dirPath) || "Home",
    fullPath: dirPath,
    numberOfFiles,
    children,
  };
};

const getFirstImageInFolder = (dirPath: string): string | undefined => {
  const dirs = [dirPath];
  while (dirs.length > 0) {
    const curPath = dirs.shift();
    const dirContent = fs.readdirSync(path.posix.join(publicPath, curPath), {
      withFileTypes: true,
    });
    for (let i = 0; i < dirContent.length; i += 1) {
      const content = dirContent[i];
      const filePath = path.posix.join(curPath, content.name);
      if (content.isFile()) {
        return getThumbnail(
          fs.existsSync(path.posix.join(thumbnailPublicPath, filePath)),
          curPath,
          content,
        );
      }
      if (content.isDirectory()) {
        dirs.push(filePath);
      }
    }
  }
  return undefined;
};

const getNumberOfFiles = (dirPath: string): number =>
  fs
    .readdirSync(path.posix.join(publicPath, dirPath), {
      withFileTypes: true,
    })
    .filter((d) => d.isFile()).length;

export const getFolderPreview = (
  req: express.Request,
  res: express.Response,
) => {
  const requestedPath = getRequestedPath(req);

  try {
    securityValidation(requestedPath);

    const dirents = fs
      .readdirSync(path.posix.join(publicPath, requestedPath), {
        withFileTypes: true,
      })
      .filter((d) => d.isDirectory())
      .filter((d) => !d.name.includes(thumbnailPath.substring(1)));

    res.json(
      dirents.map((dir) => {
        const fullPath = path.posix.join(requestedPath, dir.name);
        return a<FolderPreview>({
          name: dir.name,
          fullPath,
          numberOfFiles: getNumberOfFiles(fullPath),
          imagePreviewSrc: getFirstImageInFolder(fullPath),
        });
      }),
    );
  } catch (e) {
    consoleLogger.warn(`Error when trying to access ${req.path}: ${e}`);
    res.status(400).json({ message: `Path ${req.path} not accessible.` });
  }
};
