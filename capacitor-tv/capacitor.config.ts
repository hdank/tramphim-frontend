import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tramphim.tv',
  appName: 'TramPhimTV',
  // Points to the Astro build output of the parent project
  webDir: '../dist',
  server: {
    // If you use live reload during dev, set url accordingly
    url: 'https://tramphim.com',
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;


