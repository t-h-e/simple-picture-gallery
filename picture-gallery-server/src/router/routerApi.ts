import express from "express";
import { getImages } from "../controller/images";
import { walk } from "../fsExtension";

export const routerApi = express.Router();

routerApi.get(`/images(/*)?`, getImages);

routerApi.get("/directories", async (req, res) => {
  res.json(await walk(""));
});
