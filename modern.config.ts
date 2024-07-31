import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import { ssgPlugin } from '@modern-js/plugin-ssg';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  source: {
    entries: {
      index: {
        entry: './src/App.tsx',
      },
    },
    disableDefaultEntries: true,
  },
  html: {
    disableHtmlFolder: true,
  },
  runtime: {
    router: false,
  },
  output: {
    distPath: {
      html: '',
    },
    assetPrefix: './',
    ssg: true,
  },
  plugins: [
    appTools({
      bundler: 'experimental-rspack',
    }),
    tailwindcssPlugin(),
    ssgPlugin(),
  ],
});
