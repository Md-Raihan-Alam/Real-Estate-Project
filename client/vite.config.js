import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://real-estate-project-server.onrender.com/",
        changeOrigin: true, // Ensures the host header is modified for the proxy
        secure: true,       // Set to true if the server uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: if the backend expects the `/api` path to be stripped
      },
    },
  },
  plugins: [react()],
});
