import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ViteMinifyPlugin()],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // or 'modern'
            },
        },
    },
});
