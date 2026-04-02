import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { twssVitePlugin } from "tailwind-style-sheets/vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), twssVitePlugin()],
});
