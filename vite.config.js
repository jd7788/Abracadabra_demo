import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 所有以 mdui- 开头的标签名都是 mdui 组件
          isCustomElement: (tag) => tag.startsWith("mdui-")
        }
      }
    })
  ],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      vue: "vue/dist/vue.esm-bundler.js"
    }
  }
});
