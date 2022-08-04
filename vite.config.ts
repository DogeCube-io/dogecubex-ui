import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            // "/api/analytics/": "http://localhost:8080",
            // "/api/engine-status.json": "http://localhost:8080",
            // "/api/token-details.json": "http://localhost:8080",
            "/api/": "https://dogecubex.live",
            // "/api/": "http://localhost:8080",
        }
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },

});
