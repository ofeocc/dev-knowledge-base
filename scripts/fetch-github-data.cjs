#!/usr/bin/env node
/**
 * GitHub API 数据抓取脚本
 *
 * 从 GitHub REST API v3 获取真实的仓库数据：
 *   - stars (星标数)
 *   - pushed_at (最后推送时间)
 *   - open_issues_count (开放 Issue 数)
 *   - contributors (贡献者数，通过额外 API 调用)
 *   - description (仓库描述)
 *   - license (开源协议)
 *   - language (主要语言)
 *
 * 用法：
 *   GITHUB_TOKEN=ghp_xxxx node scripts/fetch-github-data.js
 *
 * 限流策略：
 *   - 无 Token: 60 请求/小时（仅适合少量测试）
 *   - 有 Token: 5000 请求/小时（推荐，可覆盖全部 293+ 仓库）
 *   - 脚本内置并发控制（10 并发）和速率检查
 *   - 每次请求间隔 100ms，避免触发二次限流
 *   - 失败自动重试 3 次，指数退避
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ===== 配置 =====
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const MAX_CONCURRENCY = 10;       // 最大并发请求数
const REQUEST_DELAY = 100;        // 每次请求最小间隔 (ms)
const MAX_RETRIES = 3;            // 失败重试次数
const API_BASE = 'https://api.github.com';

// 数据文件路径
const DATA_FILE = path.join(__dirname, '..', 'assets', 'data.js');
const OUTPUT_FILE = path.join(__dirname, '..', 'assets', 'github-data.json');

// ===== 工具函数 =====

/**
 * 从 GitHub URL 提取 owner/repo
 * 支持格式: https://github.com/owner/repo
 */
function extractRepo(url) {
  if (!url || typeof url !== 'string') return null;
  var match = url.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
  if (!match) return null;
  var owner = match[1];
  var repo = match[2].replace(/\.git$/, '');
  if (!owner || !repo || owner.length === 0 || repo.length === 0) return null;
  return { owner: owner, repo: repo, fullName: owner + '/' + repo };
}

/**
 * 从 data.js 中提取所有 GitHub 仓库 URL
 */
function extractAllRepos() {
  // 读取 data.js 并 eval 提取 KB_DATA
  var content = fs.readFileSync(DATA_FILE, 'utf8');
  // 同时检查 data-ext.js
  var extPath = path.join(__dirname, '..', 'assets', 'data-ext.js');
  if (fs.existsSync(extPath)) {
    content += '\n' + fs.readFileSync(extPath, 'utf8');
  }

  // 用沙箱方式执行
  var sandbox = { KB_DATA: {} };
  try {
    var vm = require('vm');
    var ctx = vm.createContext(sandbox);
    vm.runInContext(content, ctx);
  } catch(e) {
    console.error('解析数据文件失败:', e.message);
    process.exit(1);
  }

  var repos = {};
  var categories = Object.keys(sandbox.KB_DATA).filter(function(k) {
    return Array.isArray(sandbox.KB_DATA[k]);
  });

  categories.forEach(function(cat) {
    sandbox.KB_DATA[cat].forEach(function(item) {
      if (!item || !item.name) return;
      var repo = extractRepo(item.url);
      if (repo) {
        // 去重：同一个 repo 只记录一次
        if (!repos[repo.fullName]) {
          repos[repo.fullName] = {
            owner: repo.owner,
            repo: repo.repo,
            fullName: repo.fullName,
            itemName: item.name,
            category: cat
          };
        }
      }
    });
  });

  return Object.values(repos);
}

/**
 * HTTPS GET 请求封装
 */
function httpsGet(url, headers) {
  return new Promise(function(resolve, reject) {
    var req = https.get(url, {
      headers: headers,
      timeout: 15000
    }, function(res) {
      var data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    req.on('timeout', function() {
      req.destroy(new Error('请求超时'));
    });
  });
}

/**
 * 带重试的 GitHub API 请求
 */
async function githubRequest(endpoint, retryCount) {
  retryCount = retryCount || 0;
  var url = API_BASE + endpoint;
  var headers = {
    'User-Agent': 'dev-knowledge-base-fetcher/1.0',
    'Accept': 'application/vnd.github+json'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = 'Bearer ' + GITHUB_TOKEN;
  }

  try {
    var res = await httpsGet(url, headers);

    // 检查限流
    var remaining = parseInt(res.headers['x-ratelimit-remaining'] || '9999');
    if (remaining <= 1) {
      var resetTime = parseInt(res.headers['x-ratelimit-reset'] || '0');
      var waitSec = Math.max(0, resetTime - Math.floor(Date.now() / 1000));
      console.warn('⚠ API 限流即将耗尽，剩余 ' + remaining + ' 次，需要等待 ' + waitSec + ' 秒');
      if (waitSec > 0 && waitSec < 3600) {
        console.log('  等待 ' + waitSec + ' 秒后继续...');
        await new Promise(function(r) { setTimeout(r, waitSec * 1000); });
        return githubRequest(endpoint, retryCount);
      }
    }

    if (res.statusCode === 200) {
      return JSON.parse(res.body);
    }

    if (res.statusCode === 404) {
      return null; // 仓库不存在或已删除
    }

    if (res.statusCode === 403) {
      // 二次限流
      if (retryCount < MAX_RETRIES) {
        var wait = Math.pow(2, retryCount) * 1000;
        console.warn('  403 限流，等待 ' + wait + 'ms 后重试 (' + (retryCount + 1) + '/' + MAX_RETRIES + ')');
        await new Promise(function(r) { setTimeout(r, wait); });
        return githubRequest(endpoint, retryCount + 1);
      }
    }

    if (retryCount < MAX_RETRIES) {
      var wait2 = Math.pow(2, retryCount) * 1000;
      console.warn('  ' + res.statusCode + ' 错误，重试 (' + (retryCount + 1) + '/' + MAX_RETRIES + ')');
      await new Promise(function(r) { setTimeout(r, wait2); });
      return githubRequest(endpoint, retryCount + 1);
    }

    console.error('  请求失败: ' + res.statusCode + ' ' + endpoint);
    return null;
  } catch(err) {
    if (retryCount < MAX_RETRIES) {
      var wait3 = Math.pow(2, retryCount) * 1000;
      console.warn('  网络错误: ' + err.message + '，重试 (' + (retryCount + 1) + '/' + MAX_RETRIES + ')');
      await new Promise(function(r) { setTimeout(r, wait3); });
      return githubRequest(endpoint, retryCount + 1);
    }
    console.error('  请求异常: ' + err.message);
    return null;
  }
}

/**
 * 获取单个仓库的数据
 */
async function fetchRepoData(repo) {
  var data = await githubRequest('/repos/' + repo.owner + '/' + repo.repo);
  if (!data) return null;

  var result = {
    name: repo.fullName,
    stars: data.stargazers_count || 0,
    forks: data.forks_count || 0,
    openIssues: data.open_issues_count || 0,
    lastPush: data.pushed_at || data.updated_at || '',
    description: data.description || '',
    language: data.language || '',
    license: data.license ? data.license.spdx_id : null,
    homepage: data.homepage || '',
    archived: data.archived || false,
    defaultBranch: data.default_branch || 'main',
    updatedAt: data.updated_at || ''
  };

  // 贡献者数：通过 Link header 的最后一页获取（避免拉取全部贡献者数据）
  // 只在需要时请求，减少 API 调用
  try {
    var contributorCount = await fetchContributorCount(repo);
    result.contributors = contributorCount;
  } catch(e) {
    result.contributors = 0;
  }

  return result;
}

/**
 * 获取贡献者数量（通过 Link header 分页）
 */
async function fetchContributorCount(repo) {
  // 请求第一页，每页 1 条，通过 Link header 解析总数
  var url = '/repos/' + repo.owner + '/' + repo.repo + '/contributors?per_page=1&anon=1';
  var headers = {
    'User-Agent': 'dev-knowledge-base-fetcher/1.0',
    'Accept': 'application/vnd.github+json'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = 'Bearer ' + GITHUB_TOKEN;
  }

  var res = await httpsGet(API_BASE + url, { headers: headers });
  // 这个方法需要用完整的 https.get 来获取 headers
  // 重新用 githubRequest 不行因为它只返回 body
  // 改用直接估算：stars / 10 作为近似值（GitHub API 限制 contributors 查询）

  // 实际上我们的 httpsGet 返回 headers
  if (res && res.headers && res.headers.link) {
    var match = res.headers.link.match(/page=(\d+)>;\s*rel="last"/);
    if (match) {
      return parseInt(match[1]);
    }
  }

  // 降级：返回 0，前端会用估算值
  return 0;
}

/**
 * 并发控制器
 */
async function runWithConcurrency(tasks, concurrency) {
  var results = [];
  var index = 0;

  async function worker() {
    while (index < tasks.length) {
      var currentIndex = index++;
      var task = tasks[currentIndex];
      try {
        var result = await task();
        results[currentIndex] = result;
      } catch(err) {
        results[currentIndex] = null;
      }
      // 请求间隔
      if (REQUEST_DELAY > 0) {
        await new Promise(function(r) { setTimeout(r, REQUEST_DELAY); });
      }
    }
  }

  var workers = [];
  for (var i = 0; i < Math.min(concurrency, tasks.length); i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

// ===== 主流程 =====

async function main() {
  console.log('========================================');
  console.log('  GitHub API 数据抓取脚本');
  console.log('========================================\n');

  if (!GITHUB_TOKEN) {
    console.warn('⚠ 未设置 GITHUB_TOKEN 环境变量');
    console.warn('  无 Token 限流: 60 请求/小时');
    console.warn('  有 Token 限流: 5000 请求/小时');
    console.warn('  获取 Token: https://github.com/settings/tokens (选 classic token, 勾选 public_repo)\n');
  } else {
    console.log('✓ 已检测到 GITHUB_TOKEN\n');
  }

  // 1. 提取所有仓库 URL
  console.log('1. 解析数据文件，提取 GitHub 仓库...');
  var repos = extractAllRepos();
  console.log('   共发现 ' + repos.length + ' 个 GitHub 仓库\n');

  if (repos.length === 0) {
    console.error('未找到任何 GitHub 仓库 URL');
    process.exit(1);
  }

  // 2. 检查是否已有缓存数据（增量更新）
  var existingData = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      var oldData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
      if (oldData.repositories) {
        existingData = oldData.repositories;
        console.log('   已有缓存数据: ' + Object.keys(existingData).length + ' 个仓库\n');
      }
    } catch(e) {}
  }

  // 3. 并发抓取
  console.log('2. 开始从 GitHub API 抓取数据...');
  console.log('   并发数: ' + MAX_CONCURRENCY + ' | 请求间隔: ' + REQUEST_DELAY + 'ms\n');

  var successCount = 0;
  var failCount = 0;
  var startTime = Date.now();

  var tasks = repos.map(function(repo) {
    return async function() {
      var data = await fetchRepoData(repo);
      if (data) {
        successCount++;
        if (successCount % 20 === 0) {
          console.log('   进度: ' + successCount + '/' + repos.length + ' (' + Math.round(successCount/repos.length*100) + '%)');
        }
        return { repo: repo, data: data };
      } else {
        failCount++;
        return { repo: repo, data: null };
      }
    };
  });

  var results = await runWithConcurrency(tasks, MAX_CONCURRENCY);

  // 4. 构建输出数据
  var repositories = {};
  results.forEach(function(r) {
    if (r && r.data) {
      repositories[r.repo.fullName] = r.data;
    }
  });

  // 合并旧数据（保留抓取失败的旧数据）
  Object.keys(existingData).forEach(function(key) {
    if (!repositories[key]) {
      repositories[key] = existingData[key];
    }
  });

  var output = {
    meta: {
      fetchTime: new Date().toISOString(),
      totalRepos: repos.length,
      successCount: successCount,
      failCount: failCount,
      usingToken: !!GITHUB_TOKEN
    },
    repositories: repositories
  };

  // 5. 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');

  var elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n3. 抓取完成！');
  console.log('   成功: ' + successCount + ' | 失败: ' + failCount + ' | 耗时: ' + elapsed + 's');
  console.log('   输出文件: ' + OUTPUT_FILE);
  console.log('   文件大小: ' + (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1) + ' KB\n');

  // 6. 显示限流信息
  if (GITHUB_TOKEN) {
    console.log('提示: 可通过 cron 或 GitHub Actions 定期运行此脚本保持数据新鲜。');
    console.log('      推荐频率: 每天一次（数据不需要实时更新）');
  }
}

main().catch(function(err) {
  console.error('脚本执行失败:', err);
  process.exit(1);
});
