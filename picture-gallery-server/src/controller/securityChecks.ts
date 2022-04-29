import path from "path";
import { consoleLogger } from "../logging";

// in case the requested path starts with ".." and tries to traverse outside of the image directory
const dirToCheckAccessViolation = "anyDir";

export const securityValidation = (requestedPath: string) => {
  // use normalize as well in case `join` would not normalize
  const validatePath = path.posix.normalize(
    path.posix.join(dirToCheckAccessViolation, requestedPath)
  );
  // do not use `join` is join also normalizes the path
  const requestedPathWithNewRoot =
    requestedPath === ""
      ? dirToCheckAccessViolation
      : `${dirToCheckAccessViolation}/${requestedPath}`;

  if (validatePath !== requestedPathWithNewRoot) {
    consoleLogger.error(
      `Security violation. Requested path "${requestedPath} did not match normalized path."`
    );
    throw new Error(
      `Security violation. Requested path "${requestedPath} did not match normalized path."`
    );
  }
};
