import express from "express";
import * as path from "path";
import { walk } from "./fsExtension";
import { initThumbnailsAsync } from "./thumbnails";
import { publicPath } from "./paths";
import { getImages } from "./controller/images";
import { consoleLogger, expressLogger } from "./logging";

const app = express();

const PORT = process.env.PORT || 3001;

const withCaching = {
  maxAge: 2592000000,
  setHeaders(res, _) {
    res.setHeader(
      "Expires",
      new Date(Date.now() + 2592000000 * 30).toUTCString()
    );
  },
};

app.use("/staticImages", express.static(publicPath, withCaching));

app.use(express.static("../picture-gallery-client/build"));

app.use(expressLogger);

const imagesPath = "/images";

app.get(`${imagesPath}(/*)?`, getImages);

app.get("/directories", async (req, res) => {
  res.json(await walk(""));
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../picture-gallery-client/build/index.html")
  );
});

app.listen(PORT, () => {
  consoleLogger.info(`Start processing thumbnails async`);
  initThumbnailsAsync("");

  // eslint-disable-next-line no-console
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
