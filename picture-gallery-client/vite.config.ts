import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
    },
    plugins: [react(), eslint(), viteTsconfigPaths()],
    server: {
      proxy: {
        "/images": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        "/directories": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
        "/staticImages": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
