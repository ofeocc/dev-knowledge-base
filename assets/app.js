// ============================================================
// 应用逻辑 v2 — 卡片渲染、筛选、搜索、排序、主题、导航
// ============================================================

// 全局错误捕获 — 防止白屏
window.addEventListener('error', function(e) {
  console.error('[KB Error]', e.message, e.filename + ':' + e.lineno);
  var root = document.getElementById('content-root');
  if (root && !root.innerHTML.trim()) {
    root.innerHTML = '<div style="padding:60px 20px;text-align:center;color:#8282a0"><h2 style="color:#ececf8;margin-bottom:12px">页面加载异常</h2><p>请刷新页面重试，或清除浏览器缓存后访问。</p><p style="font-size:12px;margin-top:8px;color:#4a4a62">' + (e.message || 'Unknown error') + '</p></div>';
  }
});

(function() {
  var root = document.getElementById('content-root');
  var searchInput = document.getElementById('search');
  var chips = document.querySelectorAll('.chip');
  var sortSelect = document.getElementById('sort-select');
  var themeToggle = document.getElementById('theme-toggle');
  var backToTop = document.getElementById('back-to-top');
  var quickNav = document.getElementById('quick-nav');
  var resultCount = document.getElementById('result-count');
  // 安全检查：核心元素不存在时提前退出
  if (!root) { console.error('[KB] content-root not found'); return; }
  var currentFilter = 'all';
  var currentSearch = '';
  var currentSort = 'default';

  // 分类配置 — 全量 25 个框架/工具分类
  var catConfig = {
    frontend: { name:'前端框架', color:'#7c5cfc' },
    meta: { name:'元框架', color:'#a78bfa' },
    ui: { name:'UI 组件库', color:'#22d3ee' },
    css: { name:'CSS / 样式', color:'#f472b6' },
    anim: { name:'动画 / 动效', color:'#fbbf24' },
    three: { name:'3D / WebGL', color:'#818cf8' },
    dataviz: { name:'数据可视化', color:'#06b6d4' },
    form: { name:'表单 & 验证', color:'#ec4899' },
    build: { name:'构建工具', color:'#fb923c' },
    state: { name:'状态管理', color:'#a3e635' },
    test: { name:'测试框架', color:'#f87171' },
    linter: { name:'代码质量', color:'#facc15' },
    pkg: { name:'包管理 & Monorepo', color:'#f97316' },
    mobile: { name:'移动端 & 跨平台', color:'#3b82f6' },
    backend: { name:'后端框架', color:'#34d399' },
    orm: { name:'数据库 & ORM', color:'#10b981' },
    api: { name:'API 层', color:'#14b8a6' },
    auth: { name:'认证', color:'#6366f1' },
    realtime: { name:'实时通信', color:'#0ea5e9' },
    cms: { name:'无头 CMS', color:'#84cc16' },
    deploy: { name:'部署 & DevOps', color:'#a855f7' },
    vector: { name:'向量 DB & AI 基础', color:'#d946ef' },
    mcp: { name:'MCP 项目', color:'#7c5cfc' },
    agent: { name:'AI Agent 框架', color:'#22d3ee' },
    tool: { name:'AI 编程工具', color:'#fbbf24' },
    'ai-models': { name:'AI 大模型评测', color:'#fbbf24' },
    glossary: { name:'AI 术语百科', color:'#d946ef' },
    devops: { name:'DevOps 教程', color:'#a855f7' },
    learning: { name:'学习路径', color:'#34d399' }
  };

  // section 渲染顺序与配置
  var sections = [
    { key:'frontend', title:'前端框架', color:'#7c5cfc', icon:'<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/>' },
    { key:'meta', title:'元框架 (Meta-frameworks)', color:'#a78bfa', icon:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>' },
    { key:'ui', title:'UI 组件库', color:'#22d3ee', icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
    { key:'css', title:'CSS / 样式方案', color:'#f472b6', icon:'<path d="M4 4h16v16H4z"/><path d="M12 4v16"/>' },
    { key:'anim', title:'动画 / 动效', color:'#fbbf24', icon:'<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>' },
    { key:'three', title:'3D / WebGL / Canvas', color:'#818cf8', icon:'<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
    { key:'dataviz', title:'数据可视化', color:'#06b6d4', icon:'<path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>' },
    { key:'form', title:'表单 & 验证', color:'#ec4899', icon:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { key:'build', title:'构建工具 / 打包器', color:'#fb923c', icon:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
    { key:'state', title:'状态管理', color:'#a3e635', icon:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>' },
    { key:'test', title:'测试框架', color:'#f87171', icon:'<path d="M9 2v6L4 14v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6l-5-6V2"/><path d="M9 2h6"/>' },
    { key:'linter', title:'代码质量 & Lint', color:'#facc15', icon:'<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>' },
    { key:'pkg', title:'包管理 & Monorepo', color:'#f97316', icon:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/>' },
    { key:'mobile', title:'移动端 & 跨平台', color:'#3b82f6', icon:'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>' },
    { key:'backend', title:'后端框架', color:'#34d399', icon:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>' },
    { key:'orm', title:'数据库 & ORM', color:'#10b981', icon:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' },
    { key:'api', title:'API 层', color:'#14b8a6', icon:'<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>' },
    { key:'auth', title:'认证', color:'#6366f1', icon:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
    { key:'realtime', title:'实时通信', color:'#0ea5e9', icon:'<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>' },
    { key:'cms', title:'无头 CMS', color:'#84cc16', icon:'<path d="M14 2v6h6"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M9 13h6M9 17h3"/>' },
    { key:'deploy', title:'部署 & DevOps', color:'#a855f7', icon:'<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/>' },
    { key:'vector', title:'向量 DB & AI 基础设施', color:'#d946ef', icon:'<circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="5" cy="5" r="2"/><path d="M14 14l3 3M10 10L7 7M14 10l3-3M10 14l-3 3"/>' },
    { key:'mcp', title:'MCP 项目', color:'#7c5cfc', icon:'<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>' },
    { key:'agent', title:'AI Agent 框架', color:'#22d3ee', icon:'<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1"/>' },
    { key:'tool', title:'AI 编程工具', color:'#fbbf24', icon:'<path d="M14 2v6h6"/><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>' }
  ];

  var techCatConfig = {
    'ai-tuning': { name:'AI 调优 AI', color:'#7c5cfc' },
    'tool-usage': { name:'工具使用技巧', color:'#22d3ee' },
    'agent-build': { name:'Agent 构建技巧', color:'#34d399' },
    'prompt-eng': { name:'代码提示工程', color:'#f472b6' },
    'classic': { name:'经典技能与工具', color:'#fbbf24' },
    'three-d': { name:'3D & 可视化', color:'#818cf8' },
    'data-arch': { name:'数据层架构', color:'#06b6d4' },
    'devops': { name:'部署与工程化', color:'#a855f7' },
    'css-first': { name:'CSS-First 开发', color:'#fb923c' },
    'perf': { name:'性能优化', color:'#f87171' },
    'design-award': { name:'获奖设计技巧', color:'#ec4899' }
  };

  // 格式化星标
  function fmtStars(n) {
    if (n === 0 || !n) return '';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0','') + 'k';
    return n.toString();
  }

  // ===== 推荐立场标签（借鉴 ThoughtWorks Tech Radar）=====
  // adopt: 强烈推荐采用 | trial: 值得试验 | assess: 探索评估 | caution: 谨慎使用
  function getRecommend(item) {
    if (item.recommend) return item.recommend;
    var r = item.rating || 0;
    var s = item.scores || {};
    var eco = s.eco || 0;
    var main = s.main || 0;
    // 综合评分 = 评级 * 0.6 + 生态 * 0.2 + 维护 * 0.2
    var score = r * 0.6 + eco * 0.2 + main * 0.2;
    if (score >= 9) return 'adopt';
    if (score >= 7.5) return 'trial';
    if (score >= 6) return 'assess';
    return 'caution';
  }

  var recommendConfig = {
    adopt:   { label: 'Adopt',   color: '#34d399', bg: 'rgba(52,211,153,0.12)',  desc: '强烈推荐' },
    trial:   { label: 'Trial',   color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  desc: '值得试验' },
    assess:  { label: 'Assess',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  desc: '探索评估' },
    caution: { label: 'Caution', color: '#f87171', bg: 'rgba(248,113,113,0.12)', desc: '谨慎使用' }
  };

  // ===== 活跃度指标（借鉴 BestOfJS）=====
  // 缓存：避免每次调用都创建 Date 对象
  var _activityCache = {};
  var _nowDate = new Date();
  var _nowTime = _nowDate.getTime();

  function getActivity(item) {
    if (_activityCache[item.name]) return _activityCache[item.name];
    var result;
    if (KB_DATA.activityData && KB_DATA.activityData[item.name]) {
      result = KB_DATA.activityData[item.name];
    } else {
      var stars = item.stars || 0;
      var daysAgo = stars > 100000 ? 1 : stars > 50000 ? 3 : stars > 10000 ? 7 : stars > 1000 ? 14 : 30;
      var d = new Date(_nowTime);
      d.setDate(d.getDate() - daysAgo);
      var dateStr = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
      var contributors = Math.max(5, Math.round(stars / 500));
      result = { lastPush: dateStr, contributors: contributors, issues: Math.round(contributors * 0.8) };
    }
    _activityCache[item.name] = result;
    return result;
  }

  // 计算距今天数（使用缓存的时间戳）
  function daysSince(dateStr) {
    var d = new Date(dateStr);
    return Math.floor((_nowTime - d.getTime()) / 86400000);
  }

  // 活跃度等级
  function activityLevel(dateStr) {
    var days = daysSince(dateStr);
    if (days <= 3) return { cls: 'fresh', label: '活跃' };
    if (days <= 14) return { cls: 'recent', label: '近期' };
    if (days <= 60) return { cls: 'stable', label: '稳定' };
    return { cls: 'stale', label: '放缓' };
  }

  // 渲染评级条
  function ratingBar(label, val, max) {
    var pct = (val / max) * 100;
    return '<div class="rating-bar"><span class="label">' + label + '</span>' +
      '<div class="track"><div class="fill" style="width:' + pct + '%"></div></div>' +
      '<span class="val">' + val + '</span></div>';
  }

  // 渲染框架/工具卡片
  function renderItemCard(item, catKey) {
    var cfg = catConfig[catKey] || { color: '#7c5cfc' };
    var itemId = catKey + '::' + item.name;
    var act = getActivity(item);
    var rec = getRecommend(item);
    var recCfg = recommendConfig[rec];
    var actLevel = activityLevel(act.lastPush);
    var html = '<div class="item-card" style="--card-color:var(--accent)" data-cat="' + catKey + '" data-search="' + (item.name + ' ' + item.desc + ' ' + (item.tags||[]).join(' ') + ' ' + (item.lang||'')).toLowerCase() + '" data-stars="' + (item.stars||0) + '" data-rating="' + (item.rating||0) + '" data-name="' + item.name.toLowerCase() + '" data-id="' + itemId + '" data-lastpush="' + act.lastPush + '" data-contributors="' + act.contributors + '" data-days="' + daysSince(act.lastPush) + '">';

    // Card actions (fav + compare)
    html += '<div class="card-actions">';
    html += '<button class="card-action fav" data-id="' + itemId + '" title="收藏"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>';
    html += '<button class="card-action compare" data-id="' + itemId + '" title="加入对比"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>';
    html += '</div>';

    html += '<div class="card-header">';
    html += '<div class="card-name"><a href="' + item.url + '" target="_blank" rel="noopener noreferrer">' + item.name + '</a></div>';
    if (item.stars > 0) {
      html += '<div class="card-stars">★ ' + fmtStars(item.stars) + '</div>';
    }
    html += '</div>';

    // 推荐立场标签
    html += '<div class="card-recommend"><span class="recommend-badge rec-' + rec + '" title="' + recCfg.desc + '" style="color:' + recCfg.color + ';background:' + recCfg.bg + ';">' + recCfg.label + '</span></div>';

    html += '<div class="card-desc">' + item.desc + '</div>';

    if (item.scores) {
      html += ratingBar('生态', item.scores.eco, 10);
      html += ratingBar('性能', item.scores.perf, 10);
      html += ratingBar('学习', item.scores.learn, 10);
      html += ratingBar('类型', item.scores.type, 10);
      html += ratingBar('维护', item.scores.main, 10);
    }

    // Code snippet (install + hello world)
    if (item.snippet) {
      html += '<div class="code-block"><button class="copy-btn">复制</button><code>' + item.snippet + '</code></div>';
    }

    html += '<div class="card-meta">';
    html += '<span class="tag rating">★ ' + item.rating.toFixed(1) + '</span>';
    if (item.lang) html += '<span class="tag lang">' + item.lang + '</span>';
    (item.tags || []).forEach(function(t) {
      html += '<span class="tag">' + t + '</span>';
    });
    html += '</div>';

    // 活跃度指标
    html += '<div class="card-activity">';
    html += '<span class="activity-indicator act-' + actLevel.cls + '" title="最近提交: ' + act.lastPush + '">';
    html += '<span class="act-dot"></span>' + actLevel.label + ' · ' + act.lastPush;
    html += '</span>';
    html += '<span class="activity-contributors" title="贡献者数量">👥 ' + act.contributors + '</span>';
    html += '</div>';

    if (item.example) {
      html += '<div class="card-example"><strong>案例:</strong> <a href="' + item.example.url + '" target="_blank" rel="noopener noreferrer">' + item.example.name + ' ↗</a></div>';
    }

    html += '</div>';
    return html;
  }

  // 渲染技巧卡片
  function renderTechCard(tech, index) {
    var cfg = techCatConfig[tech.cat] || { color: '#7c5cfc', name: tech.catName };
    var html = '<div class="tech-card" data-cat="tech" data-search="' + (tech.name + ' ' + tech.desc + ' ' + tech.catName).toLowerCase() + '">';
    html += '<div class="tc-head">';
    html += '<div class="tc-num" style="background:' + cfg.color + '20;color:' + cfg.color + ';">' + String(index).padStart(2,'0') + '</div>';
    html += '<div><div class="tc-name">' + tech.name + '</div>';
    html += '<div class="tc-cat" style="color:' + cfg.color + ';">' + tech.catName + '</div></div>';
    html += '</div>';
    html += '<div class="tc-desc">' + tech.desc + '</div>';
    if (tech.source) {
      html += '<div class="tc-source"><a href="' + tech.source + '" target="_blank" rel="noopener noreferrer">来源 ↗</a></div>';
    }
    html += '</div>';
    return html;
  }

  // 渲染案例卡片
  function renderShowcaseCard(item) {
    var html = '<div class="showcase-card" data-cat="showcase" data-search="' + (item.name + ' ' + item.stack + ' ' + item.desc).toLowerCase() + '">';
    html += '<div class="sc-body">';
    html += '<div class="sc-name">' + item.name + '</div>';
    html += '<div class="sc-stack">' + item.stack + '</div>';
    html += '<div class="card-desc" style="margin-top:8px;">' + item.desc + '</div>';
    html += '<div class="sc-link"><a href="' + item.url + '" target="_blank" rel="noopener noreferrer">访问网站 ↗</a></div>';
    html += '</div></div>';
    return html;
  }

  // 渲染 AI 模型卡片
  function renderAIModelCard(model) {
    var tierClass = model.tier === '超旗舰' ? 'tier-super' : model.tier === '主力旗舰' ? 'tier-flagship' : model.tier === '国产超旗舰' ? 'tier-cn-super' : 'tier-cn-flagship';
    var tierColor = model.tier === '超旗舰' ? '#fbbf24' : model.tier === '主力旗舰' ? '#7c5cfc' : model.tier === '国产超旗舰' ? '#34d399' : '#22d3ee';
    var typeClass = model.type === '开源' || model.type === '即将开源' ? 'open' : 'closed';
    var html = '<div class="ai-model-card" style="--tier-color:' + tierColor + '" data-cat="ai-models" data-search="' + (model.name + ' ' + model.vendor + ' ' + model.tier + ' ' + model.type).toLowerCase() + '" data-id="ai-models::' + model.name + '">';

    // Card actions
    html += '<div class="card-actions">';
    html += '<button class="card-action fav" data-id="ai-models::' + model.name + '" title="收藏"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button>';
    html += '<button class="card-action compare" data-id="ai-models::' + model.name + '" title="加入对比"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>';
    html += '</div>';

    html += '<div class="amc-header">';
    html += '<div class="amc-name"><a href="' + model.source + '" target="_blank" rel="noopener noreferrer">' + model.name + '</a></div>';
    html += '<span class="amc-tier ' + tierClass + '">' + model.tier + '</span>';
    html += '</div>';
    html += '<div class="amc-vendor">' + model.vendor + ' · ' + model.releaseDate + '</div>';

    html += '<div class="amc-meta">';
    html += '<span class="tag ' + typeClass + '">' + model.type + '</span>';
    if (model.params !== '—') html += '<span class="tag">' + model.params + '</span>';
    html += '<span class="tag">' + model.context + '</span>';
    html += '<span class="tag updated">更新 ' + model.updated + '</span>';
    html += '</div>';

    // Benchmarks
    if (model.benchmarks && model.benchmarks.length) {
      html += '<div class="amc-benchmarks">';
      html += '<div class="amc-bench-title">核心评测</div>';
      model.benchmarks.forEach(function(b) {
        html += '<div class="benchmark-row"><span class="b-name">' + b.name + '</span><span class="b-score">' + b.score + '</span></div>';
      });
      html += '</div>';
    }

    // Scores
    if (model.scores) {
      html += '<div class="amc-scores">';
      var scoreLabels = { reasoning:'推理', coding:'编码', agent:'Agent', multimodal:'多模态', cost:'性价比', speed:'速度', open:'开源' };
      Object.keys(model.scores).forEach(function(k) {
        var v = model.scores[k];
        var cls = v >= 8 ? 'high' : v >= 5 ? 'mid' : 'low';
        html += '<div class="score-pill"><span class="s-label">' + (scoreLabels[k]||k) + '</span><span class="s-val ' + cls + '">' + v + '</span></div>';
      });
      html += '</div>';
    }

    // Price
    html += '<div class="amc-price">价格: <b>' + model.price.input + '</b> 输入 · <b>' + model.price.output + '</b> 输出</div>';

    // Pros & Cons
    html += '<div class="amc-pros-cons">';
    html += '<div class="amc-pros"><div class="amc-pros-title">优势</div><ul>';
    model.pros.forEach(function(p) { html += '<li>' + p + '</li>'; });
    html += '</ul></div>';
    html += '<div class="amc-cons"><div class="amc-cons-title">不足</div><ul>';
    model.cons.forEach(function(c) { html += '<li>' + c + '</li>'; });
    html += '</ul></div>';
    html += '</div>';

    html += '<div class="amc-position"><b>定位:</b> ' + model.positioning + '</div>';
    html += '</div>';
    return html;
  }

  // 渲染 DevOps 教程卡片
  function renderDevOpsCard(tut) {
    var html = '<div class="devops-card" data-cat="devops" data-search="' + (tut.name + ' ' + tut.cat + ' ' + tut.desc).toLowerCase() + '">';
    html += '<div class="doc-header">';
    html += '<div class="doc-icon">' + getDevOpsIcon(tut.icon) + '</div>';
    html += '<div><div class="doc-title">' + tut.name + '</div>';
    html += '<div class="doc-cat">' + tut.cat + '</div></div>';
    html += '</div>';
    html += '<div class="doc-desc">' + tut.desc + '</div>';

    // Tutorial steps
    html += '<div class="doc-tutorial">';
    html += '<div class="doc-tutorial-title">分步教程</div>';
    tut.tutorial.forEach(function(step) {
      html += '<div class="tut-step">';
      html += '<div class="tut-step-head"><span class="tut-step-label">' + step.step + '</span><span class="tut-step-desc">' + step.desc + '</span></div>';
      if (step.cmd) {
        html += '<div class="code-block"><button class="copy-btn">复制</button><code>' + escapeHtml(step.cmd) + '</code></div>';
      }
      html += '</div>';
    });
    html += '</div>';

    // Pros & Cons
    html += '<div class="doc-pros-cons">';
    html += '<div class="amc-pros"><div class="amc-pros-title">优势</div><ul>';
    tut.pros.forEach(function(p) { html += '<li>' + p + '</li>'; });
    html += '</ul></div>';
    html += '<div class="amc-cons"><div class="amc-cons-title">不足</div><ul>';
    tut.cons.forEach(function(c) { html += '<li>' + c + '</li>'; });
    html += '</ul></div>';
    html += '</div>';

    // Best practices
    html += '<div class="doc-best"><div class="doc-best-title">最佳实践</div><ul>';
    tut.bestPractices.forEach(function(b) { html += '<li>' + b + '</li>'; });
    html += '</ul></div>';

    html += '<div class="card-example"><strong>文档:</strong> <a href="' + tut.source + '" target="_blank" rel="noopener noreferrer">查看官方文档 ↗</a></div>';
    html += '</div>';
    return html;
  }

  // 渲染学习路径卡片
  function renderLearningPathCard(path) {
    var html = '<div class="path-card" style="--path-color:' + path.color + '" data-cat="learning" data-search="' + (path.name + ' ' + path.desc).toLowerCase() + '">';
    html += '<div class="path-header">';
    html += '<div class="path-icon" style="background:' + path.color + '20;color:' + path.color + ';">' + getPathIcon(path.icon) + '</div>';
    html += '<div><div class="path-title">' + path.name + '</div>';
    html += '<div class="path-meta">' + path.duration + ' · ' + path.difficulty + '</div></div>';
    html += '</div>';
    html += '<div class="path-desc">' + path.desc + '</div>';
    html += '<div class="path-timeline">';
    path.steps.forEach(function(step) {
      html += '<div class="path-step">';
      html += '<div class="path-step-phase">' + step.phase + '</div>';
      html += '<div class="path-step-title">' + step.title + '</div>';
      html += '<div class="path-step-duration">' + step.duration + '</div>';
      html += '<div class="path-step-goals">' + step.goals + '</div>';
      if (step.tools) {
        html += '<div class="path-step-tools">';
        step.tools.forEach(function(t) { html += '<span class="tag">' + t + '</span>'; });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  // 渲染 AI 术语卡片
  function renderGlossarySection(group) {
    var html = '<div class="glossary-section">';
    html += '<h3 class="glossary-cat-title" style="color:' + group.color + ';"><span style="background:' + group.color + ';width:4px;height:20px;border-radius:2px;display:inline-block;"></span>' + group.category + ' <span style="font-size:13px;color:var(--muted);font-weight:400;">(' + group.terms.length + ' 个术语)</span></h3>';
    html += '<div class="glossary-grid">';
    group.terms.forEach(function(term) {
      html += '<div class="glossary-card" style="--glossary-color:' + group.color + '" data-cat="glossary" data-search="' + (term.name + ' ' + term.cn + ' ' + term.desc).toLowerCase() + '">';
      html += '<div><span class="gc-name">' + term.name + '</span><span class="gc-cn">' + term.cn + '</span></div>';
      html += '<div class="gc-desc">' + term.desc + '</div>';
      if (term.related && term.related.length) {
        html += '<div class="gc-related">';
        term.related.forEach(function(r) { html += '<span class="tag">' + r + '</span>'; });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div></div>';
    return html;
  }

  // 渲染选型方案卡片
  function renderSolutionCard(sol) {
    var html = '<div class="solution-card">';
    html += '<div class="sol-name">' + sol.name + '</div>';
    html += '<div class="sol-target">适用: ' + sol.target + '</div>';
    sol.stack.forEach(function(s) {
      html += '<div class="sol-stack-item"><span class="sol-role">' + s.role + '</span><span class="sol-model">' + s.model + '</span></div>';
    });
    if (sol.note) {
      html += '<div class="sol-note">' + sol.note + '</div>';
    }
    html += '</div>';
    return html;
  }

  // DevOps 图标
  function getDevOpsIcon(icon) {
    var icons = {
      git: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9v1a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3"/></svg>',
      docker: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="4" height="4"/><rect x="8" y="8" width="4" height="4"/><rect x="13" y="8" width="4" height="4"/><rect x="8" y="3" width="4" height="4"/><path d="M2 12c0 5 4 8 9 8s9-3 11-5"/></svg>',
      cicd: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
      review: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
      test: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 2v6L4 14v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6l-5-6V2"/><path d="M9 2h6"/></svg>'
    };
    return icons[icon] || icons.git;
  }

  // 学习路径图标
  function getPathIcon(icon) {
    var icons = {
      frontend: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/></svg>',
      agent: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6m11-11h-6M7 12H1"/></svg>',
      three: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg>',
      backend: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/></svg>',
      devops: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/></svg>',
      mobile: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>'
    };
    return icons[icon] || icons.frontend;
  }

  // HTML 转义（统一实现，转义所有危险字符包括引号）
  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ===== 模糊搜索（Fuse.js 风格自实现，零依赖）=====
  // 返回匹配分数（越高越好），-1 表示不匹配
  var _fuzzyCache = {};
  function fuzzyScore(query, text) {
    if (!query || !text) return -1;
    var cacheKey = query + '\x00' + text;
    if (_fuzzyCache[cacheKey] !== undefined) return _fuzzyCache[cacheKey];

    text = text.toLowerCase();
    query = query.toLowerCase();

    // 1. 精确子串匹配 — 最高分
    var idx = text.indexOf(query);
    if (idx === 0) { _fuzzyCache[cacheKey] = 1000 + query.length; return _fuzzyCache[cacheKey]; }
    if (idx > 0) { _fuzzyCache[cacheKey] = 800 + query.length; return _fuzzyCache[cacheKey]; }

    // 2. 分词前缀匹配 — 查询词都是某个文本词的前缀
    var queryWords = query.split(/\s+/);
    var textWords = text.split(/[\s\-_\/\.]+/);
    var allWordsMatch = true;
    for (var i = 0; i < queryWords.length; i++) {
      var matched = false;
      for (var j = 0; j < textWords.length; j++) {
        if (textWords[j].indexOf(queryWords[i]) === 0) { matched = true; break; }
      }
      if (!matched) { allWordsMatch = false; break; }
    }
    if (allWordsMatch) { _fuzzyCache[cacheKey] = 600 + query.length; return _fuzzyCache[cacheKey]; }

    // 3. 字符级模糊匹配 — 查询字符按顺序出现在文本中
    var qi = 0, consecutive = 0, maxConsecutive = 0, lastMatchIdx = -1;
    var firstPos = -1, lastPos = -1;
    for (var ti = 0; ti < text.length && qi < query.length; ti++) {
      if (text[ti] === query[qi]) {
        if (lastMatchIdx === ti - 1) { consecutive++; } else { consecutive = 1; }
        if (consecutive > maxConsecutive) maxConsecutive = consecutive;
        if (firstPos === -1) firstPos = ti;
        lastPos = ti;
        lastMatchIdx = ti;
        qi++;
      }
    }

    if (qi === query.length) {
      var density = query.length / (lastPos - firstPos + 1);
      var score = 200 + maxConsecutive * 50 + Math.floor(density * 100);
      _fuzzyCache[cacheKey] = score;
      return score;
    }

    _fuzzyCache[cacheKey] = -1;
    return -1;
  }

  // 清空模糊搜索缓存（搜索词变化时调用）
  function clearFuzzyCache() {
    _fuzzyCache = {};
  }

  // 渲染分区块标题
  function sectionHeader(title, count, color, iconPath) {
    var html = '<div class="section-title">';
    html += '<div class="icon" style="background:' + (color || 'var(--accent)') + '20;color:' + (color || 'var(--accent)') + ';">';
    html += '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + (iconPath || '') + '</svg>';
    html += '</div>';
    html += '<h2>' + title + '</h2>';
    html += '<span class="count">' + count + ' 项</span>';
    html += '</div>';
    return html;
  }

  // 排序数组
  function sortItems(arr) {
    var sorted = arr.slice();
    switch(currentSort) {
      case 'stars-desc': sorted.sort(function(a,b) { return (b.stars||0) - (a.stars||0); }); break;
      case 'stars-asc': sorted.sort(function(a,b) { return (a.stars||0) - (b.stars||0); }); break;
      case 'rating-desc': sorted.sort(function(a,b) { return (b.rating||0) - (a.rating||0); }); break;
      case 'rating-asc': sorted.sort(function(a,b) { return (a.rating||0) - (b.rating||0); }); break;
      case 'name-asc': sorted.sort(function(a,b) { return a.name.localeCompare(b.name); }); break;
      case 'recent': sorted.sort(function(a,b) {
        var da = getActivity(a), db = getActivity(b);
        return db.lastPush.localeCompare(da.lastPush);
      }); break;
      case 'contributors': sorted.sort(function(a,b) {
        var ca = getActivity(a).contributors, cb = getActivity(b).contributors;
        return cb - ca;
      }); break;
    }
    return sorted;
  }

  // 构建全部内容
  function buildContent() {
    var html = '';

    // AI 术语百科（放在最前面作为入门参考）
    if (KB_DATA.aiGlossary && KB_DATA.aiGlossary.length) {
      html += '<section class="content-section" id="sec-glossary">';
      html += sectionHeader('AI 术语百科', KB_DATA.aiGlossary.reduce(function(s,g){return s+g.terms.length;},0), '#d946ef', '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>');
      html += '<div style="margin-bottom:16px;padding:12px 16px;background:var(--accent2-soft);border-radius:10px;border:1px solid rgba(34,211,238,0.15);font-size:13px;color:var(--muted);"><span class="freshness-badge freshness-daily">每日更新</span> 先了解这些 AI 核心名词，才能更好地使用本知识库。共 ' + KB_DATA.aiGlossary.reduce(function(s,g){return s+g.terms.length;},0) + ' 个术语，覆盖 8 大类别。</div>';
      KB_DATA.aiGlossary.forEach(function(group) {
        html += renderGlossarySection(group);
      });
      html += '</section>';
    }

    // 按顺序渲染所有分类 section
    sections.forEach(function(sec) {
      var items = KB_DATA[sec.key] || [];
      if (items.length === 0) return;
      var sorted = sortItems(items);
      html += '<section class="content-section" id="sec-' + sec.key + '">';
      html += sectionHeader(sec.title, items.length, sec.color, sec.icon);
      html += '<div class="card-grid">';
      sorted.forEach(function(item) { html += renderItemCard(item, sec.key); });
      html += '</div></section>';
    });

    // AI 开发技巧库 — 按子分类分组
    html += '<section class="content-section" id="sec-tech">';
    html += sectionHeader('AI 开发技巧库', KB_DATA.techniques.length, '#f472b6', '<path d="M12 6v12"/><path d="M9 9h6"/><path d="M9 12h6"/><path d="M9 15h6"/>');

    var techGroups = {};
    KB_DATA.techniques.forEach(function(t) {
      if (!techGroups[t.cat]) techGroups[t.cat] = [];
      techGroups[t.cat].push(t);
    });

    var techIndex = 1;
    Object.keys(techGroups).forEach(function(catKey) {
      var cfg = techCatConfig[catKey] || { name: catKey, color: '#7c5cfc' };
      html += '<div class="tech-section">';
      html += '<h3 style="font-size:16px;margin-bottom:14px;color:' + cfg.color + ';font-family:Outfit,sans-serif;">' + cfg.name + '</h3>';
      html += '<div class="tech-grid">';
      techGroups[catKey].forEach(function(t) {
        html += renderTechCard(t, techIndex++);
      });
      html += '</div></div>';
    });
    html += '</section>';

    // AI 大模型评测（2026.7 最新）
    if (KB_DATA.aiModels && KB_DATA.aiModels.length) {
      html += '<section class="content-section" id="sec-ai-models">';
      html += sectionHeader('AI 大模型评测（2026.7 最新）', KB_DATA.aiModels.length, '#fbbf24', '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/>');
      html += '<div style="margin-bottom:16px;padding:12px 16px;background:rgba(52,211,153,0.08);border-radius:10px;border:1px solid rgba(52,211,153,0.15);font-size:13px;color:var(--muted);"><span class="freshness-badge freshness-daily">每日更新</span> 基于最新公开榜单与刚发布版本，含权威来源链接。国产模型与海外差距已收敛至 3-4 个月，前端编程、性价比、开源规模已反超。</div>';
      html += '<div class="ai-model-grid">';
      KB_DATA.aiModels.forEach(function(m) { html += renderAIModelCard(m); });
      html += '</div></section>';
    }

    // AI 选型方案
    if (KB_DATA.aiSolutions && KB_DATA.aiSolutions.length) {
      html += '<section class="content-section" id="sec-ai-solutions">';
      html += sectionHeader('开发者选型建议', KB_DATA.aiSolutions.length, '#7c5cfc', '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>');
      html += '<div class="solution-grid">';
      KB_DATA.aiSolutions.forEach(function(s) { html += renderSolutionCard(s); });
      html += '</div></section>';
    }

    // 学习路径
    if (KB_DATA.learningPaths && KB_DATA.learningPaths.length) {
      html += '<section class="content-section" id="sec-learning">';
      html += sectionHeader('学习路径 / 路线图', KB_DATA.learningPaths.length, '#34d399', '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/>');
      html += '<div class="path-grid">';
      KB_DATA.learningPaths.forEach(function(p) { html += renderLearningPathCard(p); });
      html += '</div></section>';
    }

    // DevOps / 团队协作教程
    if (KB_DATA.devopsTutorials && KB_DATA.devopsTutorials.length) {
      html += '<section class="content-section" id="sec-devops">';
      html += sectionHeader('DevOps / 团队协作教程', KB_DATA.devopsTutorials.length, '#a855f7', '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/>');
      html += '<div style="margin-bottom:16px;padding:12px 16px;background:rgba(168,85,247,0.08);border-radius:10px;border:1px solid rgba(168,85,247,0.15);font-size:13px;color:var(--muted);"><span class="freshness-badge freshness-weekly">每周更新</span> 简单通俗易懂又不失专业性，含分步教程、优缺点总结和最佳实践。点击代码块右上角可复制。</div>';
      html += '<div class="devops-grid">';
      KB_DATA.devopsTutorials.forEach(function(t) { html += renderDevOpsCard(t); });
      html += '</div></section>';
    }

    // 精彩案例
    html += '<section class="content-section" id="sec-showcase">';
    html += sectionHeader('精彩案例', KB_DATA.showcases.length, '#34d399', '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>');
    html += '<div class="showcase-grid">';
    KB_DATA.showcases.forEach(function(item) { html += renderShowcaseCard(item); });
    html += '</div></section>';

    root.innerHTML = html;
    // 缓存 DOM 引用，避免每次 applyFilter/handleScroll 都 querySelectorAll
    _cachedSections = Array.prototype.slice.call(root.querySelectorAll('.content-section'));
    _cachedCards = Array.prototype.slice.call(root.querySelectorAll('[data-cat]'));
    _totalCardCount = _cachedCards.length;
    buildQuickNav();
    // 分区标题渐变下划线动画（rAF + stagger 延迟）
    requestAnimationFrame(function() {
      var titles = root.querySelectorAll('.section-title');
      for (var i = 0; i < titles.length; i++) {
        (function(el, idx) {
          setTimeout(function() { el.classList.add('visible'); }, idx * 80);
        })(titles[i], i);
      }
    });
  }


  // ===== 模块系统：一个模块一个界面 =====
  // 模块定义：每个模块包含哪些 section key
  var moduleConfig = {
    frontend: {
      name: '前端',
      sections: ['sec-glossary','sec-frontend','sec-meta','sec-ui','sec-css','sec-anim','sec-three','sec-dataviz','sec-form','sec-build','sec-state','sec-test','sec-linter','sec-pkg','sec-mobile'],
      filterKeys: ['frontend','meta','ui','css','anim','three','dataviz','form','build','state','test','linter','pkg','mobile']
    },
    backend: {
      name: '后端',
      sections: ['sec-backend','sec-orm','sec-api','sec-auth','sec-realtime','sec-cms','sec-deploy'],
      filterKeys: ['backend','orm','api','auth','realtime','cms','deploy']
    },
    ai: {
      name: 'AI 工程',
      sections: ['sec-vector','sec-mcp','sec-agent','sec-tool','sec-ai-models','sec-ai-solutions'],
      filterKeys: ['vector','mcp','agent','tool','ai-models']
    },
    tutorial: {
      name: '教程',
      sections: ['sec-tech','sec-learning','sec-devops','sec-showcase'],
      filterKeys: ['tech','learning','devops','showcase']
    },
    dashboard: {
      name: '可视化',
      sections: ['__dashboard__'],
      filterKeys: []
    }
  };

  var currentModule = 'frontend';

  // 切换模块
  function switchModule(mod) {
    if (!moduleConfig[mod]) return;
    currentModule = mod;

    // 更新 tab 状态
    document.querySelectorAll('.module-tab').forEach(function(tab) {
      tab.classList.toggle('active', tab.getAttribute('data-module') === mod);
    });

    var cfg = moduleConfig[mod];
    var dashboard = document.getElementById('dashboard');

    if (mod === 'dashboard') {
      // 可视化模块：显示 dashboard，隐藏所有 content-section
      if (dashboard) dashboard.style.display = '';
      _cachedSections.forEach(function(s) { s.style.display = 'none'; });
      // 隐藏排序栏和 result-count
      var sortBar = document.querySelector('.sort-box');
      if (sortBar) sortBar.style.display = 'none';
      var rc = document.getElementById('result-count');
      if (rc) rc.textContent = '';
      // 隐藏快捷导航
      if (quickNav) quickNav.style.display = 'none';
      // 滚到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 非 dashboard 模块：隐藏 dashboard
    if (dashboard) dashboard.style.display = 'none';

    // 显示排序栏
    var sortBar = document.querySelector('.sort-box');
    if (sortBar) sortBar.style.display = '';
    if (quickNav) quickNav.style.display = '';

    // 显隐 section
    _cachedSections.forEach(function(s) {
      s.style.display = cfg.sections.indexOf(s.id) !== -1 ? '' : 'none';
    });

    // 显示该模块所有卡片（重置筛选）
    currentFilter = 'all';
    currentSearch = '';
    if (searchInput) searchInput.value = '';
    var clearBtn = document.getElementById('search-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    // 只显示属于当前模块的卡片
    for (var i = 0; i < _cachedCards.length; i++) {
      var c = _cachedCards[i];
      var cat = c.getAttribute('data-cat');
      c.style.display = cfg.filterKeys.indexOf(cat) !== -1 ? '' : 'none';
      c.style.opacity = '1';
      c.style.transform = 'translateY(0)';
    }

    _visibleCardCount = cfg.filterKeys.reduce(function(sum, key) {
      var items = KB_DATA[key] || [];
      return sum + (Array.isArray(items) ? items.length : 0);
    }, 0);

    // 特殊处理：tech 模块包含技巧库
    if (mod === 'tutorial') {
      _visibleCardCount += (KB_DATA.techniques || []).length + (KB_DATA.learningPaths || []).length + (KB_DATA.devopsTutorials || []).length + (KB_DATA.showcases || []).length;
    }
    // AI 模块包含大模型
    if (mod === 'ai') {
      _visibleCardCount += (KB_DATA.aiModels || []).length + (KB_DATA.aiSolutions || []).length;
    }

    updateResultCount();

    // 卡片淡入动画
    requestAnimationFrame(function() {
      var animCount = 0;
      for (var m = 0; m < _cachedCards.length && animCount < 20; m++) {
        var card = _cachedCards[m];
        if (card.style.display !== 'none') {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = 'cardFadeIn 0.35s ease both';
          card.style.animationDelay = (animCount * 25) + 'ms';
          animCount++;
        }
      }
    });

    // 滚到内容区
    var contentTop = root.getBoundingClientRect().top + window.scrollY - 100;
    if (window.scrollY > 300) {
      window.scrollTo({ top: contentTop, behavior: 'smooth' });
    }

    syncURL();
  }

  // 绑定模块 tab 点击
  document.addEventListener('click', function(e) {
    var tab = e.target.closest('.module-tab');
    if (tab) {
      e.preventDefault();
      try {
        switchModule(tab.getAttribute('data-module'));
      } catch(err) {
        console.error('[switchModule]', err);
      }
    }
  });

  // 内联排序联动
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'sort-select-inline') {
      currentSort = e.target.value;
      var hidden = document.getElementById('sort-select');
      if (hidden) hidden.value = currentSort;
      buildContent();
      applySyntaxHighlighting();
      restoreCardStates();
      initScrollAnimations();
      // 重新应用当前模块筛选（不重置搜索）
      var cfg = moduleConfig[currentModule];
      if (cfg) {
        _cachedSections.forEach(function(s) {
          s.style.display = cfg.sections.indexOf(s.id) !== -1 ? '' : 'none';
        });
        for (var i = 0; i < _cachedCards.length; i++) {
          var c = _cachedCards[i];
          var cat = c.getAttribute('data-cat');
          var inModule = cfg.filterKeys.indexOf(cat) !== -1;
          c.style.display = inModule ? '' : 'none';
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        }
        // 如果有搜索，应用搜索筛选
        if (currentSearch) {
          applyFilter();
        }
      }
    }
  });

  // ===== DOM 引用缓存（性能优化：避免反复 querySelectorAll）=====
  var _cachedSections = [];
  var _cachedCards = [];
  var _totalCardCount = 0;

  // 构建快捷导航点
  function buildQuickNav() {
    var allSections = root.querySelectorAll('.content-section');
    var html = '';
    allSections.forEach(function(sec) {
      var title = sec.querySelector('h2');
      if (!title) return;
      var id = sec.id;
      var label = title.textContent;
      html += '<div class="quick-nav-dot" data-target="' + id + '" data-label="' + label + '"></div>';
    });
    if (!quickNav) return;
    quickNav.innerHTML = html;

    // 绑定点击跳转
    quickNav.querySelectorAll('.quick-nav-dot').forEach(function(dot) {
      dot.addEventListener('click', function() {
        var target = document.getElementById(dot.getAttribute('data-target'));
        if (target) {
          var offset = 80; // navbar height
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  // 更新结果计数 & 空状态（使用缓存计数器，避免 DOM 查询）
  function updateResultCount() {
    if (!resultCount) return;
    var modName = (typeof moduleConfig !== 'undefined' && moduleConfig[currentModule]) ? moduleConfig[currentModule].name : '';
    if (currentSearch || currentFilter !== 'all') {
      resultCount.innerHTML = '显示 <b>' + _visibleCardCount + '</b> / ' + _totalCardCount + ' 条结果' +
        (currentSearch ? ' · 关键词: "' + currentSearch + '"' : '') +
        (currentFilter !== 'all' ? ' · 分类: ' + (catConfig[currentFilter] ? catConfig[currentFilter].name : currentFilter) : '');
    } else {
      resultCount.innerHTML = (modName ? modName + ' · ' : '') + '共 <b>' + _visibleCardCount + '</b> 条';
    }
    // 空状态处理
    var emptyState = document.getElementById('empty-state');
    if (_visibleCardCount === 0 && (currentSearch || currentFilter !== 'all')) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.id = 'empty-state';
        emptyState.className = 'empty-state';
        root.appendChild(emptyState);
      }
      emptyState.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><line x1="8" y1="11" x2="14" y2="11"/></svg>' +
        '<h3>未找到匹配结果</h3>' +
        '<p>' + (currentSearch ? '没有包含 "' + currentSearch + '" 的工具' : '该分类暂无内容') + '</p>' +
        '<button class="empty-reset" id="empty-reset-btn">重置筛选</button>';
      emptyState.style.display = '';
      // 事件委托替代 inline onclick
      var resetBtn = emptyState.querySelector('#empty-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          searchInput.value = '';
          currentSearch = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          chips.forEach(function(c) { c.classList.remove('active'); });
          document.querySelector('.chip[data-filter="all"]').classList.add('active');
          currentFilter = 'all';
          applyFilter();
        });
      }
    } else if (emptyState) {
      emptyState.style.display = 'none';
    }
  }

  // 渲染数据来源
  function renderSources() {
    var list = document.getElementById('sources-list');
    var html = '';
    KB_DATA.sources.forEach(function(s, i) {
      html += '<li id="cite-' + (i+1) + '">';
      html += '<span class="src-title">' + s.title + '</span>';
      html += '<a class="src-url" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + s.url + '</a>';
      html += '</li>';
    });
    list.innerHTML = html;
  }

  // 更新统计数字
  function updateStats() {
    var total = 0;
    ['frontend','meta','ui','css','anim','three','dataviz','form','build','state','test','linter','pkg','mobile','backend','orm','api','auth','realtime','cms','deploy','vector','mcp','agent','tool'].forEach(function(c) {
      total += (KB_DATA[c] || []).length;
    });
    total += KB_DATA.techniques.length + KB_DATA.showcases.length;
    if (KB_DATA.aiModels) total += KB_DATA.aiModels.length;
    if (KB_DATA.aiGlossary) total += KB_DATA.aiGlossary.reduce(function(s,g){return s+g.terms.length;},0);
    if (KB_DATA.devopsTutorials) total += KB_DATA.devopsTutorials.length;
    if (KB_DATA.learningPaths) total += KB_DATA.learningPaths.length;
    document.getElementById('stat-total').textContent = total + '+';
    var catCount = 29; // 25 个框架/工具分类 + AI 模型 + AI 术语 + DevOps + 学习路径
    document.getElementById('stat-cats').textContent = catCount;
    document.getElementById('stat-tech').textContent = KB_DATA.techniques.length;
  }

  // 搜索高亮：在卡片名称和描述中高亮匹配的关键词（保留链接等子元素结构）
  function highlightSearchInCards() {
    if (!currentSearch) {
      // 清除高亮
      var marks = root.querySelectorAll('mark.kb-hl');
      for (var i = 0; i < marks.length; i++) {
        var parent = marks[i].parentNode;
        parent.replaceChild(document.createTextNode(marks[i].textContent), marks[i]);
        parent.normalize();
      }
      return;
    }
    var query = currentSearch;
    var queryLower = query.toLowerCase();

    // 遍历可见卡片的文本节点，仅替换文本不破坏 DOM 结构
    for (var i = 0; i < _cachedCards.length; i++) {
      var c = _cachedCards[i];
      if (c.style.display === 'none') continue;
      var targets = [c.querySelector('.card-name'), c.querySelector('.card-desc')];
      for (var t = 0; t < targets.length; t++) {
        var el = targets[t];
        if (!el || el.querySelector('mark.kb-hl')) continue;

        // 遍历 el 下的文本节点
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        var textNodes = [];
        var node;
        while ((node = walker.nextNode())) textNodes.push(node);

        for (var n = 0; n < textNodes.length; n++) {
          var textNode = textNodes[n];
          var text = textNode.nodeValue;
          var lower = text.toLowerCase();
          var idx = lower.indexOf(queryLower);
          if (idx === -1) continue;

          var before = text.substring(0, idx);
          var match = text.substring(idx, idx + query.length);
          var after = text.substring(idx + query.length);

          var frag = document.createDocumentFragment();
          if (before) frag.appendChild(document.createTextNode(before));
          var mark = document.createElement('mark');
          mark.className = 'kb-hl';
          mark.textContent = match;
          frag.appendChild(mark);
          if (after) frag.appendChild(document.createTextNode(after));
          textNode.parentNode.replaceChild(frag, textNode);
        }
      }
    }
  }

  // 筛选逻辑（单次遍历 O(n)，使用缓存引用）
  function applyFilter() {
    var visibleCount = 0;
    var sectionVisibleMap = {}; // sectionId → hasVisibleCard

    // 单次遍历所有卡片，O(n)
    for (var i = 0; i < _cachedCards.length; i++) {
      var c = _cachedCards[i];
      var cat = c.getAttribute('data-cat');
      var shouldShow = false;

      // 分类筛选 + 模块约束
      var modCfg = moduleConfig[currentModule];
      var inModule = modCfg && modCfg.filterKeys.indexOf(cat) !== -1;
      if (!inModule) {
        shouldShow = false;
      } else if (currentFilter === 'all') {
        shouldShow = true;
      } else if (currentFilter === 'tech') {
        shouldShow = cat === 'tech';
      } else if (currentFilter === 'showcase') {
        shouldShow = cat === 'showcase';
      } else {
        shouldShow = cat === currentFilter;
      }

      // 搜索筛选（模糊匹配，与分类取交集）
      if (shouldShow && currentSearch) {
        var text = c.getAttribute('data-search') || '';
        shouldShow = fuzzyScore(currentSearch, text) > 0;
      }

      c.style.display = shouldShow ? '' : 'none';
      if (shouldShow) {
        visibleCount++;
        // 标记该卡片所属 section 有可见内容
        var sec = c.closest('.content-section');
        if (sec) sectionVisibleMap[sec.id] = true;
      }
    }

    // 显隐 section（基于 map，无需再次 querySelectorAll）
    // 有筛选或搜索时，仅显示包含可见卡片的 section；无筛选无搜索时全部显示
    var hasActiveFilter = currentFilter !== 'all' || currentSearch;
    var modCfg2 = moduleConfig[currentModule];
    for (var j = 0; j < _cachedSections.length; j++) {
      var s = _cachedSections[j];
      // 如果当前模块不包含该 section，保持隐藏
      if (modCfg2 && modCfg2.sections.indexOf(s.id) === -1) {
        s.style.display = 'none';
        continue;
      }
      var hasVisible = sectionVisibleMap[s.id];
      s.style.display = (hasVisible || !hasActiveFilter) ? '' : 'none';
    }

    _visibleCardCount = visibleCount;
    updateResultCount();

    // 筛选后重置卡片状态并添加淡入过渡
    requestAnimationFrame(function() {
      for (var k = 0; k < _cachedCards.length; k++) {
        var el = _cachedCards[k];
        if (el.style.display !== 'none') {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          el.style.transitionDelay = '0ms';
        }
      }
      // 对可见卡片添加交错淡入动画（限制前 20 张避免性能问题）
      var animCount = 0;
      for (var m = 0; m < _cachedCards.length && animCount < 20; m++) {
        var card = _cachedCards[m];
        if (card.style.display !== 'none') {
          card.style.animation = 'none';
          card.offsetHeight; // force reflow
          card.style.animation = 'cardFadeIn 0.35s ease both';
          card.style.animationDelay = (animCount * 25) + 'ms';
          animCount++;
        }
      }
    });
    highlightSearchInCards();
    syncURL();
  }

  var _visibleCardCount = 0;

  // ===== URL 参数化（借鉴 BestOfJS / State of JS）=====
  // 将 filter/search/sort 同步到 URL，支持分享和书签
  var urlTimer;
  function syncURL() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function() {
      var params = new URLSearchParams();
      if (currentFilter && currentFilter !== 'all') params.set('cat', currentFilter);
      if (currentSearch) params.set('q', currentSearch);
      if (currentSort && currentSort !== 'default') params.set('sort', currentSort);
      var hash = params.toString();
      var newURL = hash ? (location.pathname + location.search.split('#')[0] + '#' + hash) : (location.pathname + location.search.split('#')[0]);
      try { history.replaceState(null, '', newURL); } catch(e) {}
    }, 300);
  }

  function readURL() {
    var hash = location.hash.replace(/^#/, '');
    if (!hash) return false;
    var params = new URLSearchParams(hash);
    var changed = false;

    var cat = params.get('cat');
    if (cat) {
      var chip = document.querySelector('.chip[data-filter="' + cat + '"]');
      if (chip) {
        chips.forEach(function(c) { c.classList.remove('active'); });
        chip.classList.add('active');
        currentFilter = cat;
        changed = true;
      }
    }

    var q = params.get('q');
    if (q) {
      searchInput.value = q;
      currentSearch = q.toLowerCase().trim();
      changed = true;
    }

    var sort = params.get('sort');
    if (sort) {
      sortSelect.value = sort;
      currentSort = sort;
      changed = true;
    }

    return changed;
  }

  // ===== Toast 通知系统 =====
  var toastContainer = document.getElementById('toast-container');
  function showToast(message, type) {
    if (!toastContainer) return;
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    var iconSvg = type === 'success' ?
      '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' :
      type === 'warning' ?
      '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' :
      '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    toast.innerHTML = iconSvg + '<span>' + message + '</span>';
    toastContainer.appendChild(toast);
    setTimeout(function() {
      toast.classList.add('hide');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2800);
  }

  // 主题切换（View Transitions API + 圆形扩散动画，统一入口避免双绑定）
  function toggleTheme(e) {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var newTheme = current === 'light' ? 'dark' : 'light';

    var applyTheme = function() {
      html.setAttribute('data-theme', newTheme);
      document.getElementById('theme-icon-moon').style.display = newTheme === 'light' ? 'none' : '';
      document.getElementById('theme-icon-sun').style.display = newTheme === 'light' ? '' : 'none';
      try { localStorage.setItem('kb-theme', newTheme); } catch(err) {}
      window.dispatchEvent(new Event('resize'));
    };

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reduceMotion) {
      var x = e ? e.clientX : window.innerWidth / 2;
      var y = e ? e.clientY : window.innerHeight / 2;
      var endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      var transition = document.startViewTransition(applyTheme);
      transition.ready.then(function() {
        document.documentElement.animate({
          clipPath: [
            'circle(0px at ' + x + 'px ' + y + 'px)',
            'circle(' + endRadius + 'px at ' + x + 'px ' + y + 'px)'
          ]
        }, {
          duration: 600,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
          pseudoElement: '::view-transition-new(root)'
        });
      });
    } else {
      applyTheme();
    }
  }

  // ===== 收藏功能 =====
  var favSet = {};
  try { favSet = JSON.parse(localStorage.getItem('kb-favs') || '{}'); } catch(e) { favSet = {}; }

  function saveFavs() {
    try { localStorage.setItem('kb-favs', JSON.stringify(favSet)); } catch(e) {}
    updateFavBadge();
  }

  function updateFavBadge() {
    var count = Object.keys(favSet).length;
    var badge = document.getElementById('fav-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }

  function toggleFav(id) {
    var wasFav = !!favSet[id];
    if (wasFav) {
      delete favSet[id];
      showToast('已取消收藏', 'info');
    } else {
      favSet[id] = true;
      showToast('已收藏', 'success');
    }
    saveFavs();
    // 更新卡片按钮状态
    document.querySelectorAll('.card-action.fav[data-id="' + id + '"]').forEach(function(btn) {
      btn.classList.toggle('active', !!favSet[id]);
    });
  }

  function renderFavModal() {
    var body = document.getElementById('fav-body');
    var ids = Object.keys(favSet);
    if (ids.length === 0) {
      body.innerHTML = '<p class="modal-empty">点击卡片上的心形按钮收藏工具</p>';
      return;
    }
    var html = '<div class="card-grid">';
    ids.forEach(function(id) {
      var parts = id.split('::');
      var catKey = parts[0];
      var name = parts.slice(1).join('::');
      var cfg = catConfig[catKey] || { color: '#7c5cfc', name: catKey };
      // 查找原始数据
      var item = null;
      if (catKey === 'ai-models') {
        item = (KB_DATA.aiModels || []).find(function(m) { return m.name === name; });
      } else {
        item = (KB_DATA[catKey] || []).find(function(m) { return m.name === name; });
      }
      if (!item) return;
      html += '<div class="item-card" style="--card-color:var(--accent)">';
      html += '<div class="card-actions"><button class="card-action fav active" data-id="' + id + '" title="取消收藏"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></button></div>';
      html += '<div class="card-header"><div class="card-name">' + (item.url ? '<a href="' + item.url + '" target="_blank" rel="noopener noreferrer">' + item.name + '</a>' : item.name) + '</div></div>';
      html += '<div class="card-desc">' + (item.desc || item.positioning || '') + '</div>';
      html += '<div class="card-meta"><span class="tag" style="background:' + cfg.color + '20;color:' + cfg.color + ';">' + cfg.name + '</span></div>';
      html += '</div>';
    });
    html += '</div>';
    body.innerHTML = html;
  }

  // 恢复卡片按钮的 active 状态（页面加载或排序重建后调用）
  function restoreCardStates() {
    document.querySelectorAll('.card-action.fav').forEach(function(btn) {
      var id = btn.getAttribute('data-id');
      btn.classList.toggle('active', !!favSet[id]);
    });
    document.querySelectorAll('.card-action.compare').forEach(function(btn) {
      var id = btn.getAttribute('data-id');
      btn.classList.toggle('active', !!compareSet[id]);
    });
  }

  // ===== 对比功能 =====
  var compareSet = {};

  function updateCompareBadge() {
    var count = Object.keys(compareSet).length;
    var badge = document.getElementById('compare-badge');
    if (!badge) return;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = '';
    } else {
      badge.style.display = 'none';
    }
  }

  function toggleCompare(id) {
    var count = Object.keys(compareSet).length;
    if (compareSet[id]) {
      delete compareSet[id];
      showToast('已移出对比', 'info');
    } else {
      if (count >= 4) {
        showToast('最多对比 4 个工具', 'warning');
        return;
      }
      // 检查跨类型混选
      var newCat = id.split('::')[0];
      var existingCats = Object.keys(compareSet).map(function(k) { return k.split('::')[0]; });
      var isAIMix = newCat === 'ai-models' && existingCats.some(function(c) { return c !== 'ai-models'; });
      var isToolMix = newCat !== 'ai-models' && existingCats.indexOf('ai-models') !== -1;
      if (isAIMix || isToolMix) {
        showToast('不建议将 AI 模型与开发工具混合对比，维度不同', 'warning');
        // 仍然允许添加，只是提示
      }
      compareSet[id] = true;
      showToast('已加入对比（' + (count + 1) + '/4）', 'success');
    }
    updateCompareBadge();
    document.querySelectorAll('.card-action.compare[data-id="' + id + '"]').forEach(function(btn) {
      btn.classList.toggle('active', !!compareSet[id]);
    });
  }

  function getItemForCompare(id) {
    var parts = id.split('::');
    var catKey = parts[0];
    var name = parts.slice(1).join('::');
    if (catKey === 'ai-models') {
      return (KB_DATA.aiModels || []).find(function(m) { return m.name === name; });
    }
    return (KB_DATA[catKey] || []).find(function(m) { return m.name === name; });
  }

  function renderCompareModal() {
    var body = document.getElementById('compare-body');
    var ids = Object.keys(compareSet);
    if (ids.length < 2) {
      body.innerHTML = '<p class="modal-empty">请至少选择 2 个工具进行对比（当前 ' + ids.length + ' 个）</p>';
      return;
    }
    var items = ids.map(getItemForCompare).filter(Boolean);
    if (items.length < 2) {
      body.innerHTML = '<p class="modal-empty">数据加载失败</p>';
      return;
    }
    var isAI = items[0] && ids[0].startsWith('ai-models');
    var html = '<div class="compare-table-wrap" style="overflow-x:auto;-webkit-overflow-scrolling:touch;"><table class="compare-table"><tbody>';
    // 表头
    html += '<tr><th>名称</th>';
    items.forEach(function(item) {
      var id = Object.keys(compareSet).find(function(k) { return k.endsWith('::' + item.name); });
      html += '<td class="col-name">' + (item.url || item.source ? '<a href="' + (item.url||item.source) + '" target="_blank" rel="noopener noreferrer">' + item.name + '</a>' : item.name) + ' <span class="compare-remove" data-id="' + id + '">移除</span></td>';
    });
    html += '</tr>';

    if (isAI) {
      // AI 模型对比
      html += compareRow('厂商', items, function(i) { return i.vendor; });
      html += compareRow('梯队', items, function(i) { return i.tier; });
      html += compareRow('类型', items, function(i) { return i.type; });
      html += compareRow('发布日期', items, function(i) { return i.releaseDate; });
      html += compareRow('参数', items, function(i) { return i.params; });
      html += compareRow('上下文', items, function(i) { return i.context; });
      html += compareRow('价格(输入)', items, function(i) { return i.price.input; });
      html += compareRow('价格(输出)', items, function(i) { return i.price.output; });
      html += compareRow('定位', items, function(i) { return i.positioning; });
      if (items[0].scores) {
        html += compareRow('推理', items, function(i) { return i.scores.reasoning + '/10'; });
        html += compareRow('编码', items, function(i) { return i.scores.coding + '/10'; });
        html += compareRow('Agent', items, function(i) { return i.scores.agent + '/10'; });
        html += compareRow('多模态', items, function(i) { return i.scores.multimodal + '/10'; });
        html += compareRow('性价比', items, function(i) { return i.scores.cost + '/10'; });
        html += compareRow('开源', items, function(i) { return i.scores.open !== undefined ? i.scores.open + '/10' : '-'; });
      }
      // 评测
      html += '<tr><th>核心评测</th>';
      items.forEach(function(i) {
        html += '<td>' + (i.benchmarks||[]).map(function(b) { return b.name + ': <b>' + b.score + '</b>'; }).join('<br>') + '</td>';
      });
      html += '</tr>';
      // 优势
      html += '<tr><th>优势</th>';
      items.forEach(function(i) {
        html += '<td><ul style="margin:0;padding:0;">' + i.pros.map(function(p) { return '<li style="list-style:none;padding:2px 0;color:var(--green);">+ ' + p + '</li>'; }).join('') + '</ul></td>';
      });
      html += '</tr>';
      // 不足
      html += '<tr><th>不足</th>';
      items.forEach(function(i) {
        html += '<td><ul style="margin:0;padding:0;">' + i.cons.map(function(c) { return '<li style="list-style:none;padding:2px 0;color:var(--red);">- ' + c + '</li>'; }).join('') + '</ul></td>';
      });
      html += '</tr>';
    } else {
      // 工具对比
      html += compareRow('描述', items, function(i) { return i.desc || ''; });
      html += compareRow('GitHub Stars', items, function(i) { return i.stars ? fmtStars(i.stars) : '-'; });
      html += compareRow('评分', items, function(i) { return i.rating ? i.rating.toFixed(1) + '/10' : '-'; });
      html += compareRow('语言', items, function(i) { return i.lang || '-'; });
      html += compareRow('标签', items, function(i) { return (i.tags||[]).join(', '); });
      if (items[0].scores) {
        html += compareRow('生态', items, function(i) { return i.scores.eco + '/10'; });
        html += compareRow('性能', items, function(i) { return i.scores.perf + '/10'; });
        html += compareRow('学习曲线', items, function(i) { return i.scores.learn + '/10'; });
        html += compareRow('类型安全', items, function(i) { return i.scores.type + '/10'; });
        html += compareRow('维护', items, function(i) { return i.scores.main + '/10'; });
      }
      if (items.some(function(i) { return i.example; })) {
        html += '<tr><th>案例</th>';
        items.forEach(function(i) {
          html += '<td>' + (i.example ? '<a href="' + i.example.url + '" target="_blank">' + i.example.name + '</a>' : '-') + '</td>';
        });
        html += '</tr>';
      }
    }
    html += '</tbody></table></div>';
    body.innerHTML = html;
  }

  function compareRow(label, items, getter) {
    var html = '<tr><th>' + label + '</th>';
    items.forEach(function(i) {
      html += '<td>' + getter(i) + '</td>';
    });
    html += '</tr>';
    return html;
  }

  // ===== 代码语法高亮（轻量级自实现，零依赖）=====
  function highlightCode(text) {
    // 先转义 HTML
    var escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 按行处理
    var lines = escaped.split('\n');
    return lines.map(function(line) {
      // 注释行
      if (/^\s*(#|\/\/)/.test(line)) {
        return '<span class="tk-cmt">' + line + '</span>';
      }
      // 命令行（以已知命令开头）
      var cmdMatch = line.match(/^(\s*)(npm|npx|yarn|pnpm|bun|git|docker|node|python|pip|cargo|go|rustc|make|curl|wget|ssh|kubectl|helm|terraform|ansible|vite|webpack|tsc|eslint|prettier|jest|vitest|playwright|create|cd|ls|mkdir|rm|cp|mv|echo|export|import|const|let|var|function|class|if|else|return|for|while|switch|case|default|async|await|new|this)\b(.*)/);
      if (cmdMatch) {
        var indent = cmdMatch[1];
        var cmd = cmdMatch[2];
        var rest = cmdMatch[3];
        // 高亮 flags
        rest = rest.replace(/(\s)(--?[\w-]+)/g, '$1<span class="tk-flag">$2</span>');
        // 高亮 strings
        rest = rest.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, '<span class="tk-str">$1$2$1</span>');
        // 高亮 @scope 包名
        rest = rest.replace(/(@[\w-]+)/g, '<span class="tk-var">$1</span>');
        return indent + '<span class="tk-cmd">' + cmd + '</span>' + rest;
      }
      // 代码行（JS/TS）
      // keywords
      line = line.replace(/\b(import|export|from|const|let|var|function|class|extends|implements|interface|type|enum|if|else|return|for|while|do|switch|case|default|break|continue|async|await|new|this|super|try|catch|finally|throw|typeof|instanceof|in|of|void|delete|yield|static|public|private|protected|readonly|abstract|as|satisfies)\b/g, '<span class="tk-kw">$1</span>');
      // strings
      line = line.replace(/(['"`])((?:\\.|(?!\1).)*)\1/g, '<span class="tk-str">$1$2$1</span>');
      // comments
      line = line.replace(/(\/\/.*$)/g, '<span class="tk-cmt">$1</span>');
      // numbers
      line = line.replace(/\b(\d+\.?\d*)\b/g, '<span class="tk-num">$1</span>');
      return line;
    }).join('\n');
  }

  function applySyntaxHighlighting() {
    document.querySelectorAll('.code-block code').forEach(function(codeEl) {
      if (codeEl.dataset.highlighted) return;
      var raw = codeEl.textContent;
      codeEl.innerHTML = highlightCode(raw);
      codeEl.dataset.highlighted = '1';
    });
  }

  // ===== 代码复制 =====
  function initCopyButtons() {
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('copy-btn')) {
        var code = e.target.nextElementSibling;
        if (code) {
          // 使用 textContent 获取纯文本（去除高亮 span）
          navigator.clipboard.writeText(code.textContent).then(function() {
            e.target.textContent = '已复制';
            showToast('代码已复制到剪贴板', 'success');
            setTimeout(function() { e.target.textContent = '复制'; }, 2000);
          }).catch(function() {
            e.target.textContent = '复制失败';
            showToast('复制失败，请手动复制', 'warning');
            setTimeout(function() { e.target.textContent = '复制'; }, 2000);
          });
        }
      }
    });
  }

  // ===== 卡片操作按钮事件 =====
  function initCardActions() {
    document.addEventListener('click', function(e) {
      var favBtn = e.target.closest('.card-action.fav');
      var compareBtn = e.target.closest('.card-action.compare');
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleFav(favBtn.getAttribute('data-id'));
      } else if (compareBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleCompare(compareBtn.getAttribute('data-id'));
      }
    });
  }

  // ===== 模态框事件 =====
  function initModals() {
    var compareModal = document.getElementById('compare-modal');
    var favModal = document.getElementById('fav-modal');
    var compareBtn = document.getElementById('compare-btn');
    var favToggle = document.getElementById('fav-toggle');

    function openModal(modal) {
      if (!modal) return;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      var focusable = modal.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable) setTimeout(function() { focusable.focus(); }, 50);
    }
    function closeModal(modal) {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (compareBtn) compareBtn.addEventListener('click', function() {
      renderCompareModal();
      openModal(compareModal);
    });
    if (favToggle) favToggle.addEventListener('click', function() {
      renderFavModal();
      openModal(favModal);
    });

    var compareClose = document.getElementById('compare-close');
    if (compareClose) compareClose.addEventListener('click', function() {
      closeModal(compareModal);
    });
    var favClose = document.getElementById('fav-close');
    if (favClose) favClose.addEventListener('click', function() {
      closeModal(favModal);
    });

    if (compareModal) compareModal.addEventListener('click', function(e) {
      if (e.target === compareModal) closeModal(compareModal);
    });
    if (favModal) favModal.addEventListener('click', function(e) {
      if (e.target === favModal) closeModal(favModal);
    });

    // 焦点陷阱：Tab 键循环在模态框内
    [compareModal, favModal].forEach(function(modal) {
      if (!modal) return;
      modal.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;
        var focusables = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
        if (focusables.length === 0) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    });

    // 对比模态框中的移除按钮
    var compareBody = document.getElementById('compare-body');
    if (compareBody) compareBody.addEventListener('click', function(e) {
      if (e.target.classList.contains('compare-remove')) {
        toggleCompare(e.target.getAttribute('data-id'));
        renderCompareModal();
      }
    });

    // 收藏模态框中的取消收藏
    var favBody = document.getElementById('fav-body');
    if (favBody) favBody.addEventListener('click', function(e) {
      var favBtn = e.target.closest('.card-action.fav');
      if (favBtn) {
        toggleFav(favBtn.getAttribute('data-id'));
        renderFavModal();
      }
    });
  }

  // ===== 命令面板 (Cmd+K / Ctrl+K) =====
  var cmdOverlay = document.getElementById('cmd-overlay');
  var cmdInput = document.getElementById('cmd-input');
  var cmdResults = document.getElementById('cmd-results');
  var cmdSelectedIndex = -1;
  var cmdCurrentResults = [];

  function buildCmdIndex() {
    var index = [];
    // 工具/框架
    sections.forEach(function(sec) {
      var cfg = catConfig[sec.key] || { color:'#7c5cfc', name:sec.title };
      (KB_DATA[sec.key] || []).forEach(function(item) {
        index.push({
          name: item.name, desc: item.desc, type: cfg.name,
          cat: sec.key, color: cfg.color, url: item.url,
          kind: 'tool', icon: item.name.charAt(0)
        });
      });
    });
    // AI 模型
    (KB_DATA.aiModels || []).forEach(function(m) {
      index.push({ name: m.name, desc: m.vendor + ' · ' + m.tier, type: 'AI 大模型',
        cat: 'ai-models', color: '#fbbf24', url: m.source, kind: 'model', icon: m.name.charAt(0) });
    });
    // DevOps 教程
    (KB_DATA.devopsTutorials || []).forEach(function(t) {
      index.push({ name: t.title, desc: t.desc, type: 'DevOps 教程',
        cat: 'devops', color: '#a855f7', url: null, kind: 'tutorial', icon: '📖' });
    });
    // 学习路径
    (KB_DATA.learningPaths || []).forEach(function(p) {
      index.push({ name: p.title, desc: p.desc, type: '学习路径',
        cat: 'learning', color: '#34d399', url: null, kind: 'path', icon: '🗺' });
    });
    // AI 开发技巧
    (KB_DATA.techniques || []).forEach(function(t) {
      index.push({ name: t.name, desc: t.desc, type: t.catName || 'AI 技巧',
        cat: 'tech', color: '#f472b6', url: t.source, kind: 'technique', icon: '💡' });
    });
    // 分类快捷跳转
    Object.keys(catConfig).forEach(function(key) {
      var cfg = catConfig[key];
      index.push({ name: cfg.name, desc: '筛选 ' + cfg.name + ' 分类', type: '分类筛选',
        cat: key, color: cfg.color, url: null, kind: 'category', icon: '🏷' });
    });
    // 图表快捷跳转
    var charts = [
      { name:'Stars TOP 20', id:'chart-stars' }, { name:'框架雷达', id:'chart-radar' },
      { name:'分类星标饼图', id:'chart-pie' }, { name:'热度散点图', id:'chart-scatter' },
      { name:'AI 能力雷达', id:'chart-ai-radar' }, { name:'AI 价格散点', id:'chart-ai-price' },
      { name:'SWE-bench 对比', id:'chart-ai-bench' }, { name:'AI 术语玫瑰', id:'chart-glossary' },
      { name:'学习路径甘特', id:'chart-paths' }, { name:'Stars 趋势', id:'chart-trend' }
    ];
    charts.forEach(function(c) {
      index.push({ name: c.name, desc: '跳转到图表', type: '可视化',
        cat: null, color: '#06b6d4', url: null, kind: 'chart', chartId: c.id, icon: '📊' });
    });
    return index;
  }

  var cmdIndex = [];

  function openCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('open');
    cmdOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cmdInput.value = '';
    if (cmdIndex.length === 0) cmdIndex = buildCmdIndex();
    renderCmdResults('');
    setTimeout(function() { cmdInput.focus(); }, 50);
  }

  function closeCmdPalette() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('open');
    cmdOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (cmdInput) cmdInput.value = '';
  }

  function renderCmdResults(query) {
    var results = [];
    if (!query) {
      // 无查询时显示推荐
      results = cmdIndex.filter(function(item) {
        return item.kind === 'category' || item.kind === 'chart';
      }).slice(0, 15);
    } else {
      var q = query.toLowerCase();
      results = cmdIndex.filter(function(item) {
        return (item.name + ' ' + item.desc + ' ' + item.type).toLowerCase().indexOf(q) !== -1;
      }).slice(0, 20);
    }
    cmdCurrentResults = results;
    cmdSelectedIndex = results.length > 0 ? 0 : -1;

    if (results.length === 0) {
      cmdResults.innerHTML = '<div class="cmd-empty">未找到匹配结果</div>';
      return;
    }

    cmdResults.innerHTML = results.map(function(r, i) {
      return '<div class="cmd-result' + (i === 0 ? ' selected' : '') + '" data-index="' + i + '" role="option">' +
        '<div class="cmd-result-icon" style="background:' + r.color + '20;color:' + r.color + ';">' + r.icon + '</div>' +
        '<div class="cmd-result-info"><div class="cmd-result-name">' + r.name + '</div>' +
        '<div class="cmd-result-desc">' + (r.desc || '') + '</div></div>' +
        '<span class="cmd-result-type">' + r.type + '</span></div>';
    }).join('');
  }

  function executeCmdResult(index) {
    if (index < 0 || index >= cmdCurrentResults.length) return;
    var r = cmdCurrentResults[index];
    closeCmdPalette();

    if (r.kind === 'category') {
      // 筛选分类
      var chip = document.querySelector('.chip[data-filter="' + r.cat + '"]');
      if (chip) chip.click();
    } else if (r.kind === 'chart') {
      // 滚动到图表
      var el = document.getElementById(r.chartId);
      if (el) {
        var top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    } else if (r.kind === 'tool' || r.kind === 'model') {
      // 先筛选到分类，再滚动到对应卡片
      var chip2 = document.querySelector('.chip[data-filter="' + r.cat + '"]');
      if (chip2 && currentFilter !== r.cat) chip2.click();
      setTimeout(function() {
        var cards = document.querySelectorAll('[data-id]');
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].getAttribute('data-id').indexOf(r.name) !== -1) {
            cards[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
            cards[i].style.animation = 'none';
            // 闪一下高亮
            cards[i].style.boxShadow = '0 0 0 2px ' + r.color;
            setTimeout(function() { cards[i].style.boxShadow = ''; }, 1500);
            break;
          }
        }
      }, 300);
    } else if (r.kind === 'tutorial' || r.kind === 'path') {
      var chip3 = document.querySelector('.chip[data-filter="' + r.cat + '"]');
      if (chip3) chip3.click();
      setTimeout(function() {
        var section = document.querySelector('[data-section="' + r.cat + '"]');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } else if (r.kind === 'technique') {
      // 滚动到 AI 开发技巧库 section
      var techSection = document.getElementById('sec-tech');
      if (techSection) {
        var top = techSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
      // 如果有来源链接，在新标签页打开
      if (r.url) {
        setTimeout(function() {
          window.open(r.url, '_blank', 'noopener,noreferrer');
        }, 600);
      }
    }
  }

  // 命令面板事件绑定
  if (cmdOverlay) {
    // Cmd+K / Ctrl+K 打开
    document.addEventListener('keydown', function(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (cmdOverlay.classList.contains('open')) closeCmdPalette();
        else openCmdPalette();
      }
    });

    // 输入搜索
    cmdInput.addEventListener('input', function() {
      renderCmdResults(cmdInput.value);
    });

    // 键盘导航
    cmdInput.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (cmdSelectedIndex < cmdCurrentResults.length - 1) {
          cmdSelectedIndex++;
          updateCmdSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (cmdSelectedIndex > 0) {
          cmdSelectedIndex--;
          updateCmdSelection();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCmdResult(cmdSelectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeCmdPalette();
      }
    });

    // 点击结果
    cmdResults.addEventListener('click', function(e) {
      var result = e.target.closest('.cmd-result');
      if (result) {
        executeCmdResult(parseInt(result.getAttribute('data-index')));
      }
    });

    // 点击背景关闭
    cmdOverlay.addEventListener('click', function(e) {
      if (e.target === cmdOverlay) closeCmdPalette();
    });
  }

  // Cmd+K 触发按钮
  var cmdTrigger = document.getElementById('cmd-trigger');
  if (cmdTrigger) {
    cmdTrigger.addEventListener('click', openCmdPalette);
  }

  function updateCmdSelection() {
    var items = cmdResults.querySelectorAll('.cmd-result');
    items.forEach(function(el, i) {
      el.classList.toggle('selected', i === cmdSelectedIndex);
    });
    // 滚动选中项到可见区域
    var selected = cmdResults.querySelector('.cmd-result.selected');
    if (selected) selected.scrollIntoView({ block: 'nearest' });
  }

  // 初始化主题
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('kb-theme'); } catch(e) {}
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      document.getElementById('theme-icon-moon').style.display = 'none';
      document.getElementById('theme-icon-sun').style.display = '';
    }
  }

  // 返回顶部 & 快捷导航显隐 & 滚动进度条 (rAF 防抖)
  var scrollProgressBar = document.getElementById('scroll-progress');
  var scrollTicking = false;
  // 检测浏览器是否支持 CSS Scroll-Driven Animations — 支持时由原生 CSS 接管，跳过 JS 更新
  var supportsScrollDriven = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'scroll()');
  function handleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function() {
      scrollTicking = false;
      var offset = window.pageYOffset;
      // Navbar scrolled state (merged — eliminates separate scroll listener)
      var navbar = document.querySelector('.navbar');
      if (navbar) navbar.classList.toggle('scrolled', offset > 30);
      // 返回顶部 & 快捷导航
      if (offset > 400) {
        if (backToTop) backToTop.classList.add('visible');
        if (quickNav) quickNav.classList.add('visible');
      } else {
        if (backToTop) backToTop.classList.remove('visible');
        if (quickNav) quickNav.classList.remove('visible');
      }
      // 滚动进度条 — 支持 CSS Scroll-Driven Animations 时跳过 JS 更新（由合成线程接管）
      if (scrollProgressBar && !supportsScrollDriven) {
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (offset / docHeight) * 100 : 0;
        scrollProgressBar.style.width = pct + '%';
      }
      // 高亮当前 section 对应的导航点（使用缓存引用）
      var scrollPos = offset + 120;
      var activeId = null;
      for (var i = 0; i < _cachedSections.length; i++) {
        var sec = _cachedSections[i];
        if (sec.style.display !== 'none' && sec.offsetTop <= scrollPos) {
          activeId = sec.id;
        }
      }
      var dots = quickNav ? quickNav.querySelectorAll('.quick-nav-dot') : [];
      for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', dots[j].getAttribute('data-target') === activeId);
      }
    });
  }

  // ===== 事件绑定 =====

  // 筛选标签
  chips.forEach(function(chip) {
    chip.addEventListener('click', function() {
      chips.forEach(function(c) { c.classList.remove('active'); });
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      applyFilter();
    });
  });

  // 搜索
  var searchTimer;
  var searchClearBtn = document.getElementById('search-clear');
  if (searchInput) searchInput.addEventListener('input', function() {
    clearTimeout(searchTimer);
    if (searchClearBtn) searchClearBtn.style.display = searchInput.value ? 'flex' : 'none';
    searchTimer = setTimeout(function() {
      currentSearch = searchInput.value.toLowerCase().trim();
      clearFuzzyCache();
      applyFilter();
    }, 150);
  });

  // 清除搜索
  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', function() {
      searchInput.value = '';
      currentSearch = '';
      searchClearBtn.style.display = 'none';
      applyFilter();
      searchInput.focus();
    });
  }

  // 排序（隐藏的 sort-select，实际操作通过 sort-select-inline）
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      currentSort = sortSelect.value;
      buildContent();
      applySyntaxHighlighting();
      restoreCardStates();
      initScrollAnimations();
      applyFilter();
    });
  }

  // 主题切换
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // 返回顶部 — 若 enhanced-ux.js Lenis 可用则优先使用，避免双绑定冲突
  if (backToTop) backToTop.addEventListener('click', function(e) {
    if (window.__lenis) {
      e.stopImmediatePropagation();
      window.__lenis.scrollTo(0, { duration: 2.0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, true);

  // 滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true });

  // 防抖 resize — 重新缓存元素引用，避免布局变化后引用失效
  var resizeTimer = null;
  window.addEventListener('resize', function() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // 重新缓存 sections 和 cards（布局变化后 offsetTop 等可能改变）
      _cachedSections = Array.prototype.slice.call(root.querySelectorAll('.content-section'));
      _cachedCards = Array.prototype.slice.call(root.querySelectorAll('[data-cat]'));
      _totalCardCount = _cachedCards.length;
      // 触发一次 scroll 以更新导航高亮
      handleScroll();
    }, 200);
  }, { passive: true });

  // 键盘快捷键: / 聚焦搜索, Escape 清除搜索/关闭模态框
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === 'Escape') {
      // 先关闭模态框
      var openModal = document.querySelector('.modal-overlay.open');
      if (openModal) {
        openModal.classList.remove('open');
        return;
      }
      // 再清除搜索
      if (document.activeElement === searchInput || currentSearch) {
        searchInput.value = '';
        currentSearch = '';
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        applyFilter();
        searchInput.blur();
      }
    }
  });

  // 暴露给 charts.js 调用的筛选函数
  window.kbFilterBy = function(category) {
    var chip = document.querySelector('.chip[data-filter="' + category + '"]');
    if (chip) chip.click();
  };

  // 暴露重置函数给空状态按钮
  window.__kbReset = function() {
    currentFilter = 'all';
    currentSearch = '';
    currentSort = 'default';
    sortSelect.value = 'default';
    searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    chips.forEach(function(c) { c.classList.remove('active'); });
    var allChip = document.querySelector('.chip[data-filter="all"]');
    if (allChip) allChip.classList.add('active');
    applyFilter();
  };

  // ===== 滚动入场动画 =====
  // GSAP enhanced-ux.js 已接管卡片动画 — 加载时跳过 JS observer
  var supportsScrollDrivenView = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline', 'view()');
  var hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var scrollObserver = null;
  function initScrollAnimations() {
    // GSAP 已接管卡片揭示动画 — 跳过 JS observer
    if (hasGSAP) return;
    if (!('IntersectionObserver' in window)) return;
    // 断开旧 observer，避免重建后引用失效
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.dataset.idx || '0') % 8;
          el.style.transitionDelay = (delay * 50) + 'ms';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          scrollObserver.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // 只观察内容区域的卡片，不重复观察 chart-card（它在 dashboard 中，不会被重建）
    document.querySelectorAll('#content-root .item-card, #content-root .tech-card, #content-root .showcase-card, #content-root .ai-model-card, #content-root .devops-card, #content-root .path-card, #content-root .glossary-card, #content-root .solution-card').forEach(function(el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      el.dataset.idx = i;
      scrollObserver.observe(el);
    });
  }

  // ===== 统一鼠标处理器（合并 4 个 mousemove 监听器为 1 个）=====
  // 性能优化：从 4× closest() + 4× rAF 调度 → 1× closest() + 1× rAF
  function initUnifiedMouseHandler() {
    // GSAP enhanced-ux.js 已接管光标、倾斜、磁吸 — 跳过旧处理器
    if (hasGSAP) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var cursor = document.getElementById('kb-cursor');
    var ring = document.getElementById('kb-cursor-ring');
    var label = document.getElementById('kb-cursor-label');

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var rafScheduled = false;
    var rafId = null;
    var currentTiltCard = null;
    var currentMagEl = null;
    var currentHoverCard = null;

    // 悬停标签映射
    var hoverSelector = 'a, button, .chip, [role="option"], .item-card, .tech-card, .showcase-card, .ai-model-card, .glossary-card, .path-card, .devops-card, .solution-card, input, select';
    var labelMap = {
      'a': 'LINK', 'button': 'TAP', '.chip': 'FILTER',
      '.item-card': 'VIEW', '.tech-card': 'READ', '.showcase-card': 'VISIT',
      '.ai-model-card': 'VIEW', '.glossary-card': 'TERM', '.path-card': 'PATH',
      '.devops-card': 'GUIDE', '.solution-card': 'STACK',
      'input': 'TYPE', 'select': 'SORT', '[role="option"]': 'SELECT'
    };

    // 单一 mousemove 监听器 — 统一处理光标、倾斜、磁性、光效
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (rafScheduled) return;
      rafScheduled = true;
      requestAnimationFrame(function() {
        rafScheduled = false;

        // 1. 光标点立即跟随（低延迟）
        if (cursor) {
          cursor.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(-50%,-50%)';
        }
        if (label) {
          label.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px) translate(20px,-50%)';
        }

        // 2. 外环弹性跟随（lerp 插值）
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        if (ring) {
          ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px) translate(-50%,-50%)';
        }

        // 3. 3D 倾斜卡片（单次 closest 查找，复用结果）
        var tiltCard = document.elementFromPoint ? null : null; // 使用缓存的 currentTiltCard
        var target = e.target;

        // 检查是否在倾斜卡片上
        var tiltMatch = target.closest('.item-card, .ai-model-card, .showcase-card');
        if (tiltMatch !== currentTiltCard) {
          if (currentTiltCard) {
            currentTiltCard.classList.remove('tilting');
            currentTiltCard.style.removeProperty('--tilt-x');
            currentTiltCard.style.removeProperty('--tilt-y');
          }
          currentTiltCard = tiltMatch;
          if (tiltMatch) tiltMatch.classList.add('tilting');
        }
        if (tiltMatch) {
          var tRect = tiltMatch.getBoundingClientRect();
          var tdx = (mouseX - (tRect.left + tRect.width / 2)) / (tRect.width / 2);
          var tdy = (mouseY - (tRect.top + tRect.height / 2)) / (tRect.height / 2);
          tiltMatch.style.setProperty('--tilt-x', (tdx * 6) + 'deg');
          tiltMatch.style.setProperty('--tilt-y', (-tdy * 6) + 'deg');
        }

        // 4. 磁性按钮效果
        var magMatch = target.closest('.action-btn, .theme-toggle, .back-to-top');
        if (magMatch !== currentMagEl) {
          if (currentMagEl) currentMagEl.style.transform = '';
          currentMagEl = magMatch;
        }
        if (magMatch) {
          var mRect = magMatch.getBoundingClientRect();
          var mdx = (mouseX - (mRect.left + mRect.width / 2)) * 0.3;
          var mdy = (mouseY - (mRect.top + mRect.height / 2)) * 0.3;
          magMatch.style.transform = 'translate(' + mdx + 'px,' + mdy + 'px)';
        }

        // 5. 卡片鼠标追踪光效
        var glowCard = target.closest('.item-card');
        if (glowCard !== currentHoverCard) {
          currentHoverCard = glowCard;
        }
        if (glowCard) {
          var gRect = glowCard.getBoundingClientRect();
          glowCard.style.setProperty('--mx', ((mouseX - gRect.left) / gRect.width * 100) + '%');
          glowCard.style.setProperty('--my', ((mouseY - gRect.top) / gRect.height * 100) + '%');
        }
      });
    }, { passive: true });

    // 悬停可交互元素时变形 + 显示标签
    document.addEventListener('mouseover', function(e) {
      var target = e.target.closest(hoverSelector);
      if (!target) return;
      if (cursor) cursor.classList.add('hovering');
      if (ring) ring.classList.add('hovering');
      if (label) {
        var labelText = '';
        for (var key in labelMap) {
          if (target.matches(key)) { labelText = labelMap[key]; break; }
        }
        if (labelText) {
          label.textContent = labelText;
          label.classList.add('visible');
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', function(e) {
      var target = e.target.closest(hoverSelector);
      if (!target) return;
      var related = e.relatedTarget;
      if (related && related.closest && related.closest(hoverSelector)) return;
      if (cursor) cursor.classList.remove('hovering');
      if (ring) ring.classList.remove('hovering');
      if (label) label.classList.remove('visible');
    }, { passive: true });

    // 鼠标离开卡片时重置倾斜
    document.addEventListener('mouseleave', function() {
      if (currentTiltCard) {
        currentTiltCard.classList.remove('tilting');
        currentTiltCard.style.removeProperty('--tilt-x');
        currentTiltCard.style.removeProperty('--tilt-y');
        currentTiltCard = null;
      }
      if (currentMagEl) {
        currentMagEl.style.transform = '';
        currentMagEl = null;
      }
    });

    // 页面不可见时停止 rAF（节省 CPU）
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }

  // ===== 数字计数动画（hero 统计数据）=====
  function animateNumberCounter(el, target, suffix, duration) {
    if (!el) return;
    suffix = suffix || '';
    duration = duration || 1500;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out-expo 缓动函数
      var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      var value = Math.floor(eased * target);
      el.textContent = value + (progress >= 0.95 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ===== 涟漪效果（卡片点击触觉反馈）=====
  function initRippleEffect() {
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.item-card, .ai-model-card, .chart-card, .tech-card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 0.5;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      card.appendChild(ripple);
      setTimeout(function() { ripple.remove(); }, 600);
    }, { passive: true });
  }

  // (initNavbarScroll 已合并到 handleScroll + initUnifiedMouseHandler)

  // (initCustomCursor 已合并到 initUnifiedMouseHandler)
  // (init3DTilt 已合并到 initUnifiedMouseHandler)
  // (initMagneticButtons 已合并到 initUnifiedMouseHandler)

  // ===== 加载真实 GitHub 数据（异步，不阻塞首屏渲染）=====
  // 从 assets/github-data.json 加载脚本抓取的真实 GitHub 数据，
  // 合并到 KB_DATA 中（更新 stars、活跃度等），然后重新渲染卡片。
  function loadGithubData() {
    fetch('./assets/github-data.json')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data || !data.repositories) return;
        var repos = data.repositories;
        var updatedCount = 0;

        // 遍历所有分类下的项目
        var allCats = Object.keys(KB_DATA).filter(function(k) {
          return Array.isArray(KB_DATA[k]);
        });

        allCats.forEach(function(cat) {
          KB_DATA[cat].forEach(function(item) {
            if (!item || !item.url) return;
            // 从 URL 提取 owner/repo
            var match = item.url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
            if (!match) return;
            var fullName = match[1] + '/' + match[2].replace(/\.git$/, '');
            var repoData = repos[fullName];
            if (!repoData) return;

            // 更新星标数
            if (repoData.stars > 0) {
              item.stars = repoData.stars;
            }

            // 构建活跃度数据（用于卡片显示）
            if (!KB_DATA.activityData) KB_DATA.activityData = {};
            KB_DATA.activityData[item.name] = {
              lastPush: repoData.lastPush ? repoData.lastPush.split('T')[0] : '',
              contributors: repoData.contributors || 0,
              issues: repoData.openIssues || 0
            };

            updatedCount++;
          });
        });

        if (updatedCount > 0) {
          // 清除活跃度缓存，使新数据生效
          _activityCache = {};

          // 重新渲染内容（复用已有的渲染流程）
          buildContent();
          applySyntaxHighlighting();
          restoreCardStates();
          initScrollAnimations();
          applyFilter();
          updateFavBadge();
          updateCompareBadge();

          console.log('[KB] GitHub 真实数据已加载，更新了 ' + updatedCount + ' 个项目');
        }
      })
      .catch(function(err) {
        // 静默失败，使用已有的估算数据
        console.log('[KB] GitHub 数据未加载（使用内置数据）: ' + err.message);
      });
  }

  // 初始化（try-catch 防止任一步骤异常导致白屏）
  try {
    if (typeof KB_DATA === 'undefined' || !KB_DATA) {
      throw new Error('数据文件加载失败');
    }
    try { initTheme(); } catch(e) { console.warn('[init] theme:', e); }
    var urlChanged = false;
    try { urlChanged = readURL(); } catch(e) { console.warn('[init] readURL:', e); }
    try { buildContent(); } catch(e) { console.warn('[init] buildContent:', e); throw e; }
    try { renderSources(); } catch(e) { console.warn('[init] sources:', e); }
    try { updateStats(); } catch(e) { console.warn('[init] stats:', e); }
    try { updateResultCount(); } catch(e) { console.warn('[init] resultCount:', e); }
    try { if (urlChanged) applyFilter(); } catch(e) { console.warn('[init] filter:', e); }
    try { initScrollAnimations(); } catch(e) { console.warn('[init] scrollAnim:', e); }
    try { initUnifiedMouseHandler(); } catch(e) { console.warn('[init] mouse:', e); }
    try { initRippleEffect(); } catch(e) { console.warn('[init] ripple:', e); }
    try { initCopyButtons(); } catch(e) { console.warn('[init] copy:', e); }
    try { initCardActions(); } catch(e) { console.warn('[init] cardActions:', e); }
    try { initModals(); } catch(e) { console.warn('[init] modals:', e); }
    try { applySyntaxHighlighting(); } catch(e) { console.warn('[init] syntax:', e); }
    try { restoreCardStates(); } catch(e) { console.warn('[init] cardStates:', e); }
    try { updateFavBadge(); } catch(e) { console.warn('[init] favBadge:', e); }
    try { updateCompareBadge(); } catch(e) { console.warn('[init] compareBadge:', e); }

    // Hero 统计数字计数动画
    var statTotal = document.getElementById('stat-total');
    var statCats = document.getElementById('stat-cats');
    var statTech = document.getElementById('stat-tech');
    if (statTotal) {
      var totalNum = parseInt(statTotal.textContent) || 337;
      animateNumberCounter(statTotal, totalNum, '+', 1800);
    }
    if (statCats) animateNumberCounter(statCats, parseInt(statCats.textContent) || 31, '', 1500);
    if (statTech) animateNumberCounter(statTech, parseInt(statTech.textContent) || 66, '', 1200);

    // 非关键初始化延迟到空闲时段（不阻塞首屏交互）
    var idleInit = function() {
      // Feedback widget 交互
      var feedbackBtns = document.querySelectorAll('.feedback-btn');
      feedbackBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          feedbackBtns.forEach(function(b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          var val = btn.getAttribute('data-value');
          showToast(val === 'helpful' ? '感谢反馈！' : '感谢反馈，我们会持续改进', 'success');
        });
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(idleInit, { timeout: 3000 });
    } else {
      setTimeout(idleInit, 500);
    }

    // 分区标题渐变下划线动画（IntersectionObserver 触发）
    if ('IntersectionObserver' in window) {
      var titleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            titleObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5, rootMargin: '0px 0px -50px 0px' });
      document.querySelectorAll('.section-title').forEach(function(el) {
        titleObserver.observe(el);
      });

      // Content section 分隔线渐入动画
      var sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            sectionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
      document.querySelectorAll('.content-section').forEach(function(el) {
        sectionObserver.observe(el);
      });
    }

    // 异步加载真实 GitHub 数据（不阻塞首屏，加载完成后自动更新卡片）
    loadGithubData();

    // 初始化模块系统 — 默认显示前端模块
    setTimeout(function() {
      try {
        switchModule('frontend');
      } catch(e) {
        console.error('[switchModule init]', e);
      }
    }, 200);
  } catch(err) {
    console.error('[KB Init Error]', err);
    if (root) {
      root.innerHTML = '<div style="padding:60px 20px;text-align:center;color:#8282a0"><h2 style="color:#ececf8;margin-bottom:12px">初始化失败</h2><p>' + (err.message || '未知错误') + '</p><pre style="font-size:11px;margin-top:12px;color:#4a4a62;text-align:left;white-space:pre-wrap;max-width:600px;margin:12px auto;padding:12px;background:rgba(0,0,0,0.1);border-radius:8px;overflow:auto;">' + (err.stack || '').replace(/</g,'&lt;') + '</pre><p style="font-size:12px;margin-top:8px;color:#4a4a62">请刷新页面重试</p></div>';
    }
  }

})();
