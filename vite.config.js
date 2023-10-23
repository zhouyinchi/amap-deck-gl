import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // ...
      {
        find: /^react-mapbox-gl/,
        replacement: "react-mapbox-gl/lib",
      },
    ],
  },
});
