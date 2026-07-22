import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Makes Docker accessible
    port: 5001,
    watch: {
      usePolling: true,
      interval: 100, // Check every 100ms (default is 1000ms)
    },
  },
});
