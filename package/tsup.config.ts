import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/chain.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["next", "react"],
});
