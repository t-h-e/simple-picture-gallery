import express from "express";
import { initThumbnailsAsync } from "./thumbnails";
import { consoleLogger, expressLogger } from "./logging";
import { routerApi } from "./router/routerApi";
import { routerHtml } from "./router/routerHtml";

const app = express();

const PORT = process.env.PORT || 3001;

function checkAPICall(req: express.Request) {
  return !req.accepts("text/html");
}

app.use(function (req, res, next) {
  if (checkAPICall(req)) {
    req.url = `/api${req.url}`;
  } else {
    req.url = `/html${req.url}`;
  }
  next();
});

app.use("/api", routerApi);
app.use("/html", routerHtml);

app.use(expressLogger);

app.listen(PORT, () => {
  consoleLogger.info(`Start processing thumbnails async`);
  initThumbnailsAsync("");

  // eslint-disable-next-line no-console
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
