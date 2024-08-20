import express from "express";
import * as path from "path";
import { ServeStaticOptions } from "serve-static";
import { publicPath } from "../paths";

export const routerHtml = express.Router();

const withCaching: ServeStaticOptions = {
  maxAge: 2592000000,
  setHeaders: (res, _) => {
    res.setHeader(
      "Expires",
      new Date(Date.now() + 2592000000 * 30).toUTCString(),
    );
  },
};

routerHtml.use("/staticImages", express.static(publicPath, withCaching));

routerHtml.use(express.static("../picture-gallery-client/build"));

// All other GET requests not handled before will return our React app
routerHtml.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../../picture-gallery-client/build/index.html"),
  );
});
