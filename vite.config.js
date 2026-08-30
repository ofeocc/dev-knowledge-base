import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import copySharedPlugin from './vite-copy-shared.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // 项目根目录为当前目录
  root: '.',
  // 使用相对路径，支持部署到任意子路径
  base: './',
  plugins: [copySharedPlugin()],
  build: {
    // 构建输出目录
    outDir: 'dist',
    // 禁用源映射，避免 Vite 追加畸形 sourceMappingURL 导致 SyntaxError
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'dev-knowledge-base.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    // 开发服务器也禁用源映射中间件
    sourcemapIgnoreList: () => true,
  },
});
