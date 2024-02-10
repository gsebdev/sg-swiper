import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/sg-swiper.ts"],
  format: ["cjs", "esm"], 
  dts: true, 
  splitting: false,
  sourcemap: true,
  clean: true,
});