import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tramphim.app',
  appName: 'TramPhim',
  webDir: 'dist',
  server: {
    // TODO: Replace with your actual deployed URL
    url: 'https://your-tramphim-website.com',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
