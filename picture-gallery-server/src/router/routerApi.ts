import express from "express";
import { getImages } from "../controller/images";
import { getFolderPreview, walk } from "../controller/directories";

export const routerApi = express.Router();

routerApi.get(`/images(/*)?`, getImages);

routerApi.get("/directories", async (req, res) => {
  res.json(await walk(""));
});

routerApi.get("/folderspreview(/*)?", getFolderPreview);
