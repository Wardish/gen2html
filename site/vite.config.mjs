import { defineConfig, loadEnv } from "vite";
import { globSync } from "glob";
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy';
// import sassGlobImports from 'vite-plugin-sass-glob-import';

// js,css,htmlの出力先をそれぞれに指定するための元のディレクトリの取得するための記述
const jsFiles = Object.fromEntries(
  globSync('src/**/*.js', { ignore: ['node_modules/**','**/modules/**','**/dist/**']}).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

// const scssFiles = Object.fromEntries(
//   globSync('src/assets/styles/pages/**/*.scss', { ignore: ['src/assets/styles/pages/**/_*.scss'] }).map(file => [
//     path.relative(
//       'src',
//       file.slice(0, file.length - path.extname(file).length)
//     ),
//     fileURLToPath(new URL(file, import.meta.url))
//   ])
// );

const htmlFiles = Object.fromEntries(
  globSync('src/**/*.html', { ignore: ['node_modules/**', '**/dist/**'] }).map(file => [
    path.relative(
      'src',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ])
);

const publicFiles = Object.fromEntries(
  globSync('public/**/*').map(file => { console.log(file); return [
    path.relative(
      'public',
      file.slice(0, file.length - path.extname(file).length)
    ),
    fileURLToPath(new URL(file, import.meta.url))
  ]})
);

const inputObject = { 
  // ...scssFiles,
  ...jsFiles,
  ...htmlFiles,
  // ...publicFiles,
};

export default defineConfig({
  // srcディレクトリをrootにする指定
  root: "src",
  publicDir: 'public',
  // ビルド設定
  build: {
      // ビルド出力先はdist
      outDir: resolve(__dirname, "dist"),
      // 中身が空のファイルでも出力する
      emptyOutDir: true,
      // js,css,htmlの出力先をそれぞれに指定
      rollupOptions: {
        // 出力元のファイル
        input: inputObject,
        // 出力先のファイル名指定
        output: {
          // entryFileNames: `[name].js`,
          // chunkFileNames: `[name].js`,
          // assetFileNames: (assetInfo) => {
          //   // if (/^public/.test(assetInfo.path)) {
          //   //   return '[name].[ext]'
          //   // }
          //   // if (/\.( gif|jpeg|jpg|png|svg|webp| )$/.test(assetInfo.name)) {
          //   //   return 'assets/img/[name].[ext]';
          //   // }
          //   if (/\.css$/.test(assetInfo.name)) {
          //     return 'assets/css/[name].[ext]';
          //   }
          //   return '[name].[ext]';
          // }
        },
      }
  },
  // 使用するプラグインの記述
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '../public/*',
          dest: '',
        }
      ]
    })
    // sassGlobImports()
  ],
})
