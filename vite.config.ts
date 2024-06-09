import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const BASE = process.env.BASE || "";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: BASE,
});
