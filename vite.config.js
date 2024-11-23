import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
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
    }),
    VitePWA({
      manifest: {
        name: "魔曰",
        short_name: "Abracadabra",
        id: "abracadabra",
        start_url: ".",
        description: "对文字施以神秘魔法",
        theme_color: "#5753c9",
        icons: [
          //添加图标， 注意路径和图像像素正确
          {
            src: "assets/favicon.png",
            sizes: "1024x1024", //icon大小要与实际icon大小一致
            type: "image/png"
            // form_factor: "handset",
          }
        ]
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,webp,woff2,ttf}"], //缓存相关静态资源
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "wisbayar-images",
              expiration: {
                // 最多30个图
                maxEntries: 30
              }
            }
          },
          {
            urlPattern: /.*\.js.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "wisbayar-js",
              expiration: {
                maxEntries: 30, // 最多缓存30个，超过的按照LRU原则删除
                maxAgeSeconds: 30 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: /.*\.css.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "wisbayar-css",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: /.*\.html.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "wisbayar-html",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60
              },
              cacheableResponse: {
                statuses: [200]
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
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
