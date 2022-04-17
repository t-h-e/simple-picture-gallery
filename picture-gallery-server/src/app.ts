import express from "express";
import * as fs from "fs";
import * as path from "path";
import sizeOf from "image-size";
import { a, Folder, Folders, Image } from "./models";
import { walk } from "./fsExtension";
import {
  createThumbnailAsyncForImage,
  initThumbnailsAsync,
} from "./thumbnails";
import { publicPath, thumbnailPath, thumbnailPublicPath } from "./paths";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  "/images",
  express.static(publicPath, {
    maxAge: 2592000000,
    setHeaders(res, _) {
      res.setHeader(
        "Expires",
        new Date(Date.now() + 2592000000 * 30).toUTCString()
      );
    },
  })
);

app.use(express.static("../picture-gallery-client/build"));

app.get("/api(/*)?", (req, res) => {
  const requestedPath = decodeURI(req.path.substring(4));

  const dirents = fs.readdirSync(publicPath + requestedPath, {
    withFileTypes: true,
  });
  const thumbnails = fs.readdirSync(thumbnailPublicPath + requestedPath);

  const normalizedPath = requestedPath === "/" ? "" : requestedPath;
  const images: Image[] = dirents
    .filter((f) => f.isFile())
    .map((f) => {
      const thumbnailExists: boolean = thumbnails.includes(f.name);
      if (!thumbnailExists) {
        createThumbnailAsyncForImage(`${requestedPath}/${f.name}`);
      }

      const dimensions = sizeOf(`${publicPath}${requestedPath}/${f.name}`);
      const widthAndHeightSwap = dimensions.orientation > 4; // see https://exiftool.org/TagNames/EXIF.html
      return {
        src: thumbnailExists
          ? `/images${thumbnailPath}${normalizedPath}/${f.name}`
          : `/images${normalizedPath}/${f.name}`,
        width: widthAndHeightSwap ? dimensions.height : dimensions.width,
        height: widthAndHeightSwap ? dimensions.width : dimensions.height,
      };
    });

  res.json(a<Folder>({ images }));
});

app.get("/directories", (req, res) => {
  res.json(a<Folders>(walk("")));
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../picture-gallery-client/build/index.html")
  );
});

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Start processing thumbnails async`);
  initThumbnailsAsync("");

  return console.log(`Express is listening at http://localhost:${PORT}`);
  /* eslint-enable no-console */
});
