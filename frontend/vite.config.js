import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/resume": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
      "/scrapping": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  base: "./", // Change the base configuration to an object
});
