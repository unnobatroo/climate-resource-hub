import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        career: "career.html",
        research: "research.html",
        education: "education.html",
        invest: "invest.html"
      }
    }
  }
});
