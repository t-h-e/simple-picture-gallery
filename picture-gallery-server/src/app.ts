import express from "express";
import * as fs from "fs";
import * as path from "path";
import sizeOf from "image-size";
import { a, Folder, Folders, Image } from "./models";
import { publicPath, walk } from "./fsExtension";

const app = express();

const PORT = process.env.PORT || 3001;

app.use("/images", express.static(publicPath));

app.use(express.static("../picture-gallery-client/build"));

app.get("/api(/*)?", (req, res) => {
  const requestedPath = req.path.substring(4);

  const dirents = fs.readdirSync(publicPath + requestedPath, {
    withFileTypes: true,
  });

  const normalizedPath = requestedPath === "/" ? "" : requestedPath;
  const images: Image[] = dirents
    .filter((f) => f.isFile())
    .map((f) => {
      const dimensions = sizeOf(`${publicPath}${requestedPath}/${f.name}`);
      return {
        src: `/images${normalizedPath}/${f.name}`,
        width: dimensions.width,
        height: dimensions.height,
      };
    });

  res.json(a<Folder>({ images }));
});

app.get("/directories", (req, res) => {
  res.json(a<Folders>(walk("/")));
});

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../../picture-gallery-client/build/index.html")
  );
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
