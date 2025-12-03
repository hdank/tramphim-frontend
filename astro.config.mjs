import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";
import compress from "astro-compress";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),

  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false,
      },
    },
    // Allow external image domains for optimization
    remotePatterns: [
      {
        protocol: 'https',
      },
      {
        protocol: 'http',
      },
    ],
  },

  integrations: [
    
    tailwind(),
    react(),
    compress({
      html: true,
      css: true,
      js: true,
      svg: true,
      img: true,
    }),
  ],

  server: {
    port: 4555,
    host: true,
  },
});
