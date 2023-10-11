import { defineConfig, normalizePath } from 'vite';
import path from "path";
import { viteStaticCopy } from 'vite-plugin-static-copy';
import imageMin from 'vite-plugin-imagemin';
import handlebars from 'vite-plugin-handlebars';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';


export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  server: {
    open: true,
    host: "0.0.0.0",
    port: "3000",
    hmr: true
  },
  build: {
    minify: isProd,
    sourcemap: isDev,
    emptyOutDir: path.resolve(__dirname, 'dist'),
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js',

        assetFileNames: (assetInfo) => {
          let info = assetInfo.name.split('.')
          let extType = info[info.length - 1]

          if (/png|jpe?g|svg|webp|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'assets/img';
            console.log(assetInfo);
            return `${extType}/[name][extname]`
          } else if (/ttf|woff2|woff/.test(extType)) {
            extType = 'assets/fonts';
            return `${extType}/[name][extname]`
          }

          return '[name][extname]'

        },
      },

      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        succes: path.resolve(__dirname, 'src/succes.html')
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
  plugins: [
    imageMin({
      svgo: {
        plugins: [
          { name: 'RemoveTitle', active: false },
          { name: 'RemoveDescription', active: false },
          { name: 'RemoveViewBox', active: false },
          { name: 'removeDimensions', active: true },
          { name: 'removeScriptElement', active: true },
          { name: 'removeStyleElement', active: true },
        ],
      },
    }),
    handlebars({
      partialDirectory: path.resolve(__dirname, 'src/html'),
      reloadOnPartialChange: true
    }),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, 'src/json/*.json')),
          dest: 'json/'
        },
        {
          src: normalizePath(path.resolve(__dirname, 'src/img/products/**.*')),
          dest: 'assets/img/products/'
        },
        {
          src: normalizePath(path.resolve(__dirname, 'src/favicon/**.*')),
          dest: ''
        },
        {
          src: normalizePath(path.resolve(__dirname, 'src/*.php')),
          dest: ''
        },
        {
          src: normalizePath(path.resolve(__dirname, 'vendor/')),
          dest: ''
        },
      ]
    }),
  ],
});
