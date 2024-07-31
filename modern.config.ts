import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';
import { bffPlugin } from '@modern-js/plugin-bff';
import { expressPlugin } from '@modern-js/plugin-express';
import { ssgPlugin } from '@modern-js/plugin-ssg';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  html: {
    disableHtmlFolder: true,
  },
  runtime: {
    router: true,
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
    bffPlugin(),
    expressPlugin(),
    ssgPlugin(),
  ],
});
