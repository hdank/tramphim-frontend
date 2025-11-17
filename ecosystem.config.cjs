module.exports = {
  apps: [
    {
      name: "uiphim",
      script: "./dist/server/entry.mjs",
      instances: 1,                   // <-- ISR chỉ hoạt động khi RUN 1 INSTANCE
      exec_mode: "fork",              // <-- Không dùng cluster mode
      node_args: "--max-old-space-size=1536",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 4445,                   // <-- Đây là port SSR của Astro
      },
    },
  ],
};
