#!/usr/bin/env node
/**
 * 从 OpenRouter 免费 API 拉取真实模型的「价格 + 上下文长度」，写入 assets/ai-data.json。
 *
 * 读取 data.js + data-ext.js 里的 KB_DATA.aiModels，按每条模型的 `or`(OpenRouter id)
 * 找到对应模型，取其 context_length 与 pricing(换算成 $/M)，再写回 ai-data.json。
 * 由 GitHub Actions 每天定时执行；前端 loadAIData() 运行时 fetch 该文件覆盖价格/上下文。
 *
 * 用法：node scripts/fetch-ai-data.cjs
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'assets', 'ai-data.json');
const OR_API = 'https://openrouter.ai/api/v1/models';

function httpsGet(url) {
  return new Promise(function (resolve, reject) {
    https.get(url, { timeout: 15000 }, function (res) {
      let d = '';
      res.on('data', function (c) { d += c; });
      res.on('end', function () { resolve({ status: res.statusCode, body: d }); });
    }).on('error', reject).on('timeout', function () { reject(new Error('timeout')); });
  });
}

function fmtCtx(n) {
  if (!n) return '—';
  if (n >= 1000000) {
    var v = Math.round((n / 1000000) * 10) / 10;
    return (v % 1 === 0 ? v.toFixed(0) : v) + 'M Token';
  }
  if (n >= 1000) return Math.round(n / 1000) + 'K Token';
  return n + ' Token';
}

function perM(v) {
  // OpenRouter 价格是"每 token"的美元值；换算成 $/M
  if (!v || isNaN(parseFloat(v))) return null;
  return Math.round(parseFloat(v) * 1000000 * 100) / 100;
}

async function main() {
  // 1. 读取 aiModels（提取每条模型的 or id）
  let aiModels = [];
  try {
    const vm = require('vm');
    const data = fs.readFileSync(path.join(__dirname, '..', 'assets', 'data.js'), 'utf8')
      + '\n' + fs.readFileSync(path.join(__dirname, '..', 'assets', 'data-ext.js'), 'utf8');
    const sandbox = { KB_DATA: {} };
    vm.createContext(sandbox);
    vm.runInContext(data, sandbox);
    aiModels = sandbox.KB_DATA.aiModels || [];
  } catch (e) {
    console.error('解析数据失败:', e.message);
    process.exit(1);
  }

  // 2. 拉取 OpenRouter 模型列表（免费、无需 key）
  const r = await httpsGet(OR_API);
  if (r.status !== 200) { console.error('OpenRouter HTTP ' + r.status); process.exit(1); }
  const models = JSON.parse(r.body).data || [];
  const byId = {};
  models.forEach(function (m) { byId[m.id] = m; });

  // 3. 按 or id 提取价格/上下文
  const out = {};
  let found = 0;
  aiModels.forEach(function (m) {
    if (!m.or) return;
    const om = byId[m.or];
    if (!om) return;
    const price = om.pricing || {};
    const entry = {};
    if (om.context_length) entry.context = fmtCtx(om.context_length);
    if (price.prompt) {
      const inM = perM(price.prompt), outM = perM(price.completion);
      entry.price = { input: '$' + inM + '/M', output: '$' + outM + '/M' };
    }
    if (entry.context || entry.price) {
      out[m.name] = entry;
      found++;
    }
  });

  // 4. 写入（保留上次的价格作兜底，避免某次抓取失败导致价格缺失）
  let prev = {};
  try { prev = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')); } catch (e) {}
  Object.keys(out).forEach(function (k) {
    if (!out[k].price && prev[k] && prev[k].price) out[k].price = prev[k].price;
    if (!out[k].context && prev[k] && prev[k].context) out[k].context = prev[k].context;
  });

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2), 'utf8');
  console.log('已更新 ' + found + '/' + aiModels.length + ' 个模型的价格/上下文 -> ' + OUT_FILE);
}

main().catch(function (e) { console.error('失败:', e.message); process.exit(1); });
