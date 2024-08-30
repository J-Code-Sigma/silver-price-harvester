import { fileURLToPath, URL } from "url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  process.env = {...process.env, ...loadEnv(mode, process.cwd())};

  const env = loadEnv(mode, process.cwd());

  const PORT = `${env.PORT_NUM ?? '8080'}`;


  return {
  server: {
    host: "::",
    port: PORT,
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
};
});
