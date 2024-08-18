import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import viteTsconfigPaths from "vite-tsconfig-paths";
// @ts-ignore
import importMetaEnv from "@import-meta-env/unplugin";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
    },
    plugins: [
      react(),
      eslint(),
      viteTsconfigPaths(),
      importMetaEnv.vite({ example: ".env.example" }),
    ],
    server: {
      proxy: {
        // Should only match in case header accepts JSON, otherwise vite should handle it and not the proxy
        // Could not find a way to do that
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
        "/folderspreview": {
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
