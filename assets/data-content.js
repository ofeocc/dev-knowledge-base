// ============================================================
// 内容覆盖层 —— 给常用框架/工具补充「是什么/适合谁」+「怎么上手」
//
// 加载顺序：data.js -> data-ext.js -> data-content.js -> app.js
// 键为条目 name（跨分类通用）；renderDetailBody 会把 {scenario, snippet}
// 合并进对应条目。场景文本面向新手，说明「这是什么、用来做什么、适合谁」。
// 修改只需在这里追加条目，无需改任何渲染代码。
// ============================================================
window.KB_CONTENT = {
  // ===== 前端 =====
  'React': { scenario:'一个用来「搭网页界面」的 JS 库，组件化、生态最大。适合几乎所有前端项目。', snippet:'npm create vite@latest my-app -- --template react\ncd my-app && npm install && npm run dev' },
  'Vue.js': { scenario:'渐进式前端框架，模板语法简单好上手。适合中小项目、想快速上手的开发者。', snippet:'npm create vue@latest my-app\ncd my-app && npm install && npm run dev' },
  'Svelte': { scenario:'编译时前端框架，把代码编译成极小的原生 JS，速度快、写起来简洁。', snippet:'npm create vite@latest my-app -- --template svelte\ncd my-app && npm install && npm run dev' },
  'Astro': { scenario:'内容驱动的静态站点框架（Islands 架构），默认零 JS，适合博客 / 文档 / 内容站。', snippet:'npm create astro@latest my-app\ncd my-app && npm install && npm run dev' },
  'Next.js': { scenario:'React 的全栈元框架，自带 SSR / 文件路由，能做一个完整网站（前端+后端）。', snippet:'npx create-next-app@latest my-app\ncd my-app && npm run dev' },
  'Nuxt': { scenario:'Vue 的全栈元框架（类比 Next.js 之于 React），服务端渲染、目录路由开箱即用。', snippet:'npx nuxi init my-app\ncd my-app && npm install && npm run dev' },
  'Qwik': { scenario:'主打「可恢复」的框架，首屏几乎零 JS，追求极致加载速度。', snippet:'npm create qwik@latest my-app\ncd my-app && npm install && npm run dev' },
  'SolidJS': { scenario:'细粒度响应式框架，JSX 写法、性能极高。适合追求极致性能、熟悉 JSX 的人。', snippet:'npm create vite@latest my-app -- --template solid\ncd my-app && npm install && npm run dev' },
  'Angular': { scenario:'企业级全功能框架，依赖注入 + 强 TS，自带路由/表单。适合大型团队/项目。', snippet:'npx @angular/cli new my-app\nnpm start' },
  'Preact': { scenario:'约 3KB 的 React 兼容迷你版。适合对体积敏感、又想用 React API 的场景。', snippet:'npm create vite@latest my-app -- --template preact\ncd my-app && npm install' },
  'Lit': { scenario:'基于 Web Components 标准，可跨框架复用。适合做组件库 / 自定义元素。', snippet:'npm i lit\n// my-el.js: import { LitElement } from "lit"' },
  'Tailwind CSS': { scenario:'原子化 CSS 框架，用 class 写在 HTML 里排样式，基本免手写 CSS。', snippet:'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p' },
  'Vite': { scenario:'极快的构建 / 打包工具（开发秒开）。React/Vue/Svelte 项目默认都用它。', snippet:'npm create vite@latest my-app\ncd my-app && npm install && npm run dev' },
  'Zustand': { scenario:'轻量的 React 状态管理库，API 极简、体积小。适合中小型 React 项目。', snippet:'npm i zustand' },

  // ===== 后端 =====
  'Express': { scenario:'Node.js 最经典 Web 框架，极简灵活。适合快速实现 HTTP 接口 / 中间件。', snippet:'npm init -y && npm install express\nnode server.js' },
  'Fastify': { scenario:'Node.js 高性能 Web 框架，比 Express 更快、支持 Schema 校验。', snippet:'npm i fastify\nnode server.js' },
  'NestJS': { scenario:'企业级 TS 后端框架，模块化 + 依赖注入。适合团队大项目的接口 / 微服务。', snippet:'npm i -g @nestjs/cli && nest new my-app\nnpm run start:dev' },
  'Hono': { scenario:'Web 标准原生、超轻量、多运行时（Node/Edge/Bun）。适合边缘 / Serverless API。', snippet:'npm i hono\nnode server.js' },
  'FastAPI': { scenario:'Python 高性能 API 框架，自动生成文档 + 类型校验。AI / ML 后端首选。', snippet:'pip install "fastapi[standard]"\nuvicorn main:app --reload' },
  'Django': { scenario:'「大而全」的 Python 全栈框架，自带 ORM / Admin / 安全。适合快速做完整站点。', snippet:'pip install django\npython -m django startproject mysite' },
  'Flask': { scenario:'Python 极简微框架，自由灵活。适合小接口、原型、ML 服务。', snippet:'pip install flask\npython app.py' },
  'Gin': { scenario:'Go 的高性能 Web 框架，速度快、内存省。适合高并发后端。', snippet:'go mod init myapp && go get github.com/gin-gonic/gin' },
  'Laravel': { scenario:'PHP 最流行的全栈框架，生态全（ORM/鉴权/队列）。适合 PHP 团队做完整应用。', snippet:'composer create-project laravel/laravel my-app\nphp artisan serve' },
  'Spring Boot': { scenario:'Java 企业级后端框架，约定大于配置、生态成熟。适合大型企业应用。', snippet:'curl -s https://start.spring.io/starter.zip | unzip\n./mvnw spring-boot:run' },
  'Prisma': { scenario:'Node.js / TS 的数据库 ORM，类型安全、迁移方便。适合 TS 项目访问数据库。', snippet:'npm i prisma @prisma/client\nnpx prisma init' },

  // ===== 数据可视化 =====
  'ECharts': { scenario:'国内用得最多的数据可视化图表库，把数据一行代码渲染成图表。', snippet:'npm i echarts\nimport * as echarts from "echarts"' },
  'D3.js': { scenario:'底层数据可视化库，自由度和性能最高，但上手较难。适合定制可视化。', snippet:'npm i d3' },
  'Three.js': { scenario:'3D / WebGL 渲染库，在网页里做 3D 场景 / 模型。', snippet:'npm i three' },
  'Chart.js': { scenario:'轻量好用的图表库，几行代码画出常见图表。', snippet:'npm i chart.js' },
  'Recharts': { scenario:'React 声明式图表库，组件化写图表。', snippet:'npm i recharts' },

  // ===== DevOps =====
  'Docker': { scenario:'把应用连同依赖打包成镜像，实现「一次构建、到处运行」。', snippet:'docker build -t myapp .\ndocker run -d -p 3000:3000 myapp' }
};
