import { securityValidation } from "../securityChecks";

describe("securityValidation", () => {
  const validPaths: string[] = ["", "some/path", "folder"];

  it.each(validPaths)("should allow valid path: %s", (validPath: string) => {
    expect(() => securityValidation(validPath)).not.toThrow();
  });

  // `avoidTraversalInGeneral` includes actually allowed paths, but are excluded to avoid traversal all together
  const avoidTraversalInGeneral = ["some/path/../to/here", "some/path/../.."];
  const invalidPaths: string[] = avoidTraversalInGeneral.concat([
    "..",
    "../evil",
    "evil/path/../../..",
    "evil/path/../../../here",
  ]);

  it.each(invalidPaths)("should not allow invalid path: %s", (invalidPath) => {
    expect(() => securityValidation(invalidPath)).toThrow();
  });
});
