// ============================================================
// ECharts 可视化 v2 — 4 个图表 + 交互筛选 + 主题适配
// ============================================================
(function() {

  // 动态读取 CSS 变量，支持主题切换
  function readVars() {
    var s = getComputedStyle(document.documentElement);
    return {
      accent: s.getPropertyValue('--accent').trim() || '#3d7eff',
      accent2: s.getPropertyValue('--accent2').trim() || '#2fd0e2',
      ink: s.getPropertyValue('--ink').trim() || '#e8e8f5',
      muted: s.getPropertyValue('--muted').trim() || '#7a7a96',
      rule: s.getPropertyValue('--rule').trim() || 'rgba(255,255,255,0.07)',
      bg2: s.getPropertyValue('--bg2').trim() || '#11111c',
      bg3: s.getPropertyValue('--bg3').trim() || '#1a1a28',
      green: s.getPropertyValue('--green').trim() || '#34d399',
      amber: s.getPropertyValue('--amber').trim() || '#fbbf24',
      pink: s.getPropertyValue('--pink').trim() || '#f472b6',
      red: s.getPropertyValue('--red').trim() || '#f87171',
    };
  }

  var v = readVars();

  // 全部分类（含新增 13 个）
  var cats = ['frontend','meta','ui','css','anim','three','dataviz','form','build','state','test','linter','pkg','mobile','backend','orm','api','auth','realtime','cms','deploy','vector','mcp','agent','tool'];
  var catNames = {
    frontend:'前端框架', meta:'元框架', ui:'UI 组件库', css:'CSS/样式', anim:'动画',
    three:'3D/WebGL', dataviz:'数据可视化', form:'表单&验证',
    build:'构建工具', state:'状态管理', test:'测试框架',
    linter:'代码质量', pkg:'包管理', mobile:'移动端',
    backend:'后端框架', orm:'数据库/ORM', api:'API 层',
    auth:'认证', realtime:'实时通信', cms:'无头 CMS',
    deploy:'部署/DevOps', vector:'向量 DB',
    mcp:'MCP', agent:'Agent 框架', tool:'AI 工具'
  };
  var catColors = {
    frontend:v.accent, meta:'#a78bfa', ui:v.accent2, css:v.pink, anim:v.amber,
    three:'#818cf8', dataviz:'#06b6d4', form:'#ec4899',
    build:'#fb923c', state:'#a3e635', test:v.red,
    linter:'#facc15', pkg:'#f97316', mobile:'#3b82f6',
    backend:v.green, orm:'#10b981', api:'#14b8a6',
    auth:'#6366f1', realtime:'#0ea5e9', cms:'#84cc16',
    deploy:'#a855f7', vector:'#d946ef',
    mcp:v.accent, agent:v.accent2, tool:v.amber
  };
  // 分类 key 到 filter chip key 的映射（相同）
  var catFilterMap = {
    frontend:'frontend', meta:'meta', ui:'ui', css:'css', anim:'anim',
    three:'three', dataviz:'dataviz', form:'form',
    build:'build', state:'state', test:'test',
    linter:'linter', pkg:'pkg', mobile:'mobile',
    backend:'backend', orm:'orm', api:'api',
    auth:'auth', realtime:'realtime', cms:'cms',
    deploy:'deploy', vector:'vector',
    mcp:'mcp', agent:'agent', tool:'tool'
  };

  // 收集所有有星标的数据项
  var allItems = [];
  cats.forEach(function(c) {
    (KB_DATA[c] || []).forEach(function(item) {
      if (item.stars > 0) {
        allItems.push(Object.assign({}, item, {cat:c, catName:catNames[c]}));
      }
    });
  });

  // ===== Lazy chart initialization system =====
  // Charts only init when scrolled into view for performance
  var chartInitFns = {};
  var chartObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        if (chartInitFns[id]) {
          chartInitFns[id]();
          delete chartInitFns[id];
        }
        chartObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '200px' }) : null;

  function registerLazyChart(id, initFn) {
    var el = document.getElementById(id);
    if (!el) return;
    if (chartObserver) {
      chartInitFns[id] = initFn;
      chartObserver.observe(el);
    } else {
      initFn(); // Fallback: init immediately
    }
  }

  // ===== Chart 1: GitHub Stars TOP 20 横向柱状图 =====
  var chart1 = null;
  var top15 = allItems.slice().sort(function(a,b) { return b.stars - a.stars; }).slice(0, 20);

  function chart1Option() {
    var v = readVars();
    return {
      animation: false,
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' }, appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(params) {
          var p = params[0];
          return '<b>' + p.name + '</b><br/>' + p.data.category + ' · ' + (p.value/1000).toFixed(1) + 'k stars<br/><i style="color:'+v.muted+'">点击筛选此分类</i>';
        }
      },
      grid: { left: 100, right: 60, top: 10, bottom: 10 },
      xAxis: {
        type: 'value', max: 260000,
        axisLabel: { color: v.muted, fontSize: 11, formatter: function(val) { return (val/1000) + 'k'; } },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: top15.map(function(i) { return i.name; }).reverse(),
        axisLabel: { color: v.ink, fontSize: 12, fontFamily: 'Outfit, sans-serif' },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: top15.map(function(i) {
          return { value: i.stars, itemStyle: { color: catColors[i.cat] }, category: i.catName, catKey: i.cat };
        }).reverse(),
        barWidth: 14,
        itemStyle: { borderRadius: [0, 4, 4, 0] },
        label: {
          show: true, position: 'right', color: v.muted, fontSize: 11, fontFamily: 'JetBrainsMono, monospace',
          formatter: function(p) { return (p.value/1000).toFixed(0) + 'k'; }
        }
      }]
    };
  }
  registerLazyChart('chart-stars', function() {
    chart1 = echarts.init(document.getElementById('chart-stars'), null, { renderer: 'svg' });
    chart1.setOption(chart1Option());
    chart1.on('click', function(params) {
      if (params.data && params.data.catKey && window.kbFilterBy) {
        window.kbFilterBy(params.data.catKey);
      }
    });
  });

  // ===== Chart 2: 综合评级雷达图（前端 + 元框架） =====
  var chart2 = null;
  var radarFrameworks = ['React','Next.js','Vue.js','Svelte','SvelteKit','Astro'];
  var radarData = radarFrameworks.map(function(name) {
    var item = KB_DATA.frontend.find(function(f) { return f.name === name; }) ||
               KB_DATA.meta.find(function(f) { return f.name === name; });
    if (!item || !item.scores) return null;
    var colors = { 'React':v.accent, 'Next.js':'#a78bfa', 'Vue.js':v.green, 'Svelte':v.accent2, 'SvelteKit':'#22d3ee', 'Astro':v.amber };
    return {
      name: name,
      value: [item.scores.eco, item.scores.perf, item.scores.learn, item.scores.type, item.scores.main],
      itemStyle: { color: colors[name] || v.pink }
    };
  }).filter(Boolean);

  function chart2Option() {
    var v = readVars();
    return {
      animation: false,
      tooltip: { appendToBody: true, backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 } },
      legend: {
        data: radarFrameworks, bottom: 0, textStyle: { color: v.muted, fontSize: 12 },
        itemWidth: 12, itemHeight: 12, itemGap: 12
      },
      radar: {
        indicator: [
          { name: '生态', max: 10 }, { name: '性能', max: 10 }, { name: '学习曲线', max: 10 },
          { name: '类型安全', max: 10 }, { name: '维护', max: 10 }
        ],
        center: ['50%', '46%'], radius: '58%',
        axisName: { color: v.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: v.rule } },
        splitArea: { areaStyle: { color: ['transparent','rgba(124,92,252,0.03)'] } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      series: [{
        type: 'radar', data: radarData,
        areaStyle: { opacity: 0.08 },
        lineStyle: { width: 2 }, symbolSize: 5
      }]
    };
  }
  registerLazyChart('chart-radar', function() {
    chart2 = echarts.init(document.getElementById('chart-radar'), null, { renderer: 'svg' });
    chart2.setOption(chart2Option());
  });

  // ===== Chart 3: 分类星标分布饼图 =====
  var chart3 = null;

  function chart3Option() {
    var v = readVars();
    var pieData = cats.map(function(c) {
      var total = (KB_DATA[c] || []).reduce(function(sum, i) { return sum + (i.stars || 0); }, 0);
      return { name: catNames[c], value: total, itemStyle: { color: catColors[c] }, catKey: c };
    }).filter(function(d) { return d.value > 0; });
    return {
      animation: false,
      tooltip: {
        trigger: 'item', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: '{b}: {c} stars ({d}%)<br/><i style="color:'+v.muted+'">点击筛选</i>'
      },
      legend: {
        orient: 'vertical', right: 10, top: 'center',
        textStyle: { color: v.muted, fontSize: 12 }, itemWidth: 10, itemHeight: 10
      },
      series: [{
        type: 'pie', radius: ['42%', '68%'], center: ['38%', '50%'],
        data: pieData,
        label: { show: false },
        emphasis: { label: { show: true, color: v.ink, fontSize: 14, fontWeight: 'bold' }, itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } },
        itemStyle: { borderColor: v.bg2, borderWidth: 2 }
      }]
    };
  }
  registerLazyChart('chart-pie', function() {
    chart3 = echarts.init(document.getElementById('chart-pie'), null, { renderer: 'svg' });
    chart3.setOption(chart3Option());
    chart3.on('click', function(params) {
      if (params.data && params.data.catKey && window.kbFilterBy) {
        window.kbFilterBy(params.data.catKey);
      }
    });
  });

  // ===== Chart 4: 热度 vs 评级散点图 =====
  var chart4 = null;

  function chart4Option() {
    var v = readVars();
    var scatterData = allItems.map(function(i) {
      return {
        name: i.name, value: [i.stars, i.rating], category: i.catName, catKey: i.cat,
        itemStyle: { color: catColors[i.cat], opacity: 0.75 }
      };
    });
    return {
      animation: false,
      tooltip: {
        trigger: 'item', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(p) {
          return '<b>' + p.data.name + '</b><br/>' + p.data.category + '<br/>Stars: ' + (p.value[0]/1000).toFixed(1) + 'k · 评级: ' + p.value[1] + '<br/><i style="color:'+v.muted+'">点击筛选</i>';
        }
      },
      grid: { left: 50, right: 30, top: 20, bottom: 45 },
      xAxis: {
        type: 'log', name: 'GitHub Stars', nameLocation: 'middle', nameGap: 28,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11, formatter: function(val) { return (val/1000) + 'k'; } },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      yAxis: {
        type: 'value', name: '综合评级', min: 6, max: 10, nameLocation: 'middle', nameGap: 35,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11 },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      series: [{
        type: 'scatter', data: scatterData,
        symbolSize: function(data) { return Math.max(8, Math.min(28, Math.sqrt(data[0]) / 12)); },
        label: { show: false },
        emphasis: { label: { show: true, position: 'top', color: v.ink, fontSize: 12, fontWeight: 'bold', formatter: '{b}' }, itemStyle: { opacity: 1, shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.3)' } }
      }]
    };
  }
  registerLazyChart('chart-scatter', function() {
    chart4 = echarts.init(document.getElementById('chart-scatter'), null, { renderer: 'svg' });
    chart4.setOption(chart4Option());
    chart4.on('click', function(params) {
      if (params.data && params.data.catKey && window.kbFilterBy) {
        window.kbFilterBy(params.data.catKey);
      }
    });
  });

  // ===== 统一 resize 处理器（替代 10 个独立监听器 + 主题重绘）=====
  var resizeRAF = null;
  var resizeTimer = null;
  function handleResize() {
    // 调用时动态获取最新图表引用（懒加载后才有值）
    var charts = [chart1, chart2, chart3, chart4, chart5, chart6, chart7, chart8, chart9, chart10];
    // rAF 节流：立即 resize 已初始化的图表，保证流畅
    if (resizeRAF) cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(function() {
      resizeRAF = null;
      for (var i = 0; i < charts.length; i++) {
        if (charts[i]) charts[i].resize();
      }
    });
    // 200ms 防抖：重绘主题色（避免频繁 setOption）
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      v = readVars();
      catColors.frontend = v.accent;
      catColors.ui = v.accent2;
      catColors.css = v.pink;
      catColors.anim = v.amber;
      catColors.test = v.red;
      catColors.backend = v.green;
      catColors.mcp = v.accent;
      catColors.agent = v.accent2;
      catColors.tool = v.amber;
      var fns = [chart1Option, chart2Option, chart3Option, chart4Option, chart5Option, chart6Option, chart7Option, chart8Option, chart9Option, chart10Option];
      for (var j = 0; j < charts.length; j++) {
        if (charts[j]) charts[j].setOption(fns[j]());
      }
    }, 200);
  }
  window.addEventListener('resize', handleResize, { passive: true });

  // ===== Chart 5: AI 模型七维能力雷达对比 =====
  var chart5El = document.getElementById('chart-ai-radar');
  var chart5 = null;

  function chart5Option() {
    var v = readVars();
    var models = (KB_DATA.aiModels || []).filter(function(m) { return m.scores; });
    var modelColors = ['#fbbf24','#7c5cfc','#22d3ee','#34d399','#06b6d4','#a855f7','#d946ef','#f472b6'];
    var radarData = models.map(function(m, i) {
      return {
        name: m.name,
        value: [m.scores.reasoning, m.scores.coding, m.scores.agent, m.scores.multimodal, m.scores.cost, m.scores.speed, m.scores.open !== undefined ? m.scores.open : 0],
        itemStyle: { color: modelColors[i % modelColors.length] },
        lineStyle: { width: 2 },
        areaStyle: { opacity: 0.05 }
      };
    });
    return {
      animation: false,
      tooltip: { appendToBody: true, backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 } },
      legend: {
        data: models.map(function(m) { return m.name; }),
        bottom: 0, textStyle: { color: v.muted, fontSize: 11 },
        itemWidth: 12, itemHeight: 12, itemGap: 10, type: 'scroll'
      },
      radar: {
        indicator: [
          { name: '推理', max: 10 }, { name: '编码', max: 10 }, { name: 'Agent', max: 10 },
          { name: '多模态', max: 10 }, { name: '性价比', max: 10 }, { name: '速度', max: 10 }, { name: '开源', max: 10 }
        ],
        center: ['50%', '48%'], radius: '62%',
        axisName: { color: v.muted, fontSize: 12 },
        splitLine: { lineStyle: { color: v.rule } },
        splitArea: { areaStyle: { color: ['transparent','rgba(124,92,252,0.03)'] } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      series: [{ type: 'radar', data: radarData, symbolSize: 5 }]
    };
  }
  if (chart5El) {
    registerLazyChart('chart-ai-radar', function() {
      chart5 = echarts.init(chart5El, null, { renderer: 'svg' });
      chart5.setOption(chart5Option());
    });
  }

  // ===== Chart 6: AI 模型价格 vs 综合实力散点图 =====
  var chart6El = document.getElementById('chart-ai-price');
  var chart6 = null;

  function chart6Option() {
    var v = readVars();
    var modelColors = ['#fbbf24','#7c5cfc','#22d3ee','#34d399','#06b6d4','#a855f7','#d946ef','#f472b6'];
    var scatterData = (KB_DATA.aiModels || []).map(function(m, i) {
      // 解析输出价格中的数字（取第一个数字，按人民币算）
      var priceStr = m.price.output;
      var priceMatch = priceStr.match(/[\d.]+/);
      var price = priceMatch ? parseFloat(priceMatch[0]) : 50;
      // 如果是美元，转换为人民币（约7.2倍）
      if (priceStr.indexOf('$') >= 0) price *= 7.2;
      // 计算综合评分
      var s = m.scores;
      var overall = (s.reasoning + s.coding + s.agent + s.multimodal + s.cost + s.speed + (s.open !== undefined ? s.open : 0)) / 7;
      // 解析上下文长度
      var ctxStr = m.context;
      var ctxMatch = ctxStr.match(/[\d.]+/);
      var ctx = ctxMatch ? parseFloat(ctxMatch[0]) : 100;
      if (ctxStr.indexOf('万') >= 0) ctx *= 10000;
      return {
        name: m.name, value: [price, overall, ctx],
        itemStyle: { color: modelColors[i % modelColors.length], opacity: 0.8 },
        vendor: m.vendor, tier: m.tier
      };
    });
    return {
      animation: false,
      tooltip: {
        trigger: 'item', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(p) {
          return '<b>' + p.data.name + '</b><br/>' + p.data.vendor + ' · ' + p.data.tier +
            '<br/>输出价格: ¥' + p.value[0].toFixed(1) + '/M Token' +
            '<br/>综合评分: ' + p.value[1].toFixed(1) + '/10' +
            '<br/>上下文: ' + p.value[2].toLocaleString() + ' Token';
        }
      },
      grid: { left: 55, right: 30, top: 20, bottom: 50 },
      xAxis: {
        type: 'log', name: '输出价格 (¥/M Token)', nameLocation: 'middle', nameGap: 32,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11, formatter: function(val) { return '¥' + val; } },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      yAxis: {
        type: 'value', name: '综合评分', min: 5, max: 10, nameLocation: 'middle', nameGap: 38,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11 },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      series: [{
        type: 'scatter', data: scatterData,
        symbolSize: function(data) { return Math.max(14, Math.min(50, Math.sqrt(data[2]) / 8)); },
        label: {
          show: true, position: 'top', color: v.ink, fontSize: 11, fontFamily: 'Outfit, sans-serif',
          formatter: '{b}'
        },
        emphasis: { label: { show: true, fontSize: 13, fontWeight: 'bold' }, itemStyle: { opacity: 1, shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.4)' } }
      }]
    };
  }
  if (chart6El) {
    registerLazyChart('chart-ai-price', function() {
      chart6 = echarts.init(chart6El, null, { renderer: 'svg' });
      chart6.setOption(chart6Option());
    });
  }

  // ===== Chart 7: SWE-bench 工程代码能力对比柱状图 =====
  var chart7El = document.getElementById('chart-ai-bench');
  var chart7 = null;

  function chart7Option() {
    var v = readVars();
    var modelColors = ['#fbbf24','#7c5cfc','#22d3ee','#34d399','#06b6d4','#a855f7','#d946ef','#f472b6'];
    // 从 AI 模型中提取 SWE-bench 分数
    var benchData = (KB_DATA.aiModels || []).map(function(m, i) {
      var sweBench = m.benchmarks.find(function(b) { return b.name.indexOf('SWE-bench') >= 0; });
      if (!sweBench) return null;
      var scoreMatch = sweBench.score.match(/[\d.]+/);
      var score = scoreMatch ? parseFloat(scoreMatch[0]) : 0;
      return { name: m.name, score: score, color: modelColors[i % modelColors.length], type: m.type };
    }).filter(Boolean).sort(function(a, b) { return b.score - a.score; });

    return {
      animation: false,
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' }, appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(params) {
          var p = params[0];
          return '<b>' + p.name + '</b><br/>SWE-bench: ' + p.value + '%<br/><i style="color:' + v.muted + '">真实 GitHub Issue 修复通过率</i>';
        }
      },
      grid: { left: 100, right: 50, top: 10, bottom: 10 },
      xAxis: {
        type: 'value', max: 100,
        axisLabel: { color: v.muted, fontSize: 11, formatter: '{value}%' },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: benchData.map(function(d) { return d.name; }).reverse(),
        axisLabel: { color: v.ink, fontSize: 12, fontFamily: 'Outfit, sans-serif' },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: benchData.map(function(d) {
          return { value: d.score, itemStyle: { color: d.color, borderRadius: [0, 4, 4, 0] } };
        }).reverse(),
        barWidth: 16,
        label: {
          show: true, position: 'right', color: v.muted, fontSize: 12, fontFamily: 'JetBrainsMono, monospace',
          formatter: '{c}%'
        }
      }]
    };
  }
  if (chart7El) {
    registerLazyChart('chart-ai-bench', function() {
      chart7 = echarts.init(chart7El, null, { renderer: 'svg' });
      chart7.setOption(chart7Option());
    });
  }

  // ===== Chart 8: AI 术语分类玫瑰图 =====
  var chart8El = document.getElementById('chart-glossary');
  var chart8 = null;

  function chart8Option() {
    var v = readVars();
    var glossaryColors = ['#7c5cfc','#f472b6','#06b6d4','#22d3ee','#818cf8','#fbbf24','#a3e635','#d946ef'];
    var roseData = (KB_DATA.aiGlossary || []).map(function(g, i) {
      return {
        name: g.category, value: g.terms.length,
        itemStyle: { color: glossaryColors[i % glossaryColors.length] }
      };
    });
    return {
      animation: false,
      tooltip: {
        trigger: 'item', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: '{b}: {c} 个术语 ({d}%)'
      },
      legend: {
        orient: 'vertical', right: 5, top: 'center',
        textStyle: { color: v.muted, fontSize: 12 }, itemWidth: 10, itemHeight: 10
      },
      series: [{
        type: 'pie', radius: ['18%', '70%'], center: ['38%', '50%'],
        roseType: 'area',
        data: roseData,
        label: { color: v.ink, fontSize: 11 },
        labelLine: { lineStyle: { color: v.rule } },
        itemStyle: { borderColor: v.bg2, borderWidth: 2 },
        emphasis: { label: { fontSize: 13, fontWeight: 'bold' }, itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.3)' } }
      }]
    };
  }
  if (chart8El) {
    registerLazyChart('chart-glossary', function() {
      chart8 = echarts.init(chart8El, null, { renderer: 'svg' });
      chart8.setOption(chart8Option());
    });
  }

  // ===== Chart 9: 学习路径时长甘特图 =====
  var chart9El = document.getElementById('chart-paths');
  var chart9 = null;

  function chart9Option() {
    var v = readVars();
    var pathColors = ['#7c5cfc','#22d3ee','#818cf8','#34d399','#a855f7','#3b82f6'];
    // 解析时长中的月份数
    var pathData = (KB_DATA.learningPaths || []).map(function(p, i) {
      var matchMin = p.duration.match(/(\d+)\s*-\s*(\d+)/);
      var minM = matchMin ? parseInt(matchMin[1]) : 4;
      var maxM = matchMin ? parseInt(matchMin[2]) : 6;
      return {
        name: p.name, min: minM, max: maxM, mid: (minM + maxM) / 2,
        steps: p.steps.length, color: pathColors[i % pathColors.length]
      };
    });
    return {
      animation: false,
      tooltip: {
        trigger: 'item', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(p) {
          return '<b>' + p.data.name + '</b><br/>时长: ' + p.data.min + '-' + p.data.max + ' 个月<br/>阶段数: ' + p.data.steps + ' 个';
        }
      },
      grid: { left: 130, right: 50, top: 20, bottom: 40 },
      xAxis: {
        type: 'value', name: '月', max: 10,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11 },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { lineStyle: { color: v.rule } }
      },
      yAxis: {
        type: 'category',
        data: pathData.map(function(d) { return d.name; }).reverse(),
        axisLabel: { color: v.ink, fontSize: 12, fontFamily: 'Outfit, sans-serif' },
        axisLine: { show: false }, axisTick: { show: false }
      },
      series: [{
        type: 'bar',
        data: pathData.map(function(d) {
          return { value: d.mid, name: d.name, min: d.min, max: d.max, steps: d.steps, itemStyle: { color: d.color, borderRadius: 4 } };
        }).reverse(),
        barWidth: 20,
        label: {
          show: true, position: 'right', color: v.muted, fontSize: 11, fontFamily: 'JetBrainsMono, monospace',
          formatter: function(p) { return p.data.min + '-' + p.data.max + ' 月 · ' + p.data.steps + ' 阶段'; }
        }
      }]
    };
  }
  if (chart9El) {
    registerLazyChart('chart-paths', function() {
      chart9 = echarts.init(chart9El, null, { renderer: 'svg' });
      chart9.setOption(chart9Option());
    });
  }

  // ===== Chart 10: Stars 增长趋势折线图 =====
  var chart10El = document.getElementById('chart-trend');
  var chart10 = null;

  function chart10Option() {
    var v = readVars();
    var trendData = KB_DATA.starsTrends || { dates: [], frameworks: [] };
    var series = trendData.frameworks.map(function(fw) {
      return {
        name: fw.name,
        type: 'line',
        data: fw.data,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2.5, color: fw.color },
        itemStyle: { color: fw.color },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: fw.color + '20' },
              { offset: 1, color: fw.color + '00' }
            ]
          }
        },
        emphasis: { focus: 'series', lineStyle: { width: 4 } }
      };
    });
    return {
      animation: false,
      tooltip: {
        trigger: 'axis', appendToBody: true,
        backgroundColor: v.bg3, borderColor: v.rule, textStyle: { color: v.ink, fontSize: 13 },
        formatter: function(params) {
          var html = '<b style="color:' + v.ink + ';">' + params[0].axisValue + '</b><br/>';
          params.forEach(function(p) {
            html += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
              p.seriesName + ': <b>' + (p.value / 1000).toFixed(0) + 'k</b> stars<br/>';
          });
          return html;
        }
      },
      legend: {
        data: trendData.frameworks.map(function(fw) { return fw.name; }),
        bottom: 0, textStyle: { color: v.muted, fontSize: 12 },
        itemWidth: 14, itemHeight: 8, itemGap: 14, type: 'scroll'
      },
      grid: { left: 60, right: 30, top: 20, bottom: 50 },
      xAxis: {
        type: 'category',
        data: trendData.dates,
        boundaryGap: false,
        axisLabel: { color: v.muted, fontSize: 11 },
        axisLine: { lineStyle: { color: v.rule } },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value', name: 'GitHub Stars', nameLocation: 'middle', nameGap: 40,
        nameTextStyle: { color: v.muted, fontSize: 11 },
        axisLabel: { color: v.muted, fontSize: 11, formatter: function(val) { return (val / 1000) + 'k'; } },
        splitLine: { lineStyle: { color: v.rule } },
        axisLine: { show: false }
      },
      series: series
    };
  }
  if (chart10El) {
    registerLazyChart('chart-trend', function() {
      chart10 = echarts.init(chart10El, null, { renderer: 'svg' });
      chart10.setOption(chart10Option());
    });
  }

  // ===== 图表导出 / 分享功能（借鉴 State of JS）=====
  // 为每个 chart-card 动态添加导出 PNG 和分享链接按钮
  // 动态获取图表实例（懒加载后才有值，不能用静态对象）
  function getChartInstance(id) {
    switch(id) {
      case 'chart-stars': return chart1;
      case 'chart-radar': return chart2;
      case 'chart-pie': return chart3;
      case 'chart-scatter': return chart4;
      case 'chart-ai-radar': return chart5;
      case 'chart-ai-price': return chart6;
      case 'chart-ai-bench': return chart7;
      case 'chart-glossary': return chart8;
      case 'chart-paths': return chart9;
      case 'chart-trend': return chart10;
      default: return null;
    }
  }

  function initChartToolbars() {
    var cards = document.querySelectorAll('.chart-card');
    cards.forEach(function(card) {
      var container = card.querySelector('.chart-container');
      if (!container) return;
      var chartId = container.id;

      // 包装 h3 + subtitle 到 chart-head
      var h3 = card.querySelector('h3');
      var subtitle = card.querySelector('.subtitle');
      var headDiv = document.createElement('div');
      headDiv.className = 'chart-head';
      var titleDiv = document.createElement('div');
      if (h3) titleDiv.appendChild(h3);
      if (subtitle) titleDiv.appendChild(subtitle);

      // 工具栏
      var toolbar = document.createElement('div');
      toolbar.className = 'chart-toolbar';

      // 导出 PNG 按钮
      var exportBtn = document.createElement('button');
      exportBtn.className = 'chart-tool-btn';
      exportBtn.title = '导出为 PNG';
      exportBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
      exportBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var chart = getChartInstance(chartId);
        if (!chart) return;
        try {
          var url = chart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg2').trim() || '#0e0e16'
          });
          var a = document.createElement('a');
          a.href = url;
          a.download = chartId + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch(err) {
          console.warn('Export failed:', err);
        }
      });

      // 分享链接按钮
      var shareBtn = document.createElement('button');
      shareBtn.className = 'chart-tool-btn';
      shareBtn.title = '复制分享链接';
      shareBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
      shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var shareURL = location.origin + location.pathname + '#chart=' + chartId;
        try {
          navigator.clipboard.writeText(shareURL).then(function() {
            shareBtn.classList.add('copied');
            setTimeout(function() { shareBtn.classList.remove('copied'); }, 2000);
          }).catch(function() {
            // 降级方案
            var textarea = document.createElement('textarea');
            textarea.value = shareURL;
            document.body.appendChild(textarea);
            textarea.select();
            try { document.execCommand('copy'); } catch(err2) {}
            document.body.removeChild(textarea);
            shareBtn.classList.add('copied');
            setTimeout(function() { shareBtn.classList.remove('copied'); }, 2000);
          });
        } catch(err) {}
      });

      toolbar.appendChild(exportBtn);
      toolbar.appendChild(shareBtn);
      headDiv.appendChild(toolbar);

      // 插入到 container 之前
      card.insertBefore(headDiv, container);
    });

    // 处理 URL 中的 chart= 参数 — 滚动到对应图表
    var hash = location.hash;
    var chartMatch = hash.match(/chart=([\w-]+)/);
    if (chartMatch) {
      var targetEl = document.getElementById(chartMatch[1]);
      if (targetEl) {
        setTimeout(function() {
          var top = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 500);
      }
    }
  }

  // DOMContentLoaded 后初始化工具栏
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChartToolbars);
  } else {
    initChartToolbars();
  }

})();
