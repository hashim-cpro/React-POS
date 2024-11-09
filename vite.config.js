import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/react-based-POS-system/", //doesn't works when deployed!
  plugins: [react()], // Replace <your-repo-name> with your actual repository name
});
