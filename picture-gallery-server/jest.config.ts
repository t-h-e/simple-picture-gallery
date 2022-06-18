import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "node",
    rootDir: "src",
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
  };
};
