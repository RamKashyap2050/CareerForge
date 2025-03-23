import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),  tailwindcss()],
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
      "/api/mock": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
  base: "./", // Change the base configuration to an object
});
