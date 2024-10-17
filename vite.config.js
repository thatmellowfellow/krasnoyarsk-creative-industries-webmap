import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        ViteMinifyPlugin(),
        viteStaticCopy({
            targets: [
                {
                    src: "js",
                    dest: "", //means public folder
                },
                {
                    src: "sourcedata",
                    dest: "",
                },
            ],
        }),
    ],
    build: {
        outDir: "dist", //build folder
    },
    publicDir: "public",
    base: "./", //use value from .env or '/' by default,
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler", // or 'modern'
            },
        },
    },
});
