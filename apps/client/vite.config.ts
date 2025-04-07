import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter(), svgr()],
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
