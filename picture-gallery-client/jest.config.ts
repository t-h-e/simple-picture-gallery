import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    rootDir: "src",
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
  };
};
