import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./setupTests.ts"],
        globals: true,
        css: false,
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    esbuild: {
        jsx: "automatic",
        jsxImportSource: "react",
    },
});
