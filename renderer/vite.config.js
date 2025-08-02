import { defineConfig } from "vite";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default defineConfig({
  resolve: {
    alias: {
      "readable-stream": "vite-compatible-readable-stream",
    },
  },
  optimizeDeps: {
    include: ["stream"],
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()],
    },
  },
  define: {
    global: "window",
  },
});
