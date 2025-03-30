import viteLegacyPlugin from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solid from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    solid(),
    tsconfigPaths(),
    viteLegacyPlugin(),
    VitePWA({ registerType: "autoUpdate", manifest: { name: "Redirector", theme_color: "#ffffff" } }),
  ],
});
