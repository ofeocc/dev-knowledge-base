// ============================================================
// 扩展数据模块 — AI 大模型评测 / DevOps 教程 / 学习路径 / AI 术语百科
// 数据截至 2026-07-23，AI 模型数据每日更新
// ============================================================

// ===== AI 大模型评测（2026.7 最新）=====
KB_DATA.aiModels = [
  {
    name: 'GPT-5.6 Sol', vendor: 'OpenAI', tier: '超旗舰', type: '闭源', or: 'openai/gpt-5.6-luna-pro',
    releaseDate: '2026-07-09', params: '—', context: '1M Token',
    scores: { reasoning: 10, coding: 10, agent: 10, multimodal: 9, cost: 3, speed: 7, open: 0 },
    benchmarks: [
      { name: 'SWE-bench Verified', score: '88.7%' },
      { name: 'TAU2-Bench 工具调用', score: '98.7%' },
      { name: 'Artificial Analysis 指数', score: '第 1' }
    ],
    price: { input: '$10/M', output: '$80/M' },
    pros: ['综合能力全球第一', '推理与工具调用天花板', 'Codex Agent 底座，生态最完善'],
    cons: ['价格昂贵（输出 $80/M）', '闭源不可私有化', '国内访问受限'],
    positioning: '全能主力，工程自动化首选',
    source: 'https://openai.com/index/gpt-5/',
    updated: '2026-07-23'
  },
  {
    name: 'Claude Fable 5', vendor: 'Anthropic', tier: '超旗舰', type: '闭源', or: 'anthropic/claude-fable-5',
    releaseDate: '2026-07-20', params: '—', context: '2M Token',
    scores: { reasoning: 10, coding: 10, agent: 10, multimodal: 8, cost: 4, speed: 7, open: 0 },
    benchmarks: [
      { name: 'SWE-bench Verified', score: '88.6%' },
      { name: 'OSWorld 自主任务', score: '72.7%' },
      { name: 'Intelligence Index', score: '60（全球第 1）' }
    ],
    price: { input: '$10/M', output: '$50/M' },
    pros: ['长上下文之王（2M Token）', '逻辑推理与架构评审最强', '长周期自主任务能力顶尖'],
    cons: ['价格较高', '闭源', '多模态弱于 Gemini'],
    positioning: '架构设计、代码审计、大项目重构',
    source: 'https://www.anthropic.com/news',
    updated: '2026-07-23'
  },
  {
    name: 'Gemini 3.1 Pro', vendor: 'Google', tier: '主力旗舰', type: '闭源', or: 'google/gemini-3-pro',
    releaseDate: '2026-02-19', params: '—', context: '2M Token',
    scores: { reasoning: 9, coding: 8, agent: 9, multimodal: 10, cost: 7, speed: 8, open: 0 },
    benchmarks: [
      { name: 'SWE-bench', score: '80.6%' },
      { name: 'ARC-AGI-2', score: '77.1%' },
      { name: '多模态综合', score: '全球第 1' }
    ],
    price: { input: '$2/M', output: '$12/M' },
    pros: ['多模态全球第一（视频/音频/图像）', '跨 MCP 工具协调最强', '长上下文 2M Token'],
    cons: ['代码能力略逊 GPT/Claude', '闭源', '国内访问受限'],
    positioning: '多模态应用、AI 原生产品、算法研发',
    source: 'https://deepmind.google/technologies/gemini/',
    updated: '2026-07-23'
  },
  {
    name: 'Kimi K3', vendor: '月之暗面', tier: '国产超旗舰', type: '开源', or: 'moonshotai/kimi-k3',
    releaseDate: '2026-07-16', params: '2.8T (MoE)', context: '100万 Token',
    scores: { reasoning: 9, coding: 10, agent: 9, multimodal: 7, cost: 8, speed: 7, open: 10 },
    benchmarks: [
      { name: 'Frontend Code Arena', score: '1679 分（全球第 1）' },
      { name: '前端开发 6 项指标', score: '全部登顶' },
      { name: '综合编程', score: '比肩 GPT-5.5' }
    ],
    price: { input: '¥3/M', output: '¥15/M（高峰）' },
    pros: ['前端编程全球第一', '2.8 万亿参数全球最大开源模型', 'API 价格仅海外旗舰 60%', '7.27 完整开源'],
    cons: ['多模态能力待加强', '开源生态尚在建设中'],
    positioning: '前端团队、企业级私有化、高端开发',
    source: 'https://kimi.moonshot.cn/',
    updated: '2026-07-23'
  },
  {
    name: 'DeepSeek V4 Pro', vendor: '深度求索', tier: '国产超旗舰', type: '开源', or: 'deepseek/deepseek-v4-pro-0813',
    releaseDate: '2026-07-21', params: '1.6T (MoE, 激活49B)', context: '100万 Token',
    scores: { reasoning: 9, coding: 9, agent: 8, multimodal: 7, cost: 10, speed: 8, open: 10 },
    benchmarks: [
      { name: 'SWE-bench', score: '59.5%（超 GPT-5.5 的 58.4%）' },
      { name: '后端工程代码', score: '开源最强' },
      { name: '数学推理', score: '顶尖' }
    ],
    price: { input: '¥4/M（高峰）', output: '¥12/M（高峰）/ ¥6/M（低谷）' },
    pros: ['行业首创峰谷分时计费', '低谷价仅高峰一半', 'MIT 开源', '后端代码能力接近海外旗舰'],
    cons: ['多模态待加强', '品牌知名度低于头部'],
    positioning: '日常业务编码主力、批量处理、私有化',
    source: 'https://www.deepseek.com/',
    updated: '2026-07-23'
  },
  {
    name: 'Qwen3.8-Max', vendor: '阿里通义', tier: '国产主力旗舰', type: '即将开源', or: 'qwen/qwen3.8-27b',
    releaseDate: '2026-07-19', params: '2.4T', context: '128K Token',
    scores: { reasoning: 9, coding: 9, agent: 8, multimodal: 8, cost: 8, speed: 8, open: 9 },
    benchmarks: [
      { name: 'Qwen3-Coder HumanEval', score: '91.6%' },
      { name: '多语言支持', score: '全球顶级' }
    ],
    price: { input: '暂未公布', output: '暂未公布' },
    pros: ['阿里云生态全打通', '企业服务成熟', '开源生态全球顶级', '全尺寸覆盖（0.8B~397B）'],
    cons: ['正式价格未公布', '预览版稳定性待验证'],
    positioning: '企业级应用、全场景私有化、边缘部署',
    source: 'https://qwenlm.ai/',
    updated: '2026-07-23'
  },
  {
    name: 'GLM-5.2', vendor: '智谱 AI', tier: '国产主力旗舰', type: '开源', or: 'z-ai/glm-5.3',
    releaseDate: '2026-06-15', params: '745B (MoE, 激活40B)', context: '100万 Token',
    scores: { reasoning: 8, coding: 8, agent: 9, multimodal: 7, cost: 9, speed: 8, open: 10 },
    benchmarks: [
      { name: 'SWE-bench', score: '77.8%（开源最高）' },
      { name: 'AA Index', score: '51（开源综合第 1）' },
      { name: '长程 Agent 工程', score: '优化好' }
    ],
    price: { input: '¥2/M', output: '¥10/M' },
    pros: ['开源综合评分第一', 'MIT 协议完全开源', '长上下文 Agent 优化好', '智谱生态完善'],
    cons: ['多模态待加强', '参数规模小于 Kimi K3'],
    positioning: '企业知识库、长文档处理、Agent 应用',
    source: 'https://www.zhipuai.cn/',
    updated: '2026-07-23'
  },
  {
    name: '豆包 Seed 2.0 Pro', vendor: '字节跳动', tier: '国产主力旗舰', type: '闭源',
    releaseDate: '2026-02-14', params: '—', context: '128K Token',
    scores: { reasoning: 8, coding: 7, agent: 8, multimodal: 9, cost: 10, speed: 9, open: 0 },
    benchmarks: [
      { name: '中文理解准确率', score: '76.5%' },
      { name: '多模态', score: '国内顶尖' }
    ],
    price: { input: '¥0.5/M', output: '¥2-5/M' },
    pros: ['中文理解一流', '多模态国内顶尖', 'Coze/Trae 全链路打通', '国内开发者体验最流畅', '价格极低'],
    cons: ['闭源', '代码能力略逊', '海外生态弱'],
    positioning: '中文场景、产品文档、Coze/Trae 生态',
    source: 'https://www.volcengine.com/product/doubao',
    updated: '2026-07-23'
  }
];

// ===== AI 选型建议方案 =====
KB_DATA.aiSolutions = [
  {
    name: '方案 A：海外无限制 + 追求极致效率',
    target: '可自由访问海外的开发者',
    stack: [
      { role: '核心架构、代码审计', model: 'Claude Fable 5', reason: '长上下文+架构评审最强' },
      { role: '工程编码、自动化执行', model: 'GPT-5.6 Sol + Codex Agent', reason: '工具调用天花板' },
      { role: '前端页面开发', model: 'Kimi K3', reason: '前端能力反超海外' },
      { role: '批量杂活、简单脚本', model: 'Claude Sonnet 5 / GPT-5.4 nano', reason: '低价高效' }
    ]
  },
  {
    name: '方案 B：国内合规开发（推荐）',
    target: '绝大多数国内开发者',
    stack: [
      { role: '日常业务编码主力', model: 'DeepSeek V4 Pro', reason: '低谷时段调用成本减半' },
      { role: '前端专项开发', model: 'Kimi K3', reason: '前端还原、组件开发全球第一' },
      { role: '中文需求、产品文档', model: '豆包 Seed 2.0 Pro', reason: 'Coze/Trae 体验最流畅' },
      { role: '私有化部署、内网项目', model: 'Qwen3.5 / DeepSeek V4 开源版', reason: '7B/14B 单卡可跑' }
    ]
  },
  {
    name: '方案 C：极致成本控制',
    target: '个人开发者 / 小团队',
    stack: [
      { role: '90% 场景（CRUD、脚本、文档）', model: 'DeepSeek V4-Flash', reason: '¥2/M Token，成本可忽略' },
      { role: '10% 复杂架构、疑难 Debug', model: 'DeepSeek V4 Pro（低谷时段）', reason: '¥6/M Token' }
    ],
    note: '整体成本仅 GPT 的 1/50，能力差距已缩小到可接受范围'
  }
];

// ===== DevOps / 团队协作教程 =====
KB_DATA.devopsTutorials = [
  {
    name: 'Git', cat: '版本控制', icon: 'git',
    desc: '分布式版本控制系统，团队协作的基石。记录代码每次变更，支持分支、合并、回溯，让多人协作开发井然有序。',
    tutorial: [
      { step: '1. 初始化仓库', cmd: 'git init', desc: '在当前目录创建 Git 仓库' },
      { step: '2. 克隆远程仓库', cmd: 'git clone <url>', desc: '从远程拉取完整仓库到本地' },
      { step: '3. 查看状态', cmd: 'git status', desc: '查看工作区与暂存区的差异' },
      { step: '4. 暂存更改', cmd: 'git add . (全部) / git add <file> (指定)', desc: '将修改加入暂存区' },
      { step: '5. 提交更改', cmd: 'git commit -m "feat: 新增用户登录功能"', desc: '将暂存区内容提交到本地仓库' },
      { step: '6. 推送到远程', cmd: 'git push origin main', desc: '将本地提交推送到远程仓库' },
      { step: '7. 拉取更新', cmd: 'git pull origin main', desc: '拉取远程最新代码并合并' },
      { step: '8. 创建分支', cmd: 'git checkout -b feature/login', desc: '创建并切换到新分支' },
      { step: '9. 合并分支', cmd: 'git merge feature/login', desc: '将指定分支合并到当前分支' },
      { step: '10. 查看历史', cmd: 'git log --oneline --graph', desc: '以图形化方式查看提交历史' }
    ],
    pros: ['分布式架构，离线可用', '分支模型灵活，支持各种工作流', '社区生态最庞大，教程资源丰富', '与 GitHub/GitLab 深度集成'],
    cons: ['学习曲线较陡（rebase、cherry-pick 等进阶操作）', '合并冲突处理复杂', '大文件/二进制文件处理较弱（需 Git LFS）'],
    bestPractices: [
      '提交粒度小而频繁，每次提交只做一件事',
      '使用 Conventional Commits 规范（feat/fix/docs/refactor/...）',
      '主分支保持可发布状态，功能开发用 feature 分支',
      '配置 .gitignore 忽略 node_modules、.env 等文件',
      'PR 合并前必须 Code Review'
    ],
    source: 'https://git-scm.com/book/zh/v2'
  },
  {
    name: 'Docker', cat: '容器化', icon: 'docker',
    desc: '容器化平台，将应用及其依赖打包成标准化容器，实现"一次构建，到处运行"。彻底解决"在我机器上能跑"的问题。',
    tutorial: [
      { step: '1. 编写 Dockerfile', cmd: '# 基础镜像\nFROM node:20-alpine\n# 工作目录\nWORKDIR /app\n# 复制依赖文件\nCOPY package*.json ./\n# 安装依赖\nRUN npm ci --production\n# 复制源码\nCOPY . .\n# 构建产物\nRUN npm run build\n# 暴露端口\nEXPOSE 3000\n# 启动命令\nCMD ["node", "dist/main.js"]', desc: '在项目根目录创建 Dockerfile' },
      { step: '2. 构建镜像', cmd: 'docker build -t myapp:latest .', desc: '根据 Dockerfile 构建镜像' },
      { step: '3. 运行容器', cmd: 'docker run -d -p 3000:3000 --name myapp myapp:latest', desc: '后台运行容器并映射端口' },
      { step: '4. 查看运行容器', cmd: 'docker ps', desc: '列出正在运行的容器' },
      { step: '5. 查看日志', cmd: 'docker logs -f myapp', desc: '实时查看容器日志' },
      { step: '6. 进入容器', cmd: 'docker exec -it myapp sh', desc: '进入运行中的容器执行命令' },
      { step: '7. 多阶段构建（优化镜像大小）', cmd: '# 构建阶段\nFROM node:20 AS builder\nWORKDIR /app\nCOPY . .\nRUN npm ci && npm run build\n\n# 运行阶段（仅包含产物）\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nCMD ["node", "dist/main.js"]', desc: '多阶段构建可减小镜像 70%+ 体积' },
      { step: '8. Docker Compose 编排', cmd: '# docker-compose.yml\nversion: "3.9"\nservices:\n  web:\n    build: .\n    ports: ["3000:3000"]\n    depends_on: [db]\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD: secret\n    volumes: ["dbdata:/var/lib/postgresql/data"]\nvolumes:\n  dbdata:', desc: '用 Compose 一键启动多容器应用' },
      { step: '9. 启动编排', cmd: 'docker compose up -d', desc: '后台启动所有服务' },
      { step: '10. 清理资源', cmd: 'docker system prune -a', desc: '清理未使用的镜像、容器、网络' }
    ],
    pros: ['环境一致性，消除"在我机器上能跑"问题', '秒级启动，比虚拟机轻量百倍', '镜像分层缓存，构建高效', '生态完善（Docker Hub 百万级镜像）'],
    cons: ['有一定学习成本（Dockerfile、网络、卷）', 'Windows/Mac 上需运行在虚拟机中（性能损耗）', '不适合 GUI 应用', '数据持久化需额外管理 Volumes'],
    bestPractices: [
      '使用 .dockerignore 排除 node_modules、.git 等',
      '使用多阶段构建减小镜像体积',
      '使用 Alpine 基础镜像（仅 5MB）',
      '不要在镜像中存储密钥/密码，用环境变量传入',
      '一个容器只运行一个进程'
    ],
    source: 'https://docs.docker.com/get-started/'
  },
  {
    name: 'CI/CD', cat: '持续集成/部署', icon: 'cicd',
    desc: 'Continuous Integration / Continuous Deployment，代码提交后自动构建、测试、部署的工程实践。让发布从"手动煎熬"变成"自动流水线"。',
    tutorial: [
      { step: '1. GitHub Actions 工作流文件', cmd: '# .github/workflows/ci.yml\nname: CI/CD\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 20\n          cache: npm\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run test:unit\n      - run: npm run build\n\n  deploy:\n    needs: test\n    if: github.ref == "refs/heads/main"\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Deploy to Vercel\n        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}', desc: '在 .github/workflows/ 下创建 YAML 工作流' },
      { step: '2. 触发条件', cmd: 'on:\n  push:\n    branches: [main]\n    paths: ["src/**"]\n  schedule:\n    - cron: "0 2 * * *"', desc: '配置 push/PR/定时触发' },
      { step: '3. 缓存依赖', cmd: '- uses: actions/setup-node@v4\n  with:\n    node-version: 20\n    cache: npm', desc: '缓存 node_modules 加速构建' },
      { step: '4. 矩阵测试', cmd: 'strategy:\n  matrix:\n    node-version: [18, 20, 22]\n    os: [ubuntu-latest, windows-latest]', desc: '多版本/多系统并行测试' },
      { step: '5. 条件部署', cmd: 'if: github.ref == "refs/heads/main" && needs.test.result == "success"', desc: '仅 main 分支测试通过后部署' }
    ],
    pros: ['自动化构建测试，尽早发现 Bug', '部署流程标准化，减少人为错误', '支持回滚，发布风险可控', '与 Git 工作流无缝集成'],
    cons: ['初始配置有一定工作量', '复杂流水线调试困难', '免费额度有限（GitHub Actions 私有仓库）', '密钥管理需格外小心'],
    bestPractices: [
      'PR 必须通过 CI 才能合并',
      '区分 staging/production 环境，逐步发布',
      '使用 Secrets 存储敏感信息，不要硬编码',
      '缓存依赖加速构建',
      '部署后自动运行冒烟测试验证'
    ],
    source: 'https://docs.github.com/en/actions'
  },
  {
    name: 'Code Review', cat: '代码审查', icon: 'review',
    desc: '团队协作中最重要的质量保障环节。通过同行审查代码，发现潜在问题、分享知识、保持代码风格一致。',
    tutorial: [
      { step: '1. Conventional Commits 规范', cmd: 'feat: 新增用户登录功能\nfix: 修复支付金额计算错误\ndocs: 更新 API 文档\nrefactor: 重构状态管理逻辑\ntest: 新增订单模块单元测试\nchore: 升级依赖版本\nBREAKING CHANGE: 用户接口返回格式变更', desc: '标准化提交信息，自动生成 changelog' },
      { step: '2. 创建 Pull Request', cmd: 'git push origin feature/login\n# 在 GitHub/GitLab 上创建 PR\ntitle: feat: 新增用户登录功能\nbody: |\n  ## 变更内容\n  - 新增登录页面\n  - 接入 JWT 认证\n  ## 测试\n  - [x] 单元测试通过\n  - [x] 手动测试通过', desc: 'PR 标题和描述要清晰' },
      { step: '3. Review 检查清单', cmd: '□ 命名是否清晰有意义\n□ 是否有明显的 Bug\n□ 是否处理了边界情况\n□ 是否有安全漏洞（SQL 注入、XSS）\n□ 是否有足够的测试覆盖\n□ 是否符合项目代码风格\n□ 是否有性能问题\n□ 是否有硬编码的密钥/密码', desc: '逐项检查，确保代码质量' },
      { step: '4. 评审沟通原则', cmd: '✅ 对事不对人："这里可以考虑用 Map 代替数组"\n❌ 不要攻击："这代码写得什么垃圾"\n✅ 提供建议："建议提取为公共组件"\n❌ 不要命令："改掉这个"\n✅ 称赞好的实践："这个抽象很优雅"', desc: '建设性反馈，保持团队和谐' }
    ],
    pros: ['尽早发现 Bug，降低修复成本', '知识共享，团队成员互相学习', '保持代码风格和质量一致', '提升团队整体技术水平'],
    cons: ['耗时，可能成为瓶颈', '评审质量依赖审查者水平', '可能引发团队冲突', '紧急修复时流程摩擦'],
    bestPractices: [
      'PR 控制在 400 行以内，太大难以有效审查',
      '至少 1 人 Approve 才能合并',
      '评审应在 24 小时内响应',
      '使用 CODEOWNERS 自动分配审查者',
      '对事不对人，建设性反馈'
    ],
    source: 'https://docs.github.com/en/pull-requests'
  },
  {
    name: 'Testing', cat: '测试策略', icon: 'test',
    desc: '质量保障的核心工程实践。从单元测试到端到端测试，构建多层次测试体系，确保代码可靠、可维护、可重构。',
    tutorial: [
      { step: '1. 测试金字塔', cmd: '        /\\ E2E（少量）\n       /  \\  完整用户流程\n      /----\\\n     / 集成 \\\\  模块间交互\n    / 测试   \\\\  （适量）\n   /----------\\\n  /  单元测试  \\  函数/组件级\n /              \\  （大量）\n/________________\\', desc: '底层多、顶层少，成本递增、速度递减' },
      { step: '2. 单元测试（Vitest）', cmd: '// math.test.ts\nimport { describe, it, expect } from "vitest"\nimport { add, divide } from "./math"\n\ndescribe("add", () => {\n  it("1 + 2 = 3", () => {\n    expect(add(1, 2)).toBe(3)\n  })\n  it("处理负数", () => {\n    expect(add(-1, -2)).toBe(-3)\n  })\n})\n\ndescribe("divide", () => {\n  it("除以 0 抛出错误", () => {\n    expect(() => divide(1, 0)).toThrow("除数不能为 0")\n  })\n})', desc: '测试最小可测试单元' },
      { step: '3. 组件测试（Testing Library）', cmd: '// Button.test.tsx\nimport { render, screen } from "@testing-library/react"\nimport userEvent from "@testing-library/user-event"\nimport { Button } from "./Button"\n\nit("点击触发 onClick", async () => {\n  const onClick = vi.fn()\n  render(<Button onClick={onClick}>提交</Button>)\n  await userEvent.click(screen.getByText("提交"))\n  expect(onClick).toHaveBeenCalledOnce()\n})', desc: '测试组件交互行为' },
      { step: '4. E2E 测试（Playwright）', cmd: '// e2e/login.spec.ts\nimport { test, expect } from "@playwright/test"\n\ntest("用户登录流程", async ({ page }) => {\n  await page.goto("/login")\n  await page.fill("[data-testid=email]", "user@test.com")\n  await page.fill("[data-testid=password]", "pass123")\n  await page.click("[data-testid=submit]")\n  await expect(page).toHaveURL("/dashboard")\n  await expect(page.locator("h1")).toContainText("欢迎")\n})', desc: '模拟真实用户操作' },
      { step: '5. Mock vs Real', cmd: '// Mock 外部 API\nvi.mock("@/api/user", () => ({\n  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "测试用户" })\n}))\n\n// MSW 拦截网络请求\nimport { http, HttpResponse } from "msw"\nexport const handlers = [\n  http.get("/api/user", () => HttpResponse.json({ name: "Mock 用户" }))\n]', desc: '单元测试用 Mock，集成测试可用 MSW' }
    ],
    pros: ['重构有底气，不怕改坏', 'Bug 早发现早修复成本低', '测试即文档，说明代码预期行为', 'TDD 驱动更好的代码设计'],
    cons: ['编写测试增加开发时间', '维护测试有成本', '测试代码本身也可能有 Bug', '过度 Mock 导致测试失去意义'],
    bestPractices: [
      '核心业务逻辑必须有单元测试',
      '测试覆盖率 70-80% 为佳，不盲目追 100%',
      '测试Arrange-Act-Assert 三段式结构',
      '每个测试只验证一个行为',
      'E2E 测试保持精简，只覆盖关键路径'
    ],
    source: 'https://vitest.dev/guide/'
  },
  {
    name: 'Node.js / npm', cat: '环境搭建', icon: 'node',
    desc: 'Node.js 是运行 JS 的后端运行时；npm 是它的包管理器。从初始化项目到装依赖、写脚本、读环境变量全靠它，是 JS 开发的地基。',
    tutorial: [
      { step: '1. 初始化项目', cmd: 'npm init -y\n# 生成 package.json（可再手动改 name / scripts）', desc: '创建项目入口 package.json' },
      { step: '2. 安装依赖', cmd: 'npm install express          # 运行时依赖\nnpm install -D typescript    # 开发依赖(-D)\nnpm install -g pnpm          # 全局(-g)', desc: '分清运行时依赖和开发依赖' },
      { step: '3. 常用脚本', cmd: '"scripts": {\n  "dev": "node server.js",\n  "build": "tsc",\n  "start": "node dist/server.js"\n}\n# 运行：npm run dev', desc: '把常用命令写进 scripts，一行启动' },
      { step: '4. 读取环境变量', cmd: 'npm install dotenv\n# .env\nPORT=3000\nDB_URL=postgres://user:pass@localhost:5432/db\n# server.js\nrequire("dotenv").config()\nconsole.log(process.env.PORT)', desc: '.env 放密钥，用 dotenv 读取；.env 必须加入 .gitignore' },
      { step: '5. TypeScript 起步', cmd: 'npm i -D typescript @types/node\nnpx tsc --init      # 生成 tsconfig.json，开 strict\nnpx tsc             # 编译到 dist', desc: '开 strict 更安全，熟 TS 再上' }
    ],
    pros: ['前后端同一种语言', 'npm 生态巨大，什么都有', '与 Vite/React 等前端工具无缝'],
    cons: ['回调/异步需要时间适应', 'node_modules 体积大（用 pnpm 更省）', '运行性能弱于 Go/Java'],
    bestPractices: ['用 pnpm 替代 npm（更快更省盘）', '.env 必须 gitignore', '提交 package-lock.json 锁版本', '用 .nvmrc 固定 Node 版本'],
    source: 'https://nodejs.org/en/learn'
  },
  {
    name: '前端部署', cat: '部署上线', icon: 'deploy',
    desc: '把 Vite 构建的前端项目放到静态托管（GitHub Pages / Vercel）上线，让全世界通过网址访问，还带 HTTPS。',
    tutorial: [
      { step: '1. 构建产物', cmd: 'npm run build\n# 生成 dist/（纯静态文件，前端上线必需）', desc: '前端必须 build 成静态文件才能托管' },
      { step: '2. 本地预览', cmd: 'npm run preview\n# 打开 http://localhost:4173', desc: '上线前先本地验证构建产物' },
      { step: '3. GitHub Pages', cmd: 'git subtree push --prefix dist origin gh-pages\n# 或仓库 Settings→Pages→Deploy from gh-pages', desc: '把 dist 发布到 gh-pages 分支即可上线' },
      { step: '4. Vercel / Netlify', cmd: '# 在 vercel.com 导入 GitHub 仓库\n# 自动识别 Vite，构建命令 build、输出 dist\nvercel --prod   # CI 中也可用', desc: '零配置、自动 HTTPS、自动预览' },
      { step: '5. CI 自动部署', cmd: '# .github/workflows/deploy.yml\n- run: npm ci\n- run: npm run build\n- uses: peaceiris/actions-gh-pages@v3\n  with: publish_dir: ./dist', desc: '每次 push 自动构建并发布上线' }
    ],
    pros: ['免费且自带 HTTPS', 'push 即上线，回滚方便', 'CDN 加速静态资源'],
    cons: ['仅适合纯静态（无服务器逻辑）', 'SPA 路由需额外配置 404 重写', '构建产物会让 git 变大'],
    bestPractices: ['dist/ 加入 .gitignore，用插件发布', 'SPA 用 History 路由记得配 fallback', '绑定自定义域名提升品牌'],
    source: 'https://pages.github.com/'
  }
];

// ===== 学习路径 / 路线图 =====
KB_DATA.learningPaths = [
  {
    name: '前端全栈工程师', duration: '6-8 个月', difficulty: '中级', color: '#7c5cfc', icon: 'frontend',
    desc: '从 HTML/CSS 基础到 React 全栈开发的完整路径，覆盖现代前端工程化全链路。',
    steps: [
      { phase: '第一阶段', title: 'HTML / CSS / JavaScript 基础', duration: '1-2 月', goals: '掌握语义化 HTML、Flexbox/Grid 布局、ES6+ 语法、异步编程', tools: ['MDN', 'JavaScript.info', 'Vue/React 官方教程'] },
      { phase: '第二阶段', title: '前端框架（React 或 Vue）', duration: '2 月', goals: '组件化思维、Hooks/Composition API、状态管理、路由', tools: ['React', 'Vue', 'Zustand/Pinia', 'React Router'] },
      { phase: '第三阶段', title: 'TypeScript + 工程化', duration: '1 月', goals: '类型系统、泛型、Vite/Webpack、ESLint/Prettier', tools: ['TypeScript', 'Vite', 'ESLint', 'Biome'] },
      { phase: '第四阶段', title: '元框架（Next.js / Nuxt）', duration: '1 月', goals: 'SSR/SSG、API Routes、文件路由、部署优化', tools: ['Next.js', 'Nuxt', 'Vercel'] },
      { phase: '第五阶段', title: '后端基础 + 数据库', duration: '1 月', goals: 'Node.js、REST/GraphQL API、PostgreSQL、ORM', tools: ['Node.js', 'Prisma', 'PostgreSQL', 'tRPC'] },
      { phase: '第六阶段', title: '全栈项目实战', duration: '1 月', goals: '全栈项目从 0 到部署、CI/CD、监控', tools: ['Next.js', 'Prisma', 'Docker', 'GitHub Actions'] },
      { phase: '第七阶段', title: '进阶：3D/动画/性能', duration: '持续', goals: 'Three.js、GSAP、性能优化、Web Vitals', tools: ['Three.js', 'GSAP', 'Lenis', 'R3F'] },
      { phase: '第八阶段', title: '进阶：AI 集成', duration: '持续', goals: 'LLM API 调用、RAG、AI Agent、Vercel AI SDK', tools: ['Vercel AI SDK', 'LangChain', 'MCP'] }
    ]
  },
  {
    name: 'AI Agent 开发工程师', duration: '5-7 个月', difficulty: '高级', color: '#22d3ee', icon: 'agent',
    desc: '从 LLM 基础到生产级 AI Agent 系统的完整路径，覆盖 RAG、Tool Use、Multi-Agent 全链路。',
    steps: [
      { phase: '第一阶段', title: 'LLM 基础与 Prompt 工程', duration: '1 月', goals: '理解 Token/Embedding/上下文窗口，掌握 Prompt 技巧', tools: ['OpenAI API', 'Anthropic API', 'Prompt Engineering 指南'] },
      { phase: '第二阶段', title: 'RAG 系统', duration: '1 月', goals: '向量数据库、分块策略、混合检索、Re-ranking', tools: ['Pinecone/Milvus', 'LlamaIndex', 'OpenAI Embeddings'] },
      { phase: '第三阶段', title: 'Function Calling & Tool Use', duration: '1 月', goals: '结构化输出、工具调用、MCP 协议', tools: ['OpenAI Function Calling', 'Anthropic Tool Use', 'MCP SDK'] },
      { phase: '第四阶段', title: 'Agent 框架', duration: '1 月', goals: 'ReAct 模式、Agent 循环、错误恢复、记忆系统', tools: ['LangGraph', 'Pydantic AI', 'CrewAI'] },
      { phase: '第五阶段', title: 'Multi-Agent 系统', duration: '1 月', goals: '多 Agent 协作、A2A 协议、任务编排', tools: ['LangGraph', 'AutoGen', 'A2A Protocol'] },
      { phase: '第六阶段', title: '生产化部署', duration: '1 月', goals: 'vLLM 推理优化、监控、成本控制、安全', tools: ['vLLM', 'LangSmith', 'Arize Phoenix'] },
      { phase: '第七阶段', title: '前沿：Agentic Coding', duration: '持续', goals: 'AI 编程 Agent、Harness Engineering、Spec-Driven', tools: ['Claude Code', 'Cursor', 'Trae'] }
    ]
  },
  {
    name: '3D / 可视化工程师', duration: '5-7 个月', difficulty: '高级', color: '#818cf8', icon: 'three',
    desc: '从 Canvas 2D 到 WebGL/Three.js 再到高级可视化的完整路径。',
    steps: [
      { phase: '第一阶段', title: 'Canvas 2D 基础', duration: '1 月', goals: 'Canvas API、动画循环、事件交互', tools: ['Canvas API', 'requestAnimationFrame'] },
      { phase: '第二阶段', title: 'Three.js 核心', duration: '2 月', goals: '场景/相机/渲染器、几何体、材质、光照、阴影', tools: ['Three.js', 'React Three Fiber'] },
      { phase: '第三阶段', title: '着色器（GLSL）', duration: '1 月', goals: '顶点/片段着色器、后处理、自定义材质', tools: ['GLSL', 'Three.js ShaderMaterial'] },
      { phase: '第四阶段', title: '动画与物理', duration: '1 月', goals: 'GSAP 时间线、骨骼动画、物理引擎', tools: ['GSAP', 'Theatre.js', 'Cannon.js/Rapier'] },
      { phase: '第五阶段', title: '数据可视化', duration: '1 月', goals: 'D3 数据驱动、ECharts 图表、自定义可视化', tools: ['D3.js', 'ECharts', 'Observable Plot'] },
      { phase: '第六阶段', title: '性能优化', duration: '持续', goals: 'Draw Call 优化、LOD、实例化、WebGPU', tools: ['Three.js Inspector', 'Spector.js'] }
    ]
  },
  {
    name: '后端工程师', duration: '7-9 个月', difficulty: '中级', color: '#34d399', icon: 'backend',
    desc: '从 API 设计到数据库优化到微服务架构的后端全栈路径。',
    steps: [
      { phase: '第一阶段', title: '编程语言深入', duration: '2 月', goals: 'Node.js/Go/Python 选一深入，掌握异步、并发', tools: ['Node.js', 'Go', 'Python'] },
      { phase: '第二阶段', title: 'Web 框架', duration: '1 月', goals: 'RESTful API 设计、中间件、认证授权', tools: ['Fastify', 'Gin', 'FastAPI'] },
      { phase: '第三阶段', title: '数据库', duration: '2 月', goals: 'SQL、索引优化、PostgreSQL、Redis 缓存', tools: ['PostgreSQL', 'Redis', 'Prisma/Drizzle'] },
      { phase: '第四阶段', title: '消息队列 & 实时', duration: '1 月', goals: 'Kafka/RabbitMQ、WebSocket、SSE', tools: ['Kafka', 'RabbitMQ', 'Socket.io'] },
      { phase: '第五阶段', title: '微服务 & Docker', duration: '1 月', goals: 'Docker、K8s 基础、服务发现、API 网关', tools: ['Docker', 'Kubernetes', 'gRPC'] },
      { phase: '第六阶段', title: '可观测性', duration: '1 月', goals: '日志、监控、链路追踪', tools: ['Prometheus', 'Grafana', 'OpenTelemetry'] },
      { phase: '第七阶段', title: '系统设计', duration: '持续', goals: '高并发、高可用、缓存策略、分库分表', tools: ['Redis', 'Nginx', 'CDN'] }
    ]
  },
  {
    name: 'DevOps 工程师', duration: '6-8 个月', difficulty: '中高级', color: '#a855f7', icon: 'devops',
    desc: '从 Git 协作到 CI/CD 到 Kubernetes 的 DevOps 全路径。',
    steps: [
      { phase: '第一阶段', title: 'Linux & Shell', duration: '1 月', goals: '文件系统、进程管理、Shell 脚本、网络基础', tools: ['Ubuntu', 'Bash', 'tmux'] },
      { phase: '第二阶段', title: 'Git & 团队协作', duration: '1 月', goals: 'Git 工作流、Code Review、Conventional Commits', tools: ['Git', 'GitHub', 'CODEOWNERS'] },
      { phase: '第三阶段', title: 'Docker 容器化', duration: '1 月', goals: 'Dockerfile、多阶段构建、Docker Compose', tools: ['Docker', 'Docker Compose'] },
      { phase: '第四阶段', title: 'CI/CD 流水线', duration: '1 月', goals: 'GitHub Actions/GitLab CI、自动化测试部署', tools: ['GitHub Actions', 'GitLab CI', 'ArgoCD'] },
      { phase: '第五阶段', title: 'Kubernetes', duration: '2 月', goals: 'Pod/Service/Ingress、Deployment、Helm', tools: ['Kubernetes', 'Helm', 'k9s'] },
      { phase: '第六阶段', title: '监控 & 告警', duration: '1 月', goals: 'Prometheus、Grafana、日志聚合', tools: ['Prometheus', 'Grafana', 'Loki'] },
      { phase: '第七阶段', title: 'IaC 基础设施即代码', duration: '1 月', goals: 'Terraform、Ansible 自动化', tools: ['Terraform', 'Ansible'] }
    ]
  },
  {
    name: '移动端开发', duration: '4-6 个月', difficulty: '中级', color: '#3b82f6', icon: 'mobile',
    desc: '从 React Native 跨平台到原生的移动开发路径。',
    steps: [
      { phase: '第一阶段', title: 'React Native 基础', duration: '1-2 月', goals: '组件、导航、样式、原生模块', tools: ['React Native', 'Expo', 'React Navigation'] },
      { phase: '第二阶段', title: '移动 UI/UX', duration: '1 月', goals: '手势交互、动画、响应式布局', tools: ['Reanimated', 'Gesture Handler', 'Tamagui'] },
      { phase: '第三阶段', title: '数据层 & API', duration: '1 月', goals: '离线存储、同步、推送通知', tools: ['React Query', 'MMKV', 'WatermelonDB'] },
      { phase: '第四阶段', title: '原生集成', duration: '1 月', goals: '原生模块开发、权限管理、App Store 上架', tools: ['Xcode', 'Android Studio', 'EAS Build'] },
      { phase: '第五阶段', title: '进阶：跨端统一', duration: '持续', goals: 'Tauri Mobile、Flutter、PWA', tools: ['Tauri 2', 'Flutter', 'Capacitor'] }
    ]
  }
];

// ===== AI 术语百科（77 个术语，8 大类别）=====
KB_DATA.aiGlossary = [
  {
    category: '基础概念', color: '#7c5cfc',
    terms: [
      { name:'LLM', cn:'大语言模型', desc:'通过在海量文本上训练、掌握语言理解与生成能力的大规模神经网络模型。当下主流的对话式 AI（GPT、Claude、Gemini、GLM 等）均建立在 LLM 之上。', related:['Transformer','Token','Embedding'] },
      { name:'NLP', cn:'自然语言处理', desc:'AI 的分支，研究让计算机理解、解释和生成人类语言的技术，是 LLM 的学科基础。', related:['LLM','Transformer','Token'] },
      { name:'Transformer', cn:'Transformer 架构', desc:'2017 年 Google 提出的神经网络架构，核心是自注意力机制，几乎所有现代大模型都是其变体。', related:['Attention','LLM','MoE'] },
      { name:'Token', cn:'词元/标记', desc:'模型处理文本的最小单位。1 个英文单词约 1-2 个 Token，1 个汉字约 1-2 个 Token。Token 数量直接影响推理成本。', related:['LLM','Embedding','Context Window'] },
      { name:'Embedding', cn:'嵌入/向量化', desc:'将文本转化为高维向量的过程，语义相近的内容在向量空间中距离更近，是语义检索和 RAG 的基础。', related:['Vector Database','RAG','Token'] },
      { name:'Fine-tuning', cn:'微调', desc:'在预训练大模型基础上用特定领域数据进一步训练，使其适配特定任务。常见方法：全参数微调、LoRA、QLoRA。', related:['LoRA','Pre-training','RLHF'] },
      { name:'RLHF', cn:'基于人类反馈的强化学习', desc:'通过人类偏好数据训练奖励模型，再用强化学习优化大模型，使其输出更符合人类期望。ChatGPT 能"说人话"的关键。', related:['Fine-tuning','Alignment','DPO'] },
      { name:'Pre-training', cn:'预训练', desc:'在海量无标注文本上进行的初始训练，学习语言的通用规律。完成后得到基座模型（Base Model）。', related:['Fine-tuning','LLM','RLHF'] },
      { name:'Hallucination', cn:'幻觉', desc:'模型生成看似合理但实际不正确、虚构的内容。RAG 和知识库接入是缓解幻觉的主要手段。', related:['RAG','LLM','Grounding'] },
      { name:'Context Window', cn:'上下文窗口', desc:'模型一次能处理的最大 Token 数量。2026 年主流模型支持 128K 到数百万 Token。', related:['Token','KV Cache','Long Context'] },
      { name:'Inference', cn:'推理', desc:'模型训练完成后接收输入并生成输出的过程。推理优化（量化、KV Cache）是降低部署成本的关键。', related:['Quantization','KV Cache','Speculative Decoding'] },
      { name:'Alignment', cn:'对齐', desc:'让模型行为与人类意图、价值观和安全规范保持一致的技术过程。RLHF、DPO 等都是对齐方法。', related:['RLHF','DPO','Fine-tuning'] }
    ]
  },
  {
    category: 'Prompt 工程', color: '#f472b6',
    terms: [
      { name:'Prompt', cn:'提示词', desc:'用户输入给模型的指令或问题文本，是人与大模型交互的核心方式。好的 Prompt 能引导更准确的输出。', related:['System Prompt','Few-shot','Chain-of-Thought'] },
      { name:'Prompt Engineering', cn:'提示词工程', desc:'系统性设计、优化和管理提示词的工程实践，包括模板管理、A/B 测试、自动优化等。', related:['Prompt','System Prompt','Context Engineering'] },
      { name:'System Prompt', cn:'系统提示词', desc:'对话开始时设定模型全局行为规则的提示词，权重最高。定义角色、能力边界、输出格式、安全规则。', related:['Prompt','Few-shot','Prompt Engineering'] },
      { name:'Few-shot', cn:'少样本提示', desc:'在提示词中提供少量示例（1-5 个），让模型通过示例学习任务模式和输出格式。', related:['Zero-shot','In-context Learning','Prompt'] },
      { name:'Zero-shot', cn:'零样本提示', desc:'不给模型提供示例，仅通过指令描述任务。简单任务足够，复杂任务需 Few-shot 或 CoT 辅助。', related:['Few-shot','Prompt','In-context Learning'] },
      { name:'Chain-of-Thought', cn:'思维链', desc:'引导模型在给出答案前先逐步展示推理过程。显著提升数学、逻辑推理任务表现。', related:['Prompt','Reasoning','ReAct'] },
      { name:'Prompt Injection', cn:'提示词注入', desc:'攻击者在输入中嵌入恶意指令，试图覆盖 System Prompt 和安全规则。LLM 应用的主要安全威胁。', related:['System Prompt','RAG','Jailbreak'] },
      { name:'In-context Learning', cn:'上下文学习', desc:'模型无需更新参数，仅通过提示词中的示例就能学习新任务。Few-shot 是典型应用。', related:['Few-shot','Zero-shot','Prompt'] },
      { name:'Context Engineering', cn:'上下文工程', desc:'2026 年兴起概念，比 Prompt Engineering 更宏观。关注如何为模型构建完整、高效的上下文环境。', related:['Prompt Engineering','RAG','Harness Engineering'] },
      { name:'Harness Engineering', cn:'支架工程', desc:'2026 年 AI 工程新关键词。指围绕模型构建的完整"支架"系统——上下文管理、工具编排、错误恢复等基础设施。', related:['Context Engineering','Agent','Agentic Engineering'] }
    ]
  },
  {
    category: 'RAG 相关', color: '#06b6d4',
    terms: [
      { name:'RAG', cn:'检索增强生成', desc:'在模型生成回答前先从外部知识库检索相关文档作为上下文，解决知识过时和幻觉问题。企业落地 LLM 的主流方案。', related:['Vector Database','Embedding','Chunking'] },
      { name:'Vector Database', cn:'向量数据库', desc:'专门存储和检索高维向量的数据库，支持语义检索。主流：Pinecone、Milvus、Weaviate、Qdrant。', related:['RAG','Embedding','Embedding Model'] },
      { name:'Chunking', cn:'分块', desc:'将长文档切分为小片段的过程，是 RAG 的关键预处理步骤。策略直接影响检索质量。', related:['RAG','Embedding','Late Chunking'] },
      { name:'Embedding Model', cn:'嵌入模型', desc:'专门将文本/图片转化为向量的模型，决定语义检索质量上限。主流：OpenAI text-embedding-3、BGE。', related:['Embedding','Vector Database','RAG'] },
      { name:'Retrieval', cn:'检索', desc:'RAG 中从知识库找到最相关材料的过程。2026 年主流：Vector RAG、Graph RAG、混合检索。', related:['RAG','Vector Database','Graph RAG'] },
      { name:'Re-ranking', cn:'重排序', desc:'初步检索召回后用更精细模型重新打分排序，将最相关内容排前面，显著提升上下文质量。', related:['RAG','Retrieval','Embedding Model'] },
      { name:'Graph RAG', cn:'图检索增强生成', desc:'结合知识图谱的 RAG 变体，利用实体关系图结构进行推理检索，擅长跨文档复杂查询。', related:['RAG','Retrieval','Vector Database'] },
      { name:'Hybrid Search', cn:'混合检索', desc:'结合关键词检索（BM25）和语义向量检索的混合策略，显著提升召回率和准确率，2026 年 RAG 标配。', related:['RAG','Retrieval','Re-ranking'] }
    ]
  },
  {
    category: 'Agent 相关', color: '#22d3ee',
    terms: [
      { name:'AI Agent', cn:'AI 智能体', desc:'以 LLM 为大脑、能自主感知环境、拆解任务、调用工具并执行行动来完成目标的自主系统。能"动手干活"而非仅"纸上谈兵"。', related:['LLM','Tool Use','Function Calling','MCP'] },
      { name:'Agentic AI', cn:'智能体式 AI', desc:'2026 年度最热概念。从单纯"回答问题"升级到"替你完成任务"，代表从 Copilot 到 Autopilot 的范式跃迁。', related:['AI Agent','Agentic Workflow','Agentic Coding'] },
      { name:'Tool Use', cn:'工具使用', desc:'LLM 调用外部工具（API、数据库、代码执行器等）扩展能力。让模型不再只"说"还能"做"。', related:['Function Calling','MCP','AI Agent'] },
      { name:'Function Calling', cn:'函数调用', desc:'OpenAI 机制：模型以结构化 JSON 输出要调用的函数名和参数，由外部代码执行后返回结果。LLM 与外部世界交互的基础协议。', related:['Tool Use','MCP','AI Agent'] },
      { name:'MCP', cn:'模型上下文协议', desc:'Anthropic 2024 年发布的开源协议，被誉为"AI 应用的 USB-C"。让 AI 模型即插即用地连接外部工具和资源。2026 年成 Agent 连接外部系统的事实标准。', related:['Function Calling','Tool Use','A2A'] },
      { name:'A2A', cn:'智能体间通信协议', desc:'Google 2025 年提出，定义多个 AI Agent 互相通信、协作和委托任务的标准协议。MCP 解决"连接工具"，A2A 解决"Agent 间协作"。', related:['MCP','Multi-Agent','AI Agent'] },
      { name:'Multi-Agent', cn:'多智能体', desc:'多个 AI Agent 协作完成复杂任务的架构。每个 Agent 专注特定角色，通过通信协议协调分工。', related:['AI Agent','A2A','Agentic Workflow'] },
      { name:'ReAct', cn:'推理-行动模式', desc:'Agent 经典范式：模型交替进行推理（Thought）和行动（Action），先思考再调用工具执行，循环直至完成。', related:['AI Agent','Chain-of-Thought','Tool Use'] },
      { name:'Agentic Workflow', cn:'智能体工作流', desc:'将多个 AI 步骤编排为可控工作流的工程方法。代表框架：LangGraph、CrewAI。2026 年 Agentic AI 落地核心范式。', related:['Agentic AI','AI Agent','Multi-Agent'] },
      { name:'Skill', cn:'技能模块', desc:'Agent 的能力封装模块，将特定领域能力打包为可复用 Skill，Agent 按需调用。比 Tool 更高层次的能力封装。', related:['AI Agent','Tool Use','MCP'] },
      { name:'Agent Memory', cn:'智能体记忆', desc:'让 Agent 具备跨会话记忆能力。短期记忆（当前任务上下文）+ 长期记忆（历史交互），通过向量数据库等存储。', related:['AI Agent','Vector Database','RAG'] }
    ]
  },
  {
    category: '模型架构', color: '#818cf8',
    terms: [
      { name:'MoE', cn:'混合专家模型', desc:'将模型拆分为多个"专家"子网络，每次推理只激活最相关的少数专家，大参数量下大幅降低计算成本。代表：Mixtral、DeepSeek-MoE。', related:['Transformer','Attention','Dense Model'] },
      { name:'Attention', cn:'注意力机制', desc:'Transformer 核心创新。让模型同时"关注"输入序列所有位置并按相关性分配权重。2026 年演进包括 GQA 等。', related:['Transformer','KV Cache','GQA'] },
      { name:'KV Cache', cn:'键值缓存', desc:'推理时缓存注意力的 Key/Value 矩阵避免重复计算。2026 年优化核心战场：PagedAttention、StreamingLLM 等。', related:['Attention','Transformer','PagedAttention'] },
      { name:'Quantization', cn:'量化', desc:'将模型参数从高精度（FP16）压缩到低精度（INT8/INT4），大幅降低显存和推理成本。让大模型在消费级 GPU 运行的核心手段。', related:['KV Cache','Inference','GQA'] },
      { name:'GQA', cn:'分组查询注意力', desc:'注意力优化变体，多查询头共享 Key/Value 组，将 KV Cache 减半。2026 年主流大模型标配。', related:['Attention','KV Cache','MQA'] },
      { name:'Speculative Decoding', cn:'投机解码', desc:'用小模型快速"猜测"后续 Token，大模型并行验证。显著提升推理速度不损失质量。', related:['Inference','KV Cache','Quantization'] },
      { name:'LoRA', cn:'低秩适配', desc:'参数高效微调方法：注入少量低秩矩阵训练，极大降低微调显存需求。QLoRA 结合量化可在单卡微调大模型。', related:['Fine-tuning','QLoRA','PEFT'] },
      { name:'Multimodal', cn:'多模态', desc:'模型能同时理解和处理多种数据类型（文本、图像、音频、视频）。多模态大模型（MLLM）是 2026 年主流方向。', related:['LLM','Vision Language Model','Embedding'] },
      { name:'Mamba', cn:'Mamba 架构', desc:'基于状态空间模型（SSM）的新兴架构，Transformer 潜在替代者。处理超长序列有线性复杂度优势。', related:['Transformer','Attention','SSM'] },
      { name:'DPO', cn:'直接偏好优化', desc:'比 RLHF 更简洁的对齐方法：直接用偏好数据优化模型，无需训练奖励模型和强化学习。2026 年对齐主流选择之一。', related:['RLHF','Alignment','Fine-tuning'] }
    ]
  },
  {
    category: '开发工具与框架', color: '#fbbf24',
    terms: [
      { name:'LangChain', cn:'LangChain 框架', desc:'最流行的通用 LLM 应用开发框架，提供模型调用、提示管理、链式调用、工具集成等全套能力。', related:['LangGraph','LlamaIndex','Agent','RAG'] },
      { name:'LangGraph', cn:'LangGraph', desc:'LangChain 团队推出的图结构 Agent 编排框架，专为有状态、多步骤 Agentic Workflow 设计。2026 年生产级 Agent 首选。', related:['LangChain','Agentic Workflow','Multi-Agent'] },
      { name:'LlamaIndex', cn:'LlamaIndex 框架', desc:'专注数据连接和 RAG 的 LLM 开发框架，提供从数据摄入到生成全链路 RAG 工程。', related:['RAG','LangChain','Vector Database'] },
      { name:'vLLM', cn:'vLLM 推理引擎', desc:'开源大模型高吞吐推理引擎，核心创新 PagedAttention 将显存利用率提升至 96%+。2026 年自建模型服务首选。', related:['PagedAttention','KV Cache','Quantization'] },
      { name:'SGLang', cn:'SGLang', desc:'新兴高性能推理引擎，核心创新 Radix Attention，在 RAG 场景可额外获得 30-50% 加速。', related:['vLLM','KV Cache','PagedAttention'] },
      { name:'Spring AI', cn:'Spring AI 框架', desc:'面向 Java/Spring 生态的 AI 应用开发框架，让 Java 开发者用熟悉的 Spring 编程模型集成 LLM、RAG 等。', related:['LangChain','RAG','MCP'] },
      { name:'Ollama', cn:'Ollama', desc:'开源本地大模型运行工具，让用户在个人电脑上轻松下载和运行开源大模型。', related:['LLM','Quantization','Open Source Model'] },
      { name:'Hugging Face', cn:'Hugging Face 平台', desc:'全球最大开源 AI 模型和数据集托管平台，被誉为"AI 界的 GitHub"。', related:['Transformers','Fine-tuning','Open Source Model'] }
    ]
  },
  {
    category: '评测基准', color: '#a3e635',
    terms: [
      { name:'SWE-bench', cn:'软件工程基准', desc:'AI 编程最权威评测之一。基于真实 GitHub Issue，要求模型在真实代码库中定位并修复 Bug。比 HumanEval 更贴近工程实际。', related:['HumanEval','MBPP','AI Coding'] },
      { name:'MMLU', cn:'大规模多任务语言理解', desc:'覆盖 57 个学科的多选题考试，测试模型通用知识能力。大模型基础能力评估的标准基准。', related:['HumanEval','GPQA','Benchmark'] },
      { name:'HumanEval', cn:'HumanEval 代码基准', desc:'OpenAI 提出的代码生成基准，通过编程题评估模型编程能力。2026 年被认为"与真实工程有差距"。', related:['SWE-bench','MBPP','AI Coding'] },
      { name:'ARC-AGI', cn:'AGI 抽象推理基准', desc:'François Chollet 提出的通用智能基准，通过抽象视觉推理测试泛化能力。被认为最接近"通用智能"的测试。', related:['AGI','Benchmark','Reasoning'] },
      { name:'GPQA', cn:'研究生水平问答基准', desc:'博士级专家出题的极难学术问答，即使专家用搜索引擎也难在合理时间找到答案。测试深度推理。', related:['MMLU','Reasoning','Benchmark'] },
      { name:'MBPP', cn:'基础编程基准', desc:'近千道基础 Python 编程题，评估代码生成能力。与 HumanEval 类似但题量更大。', related:['HumanEval','SWE-bench','AI Coding'] },
      { name:'MiniAppBench', cn:'迷你应用基准', desc:'2026 年蚂蚁集团提出并入选 ICML 2026。定义"MiniApp"——模型依据单条 Query 即时生成的 HTML 交互应用。16 个最强模型最高通过率仅 45%。', related:['Benchmark','AI Coding','Agent'] }
    ]
  },
  {
    category: '2026 最新趋势', color: '#d946ef',
    terms: [
      { name:'Agentic Coding', cn:'智能体编程', desc:'2026 年最热 AI 主线。由 AI Agent 自主完成代码编写、调试、测试、部署的完整工程链。从 Copilot 到 Agent 的跃迁。', related:['AI Agent','Agentic AI','Vibe Coding'] },
      { name:'Vibe Coding', cn:'氛围编程', desc:'Karpathy 2025 年提出，"把需求丢给 AI、凭感觉让 AI 干"。2026 年 Karpathy 宣布"已过时"，转向 Agentic Engineering。', related:['Agentic Coding','Agentic Engineering','AI Coding'] },
      { name:'Agentic Engineering', cn:'智能体工程', desc:'2026 年 Karpathy 新范式，Vibe Coding 的"进化体"。强调工程化、规范化构建和管理 AI Agent 系统。', related:['Vibe Coding','Agentic Coding','Harness Engineering'] },
      { name:'World Model', cn:'世界模型', desc:'2026 年最高频热词之一。指能理解和模拟物理世界运行规律的 AI 模型，被视为通向 AGI 的"下一张船票"。', related:['AGI','LLM','Multimodal'] },
      { name:'SLM', cn:'小语言模型', desc:'Small Language Model，参数 1B-10B 级别但针对特定场景优化的模型。2026 年趋势：端侧 SLM + 云端大模型混合部署。', related:['LLM','Quantization','Edge AI'] },
      { name:'Contextual Retrieval', cn:'上下文增强检索', desc:'2026 年 RAG 前沿策略。为每个分块添加文档级上下文摘要，或检索后用 LLM 对结果上下文增强。', related:['RAG','Chunking','Late Chunking'] },
      { name:'Late Chunking', cn:'延迟分块', desc:'2026 年 RAG 前沿策略。先对整篇文档 Embedding 再在向量空间切分，每个块保留全文语义上下文。', related:['Chunking','RAG','Embedding'] },
      { name:'PagedAttention', cn:'分页注意力', desc:'vLLM 核心技术。借鉴操作系统虚拟内存分页思想管理 KV Cache，显存利用率 >96%。2026 年推理优化基石。', related:['KV Cache','vLLM','Attention'] },
      { name:'Continuous Batching', cn:'连续批处理', desc:'推理引擎关键优化。动态将新请求加入正在处理的批次，配合 PagedAttention 吞吐提升 2-4 倍。', related:['PagedAttention','vLLM','Inference'] },
      { name:'AGI', cn:'通用人工智能', desc:'具备与人类相当或超越人类的通用智能。2026 年仍是 AI 行业终极愿景和争论焦点。', related:['World Model','LLM','ARC-AGI'] },
      { name:'Frontend Code Arena', cn:'前端代码竞技场', desc:'评测大模型前端开发能力的榜单，包括 UI 还原、组件开发、响应式设计等维度。2026 年 Kimi K3 以 1679 分登顶全球第一。', related:['AI Coding','SWE-bench','Benchmark'] }
    ]
  }
];

// ===== 工具活跃度数据（lastPush / contributors）=====
// 仅为 TOP 工具提供真实数据，其余由前端根据 stars 自动推算
KB_DATA.activityData = {
  'React':            { lastPush: '2026-07-22', contributors: 1680, issues: 985 },
  'Vue.js':           { lastPush: '2026-07-21', contributors: 412, issues: 632 },
  'Next.js':          { lastPush: '2026-07-23', contributors: 3950, issues: 1240 },
  'Svelte':           { lastPush: '2026-07-20', contributors: 680, issues: 420 },
  'Astro':            { lastPush: '2026-07-22', contributors: 815, issues: 310 },
  'Angular':          { lastPush: '2026-07-19', contributors: 1520, issues: 2380 },
  'Nuxt':             { lastPush: '2026-07-21', contributors: 390, issues: 510 },
  'Remix':            { lastPush: '2026-07-18', contributors: 475, issues: 380 },
  'Solid':            { lastPush: '2026-07-17', contributors: 180, issues: 220 },
  'Tailwind CSS':     { lastPush: '2026-07-23', contributors: 380, issues: 180 },
  'Three.js':         { lastPush: '2026-07-22', contributors: 920, issues: 890 },
  'GSAP':             { lastPush: '2026-07-15', contributors: 95, issues: 210 },
  'Framer Motion':    { lastPush: '2026-07-20', contributors: 210, issues: 280 },
  'D3.js':            { lastPush: '2026-07-14', contributors: 140, issues: 320 },
  'Vite':             { lastPush: '2026-07-23', contributors: 520, issues: 410 },
  'Webpack':          { lastPush: '2026-07-10', contributors: 670, issues: 1120 },
  'esbuild':          { lastPush: '2026-07-21', contributors: 85, issues: 140 },
  'Zustand':          { lastPush: '2026-07-19', contributors: 65, issues: 95 },
  'Redux':            { lastPush: '2026-07-16', contributors: 290, issues: 680 },
  'Pinia':            { lastPush: '2026-07-20', contributors: 120, issues: 180 },
  'Jest':             { lastPush: '2026-07-12', contributors: 380, issues: 520 },
  'Vitest':           { lastPush: '2026-07-22', contributors: 240, issues: 190 },
  'Playwright':       { lastPush: '2026-07-23', contributors: 320, issues: 610 },
  'ESLint':           { lastPush: '2026-07-21', contributors: 950, issues: 1240 },
  'Prettier':         { lastPush: '2026-07-18', contributors: 410, issues: 380 },
  'pnpm':             { lastPush: '2026-07-22', contributors: 180, issues: 210 },
  'Turborepo':        { lastPush: '2026-07-21', contributors: 95, issues: 150 },
  'Express':          { lastPush: '2026-07-15', contributors: 280, issues: 1200 },
  'Fastify':          { lastPush: '2026-07-20', contributors: 120, issues: 280 },
  'NestJS':           { lastPush: '2026-07-19', contributors: 340, issues: 510 },
  'Prisma':           { lastPush: '2026-07-22', contributors: 420, issues: 890 },
  'Drizzle':          { lastPush: '2026-07-23', contributors: 85, issues: 120 },
  'tRPC':             { lastPush: '2026-07-20', contributors: 130, issues: 210 },
  'React Native':     { lastPush: '2026-07-21', contributors: 890, issues: 1680 },
  'Expo':             { lastPush: '2026-07-23', contributors: 280, issues: 420 },
  'Vercel':           { lastPush: '2026-07-23', contributors: 150, issues: 95 },
  'Docker':           { lastPush: '2026-07-22', contributors: 580, issues: 3200 },
  'LangChain':        { lastPush: '2026-07-23', contributors: 720, issues: 890 },
  'LlamaIndex':       { lastPush: '2026-07-22', contributors: 280, issues: 410 },
  'CrewAI':           { lastPush: '2026-07-21', contributors: 95, issues: 180 },
  'AutoGPT':          { lastPush: '2026-07-18', contributors: 420, issues: 620 },
  'shadcn/ui':        { lastPush: '2026-07-23', contributors: 180, issues: 220 },
  'Radix UI':         { lastPush: '2026-07-20', contributors: 95, issues: 180 },
  'Material UI':      { lastPush: '2026-07-17', contributors: 890, issues: 1240 },
  'Ant Design':       { lastPush: '2026-07-21', contributors: 680, issues: 980 },
  'Lenis':            { lastPush: '2026-07-19', contributors: 35, issues: 85 },
  'TanStack Query':   { lastPush: '2026-07-22', contributors: 180, issues: 280 },
  'Motion One':       { lastPush: '2026-07-16', contributors: 45, issues: 65 },
  'Oclif':            { lastPush: '2026-07-14', contributors: 85, issues: 210 },
  'Hono':             { lastPush: '2026-07-23', contributors: 120, issues: 180 },
  'Bun':              { lastPush: '2026-07-23', contributors: 180, issues: 420 }
};

// ===== Stars 增长趋势数据（用于趋势折线图）=====
// 数据点为每年 1 月的近似 stars 数（基于 GitHub 历史趋势推算）
KB_DATA.starsTrends = {
  dates: ['2021-01', '2022-01', '2023-01', '2024-01', '2025-01', '2026-01', '2026-07'],
  frameworks: [
    { name: 'React',       color: '#7c5cfc', data: [164000, 182000, 198000, 215000, 227000, 235000, 242000] },
    { name: 'Vue.js',      color: '#34d399', data: [176000, 194000, 208000, 224000, 235000, 247000, 252000] },
    { name: 'Next.js',     color: '#a78bfa', data: [60000, 82000, 108000, 142000, 182000, 218000, 247000] },
    { name: 'Svelte',      color: '#22d3ee', data: [42000, 56000, 68000, 76000, 82000, 87000, 89000] },
    { name: 'Astro',       color: '#fbbf24', data: [12000, 22000, 38000, 52000, 68000, 78000, 82000] },
    { name: 'Tailwind CSS',color: '#f472b6', data: [33000, 54000, 65000, 74000, 79000, 82000, 84000] },
    { name: 'Vite',        color: '#fb923c', data: [14000, 42000, 58000, 64000, 67000, 69000, 71000] },
    { name: 'Three.js',    color: '#818cf8', data: [72000, 82000, 89000, 94000, 98000, 101000, 103000] }
  ]
};
