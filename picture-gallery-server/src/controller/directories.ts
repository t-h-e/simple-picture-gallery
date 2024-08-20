import fs from "fs";
import * as path from "path";
import express from "express";
import { a, FolderPreview, Folders, Image } from "../models";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "../paths";
import { securityValidation } from "./securityChecks";
import { getRequestedPath, notEmpty } from "./common";
import { consoleLogger } from "../logging";
import { getImage } from "./images";

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

const getFirstImageInFolder = async (
  dirPath: string,
): Promise<Image | void> => {
  const dirs = [dirPath];
  while (dirs.length > 0) {
    const curPath = dirs.shift();
    const dirContent = fs.readdirSync(path.posix.join(publicPath, curPath), {
      withFileTypes: true,
    });
    for (let i = 0; i < dirContent.length; i += 1) {
      const content = dirContent[i];
      if (content.isFile()) {
        const thumbnailExists = fs.existsSync(
          path.posix.join(thumbnailPublicPath, curPath, content.name),
        );
        return getImage(content, curPath, thumbnailExists);
      }
      if (content.isDirectory()) {
        const nextDirPath = path.posix.join(curPath, content.name);
        dirs.push(nextDirPath);
      }
    }
  }
  return undefined;
};

export const getFolderPreview = async (
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

    const folderPreviewsToLoad = dirents.map(async (dir) => {
      const fullPath = path.posix.join(requestedPath, dir.name);
      const imageForPreview = await getFirstImageInFolder(fullPath);
      if (notEmpty(imageForPreview)) {
        return a<FolderPreview>({
          name: dir.name,
          fullPath,
          imagePreview: imageForPreview,
        });
      }
      return undefined;
    });

    const folderPreviews = (await Promise.all(folderPreviewsToLoad)).filter(
      notEmpty,
    );
    res.json(folderPreviews);
  } catch (e) {
    consoleLogger.warn(`Error when trying to access ${req.path}: ${e}`);
    res.status(400).json({ message: `Path ${req.path} not accessible.` });
  }
};
