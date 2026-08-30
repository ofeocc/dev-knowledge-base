/**
 * Vite 插件: 构建时复制 _shared/ 目录和 assets/*.js 到 dist/
 *
 * 原因: Vite 默认仅打包 HTML 中通过 import/引用关系追踪到的资源。
 * _shared/ 下的字体文件和第三方 JS 库 (echarts.min.js)
 * 由 HTML/CSS 以相对路径直接引用，Vite 不会自动复制到输出目录。
 * 同理，assets/ 下的非 module 脚本 (app.js / data.js 等) 也不会被复制。
 * 因此需要一个自定义插件在构建完成后将它们拷贝到 dist/。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function copySharedPlugin() {
  return {
    name: 'copy-shared',
    apply: 'build', // 仅在 build 时生效，dev 时 Vite 直接从源目录提供文件
    closeBundle() {
      // 1. 复制 _shared/ 目录 (字体 + 第三方 JS 库)
      const sharedSrc = path.resolve(__dirname, '_shared');
      const sharedDest = path.resolve(__dirname, 'dist', '_shared');

      if (fs.existsSync(sharedSrc)) {
        fs.cpSync(sharedSrc, sharedDest, { recursive: true });
        console.log('[copy-shared] 已复制 _shared/ -> dist/_shared/');
      } else {
        console.warn('[copy-shared] 警告: _shared/ 目录不存在，跳过复制');
      }

      // 2. 复制 assets/*.js (非 module 脚本，Vite 不会自动打包)
      const assetsDir = path.resolve(__dirname, 'assets');
      const destAssetsDir = path.resolve(__dirname, 'dist', 'assets');

      if (fs.existsSync(assetsDir)) {
        if (!fs.existsSync(destAssetsDir)) {
          fs.mkdirSync(destAssetsDir, { recursive: true });
        }
        const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
        for (const file of jsFiles) {
          fs.copyFileSync(path.join(assetsDir, file), path.join(destAssetsDir, file));
        }
        if (jsFiles.length > 0) {
          console.log(`[copy-shared] 已复制 ${jsFiles.length} 个 JS 文件 -> dist/assets/`);
        }
      }

      // 3. 复制 PWA 相关文件 (sw.js, manifest.json)
      const pwaFiles = ['sw.js', 'manifest.json'];
      for (const file of pwaFiles) {
        const src = path.resolve(__dirname, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.resolve(__dirname, 'dist', file));
          console.log(`[copy-shared] 已复制 ${file} -> dist/${file}`);
        }
      }
    },
  };
}
