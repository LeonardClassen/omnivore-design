import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Gallery build. Renders the ACTUAL ui/src React components (not hand-written
// HTML) so we can visually verify the library before the HMI reuses it.
// base = repo name for GitHub Pages project-site asset URLs.
export default defineConfig({
  root: "gallery",
  base: "/omnivore-design/",
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
