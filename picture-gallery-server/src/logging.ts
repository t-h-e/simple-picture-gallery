import expressWinston from "express-winston";
import { createLogger, format, transports } from "winston";

export const expressLogger = expressWinston.logger({
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute(_req, _res) {
    return false;
  },
});

export const consoleLogger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console()],
});
