// ============================================================
// Service Worker — 开发者知识库 PWA 离线缓存
// ============================================================
// 策略：
//   - 静态资源（HTML/CSS/JS/字体/图片）: 缓存优先，后台更新
//   - GitHub 数据 JSON: 网络优先，失败回退缓存
//   - 导航请求: 网络优先，离线回退到缓存的 index 页面
// ============================================================

var CACHE_VERSION = 'kb-v1.0.0';
var STATIC_CACHE = CACHE_VERSION + '-static';
var DATA_CACHE = CACHE_VERSION + '-data';

// 预缓存的核心资源（安装时缓存）
var PRECACHE_URLS = [
  './',
  './dev-knowledge-base.html',
  './assets/app.js',
  './assets/charts.js',
  './assets/data.js',
  './assets/data-ext.js',
  './_shared/js/echarts.min.js',
  './_shared/fonts/Outfit-Regular.ttf',
  './_shared/fonts/Outfit-Bold.ttf',
  './_shared/fonts/InstrumentSans-Regular.ttf',
  './_shared/fonts/InstrumentSans-Bold.ttf',
  './_shared/fonts/JetBrainsMono-Regular.ttf',
  './_shared/fonts/JetBrainsMono-Bold.ttf'
];

// 需要缓存的资源模式
var CACHE_PATTERNS = [
  /\.html$/,
  /\.css$/,
  /\.js$/,
  /\.ttf$/,
  /\.woff2?$/,
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.gif$/,
  /\.svg$/,
  /\.webp$/,
  /\.ico$/
];

// ===== 安装：预缓存核心资源 =====
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(function(cache) {
      // 逐个缓存，某个失败不影响其他
      return Promise.all(
        PRECACHE_URLS.map(function(url) {
          return cache.add(url).catch(function() {
            // 忽略单个资源的缓存失败
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ===== 激活：清理旧缓存 =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          // 删除不属于当前版本的缓存
          if (name.indexOf(CACHE_VERSION) !== 0) {
            return caches.delete(name);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ===== 请求拦截：根据资源类型选择策略 =====
self.addEventListener('fetch', function(event) {
  var request = event.request;

  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  var url = new URL(request.url);

  // 跨域请求：直接放行（不缓存）
  if (url.origin !== self.location.origin) return;

  // GitHub 数据 JSON: 网络优先，失败回退缓存
  if (url.pathname.indexOf('github-data.json') !== -1) {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          // 缓存最新的数据
          if (response.ok) {
            var clone = response.clone();
            caches.open(DATA_CACHE).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(function() {
          // 离线时返回缓存的数据
          return caches.match(request);
        })
    );
    return;
  }

  // 导航请求（HTML 页面）: 网络优先，离线回退缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(STATIC_CACHE).then(function(cache) {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(request).then(function(cached) {
            return cached || caches.match('./dev-knowledge-base.html');
          });
        })
    );
    return;
  }

  // 静态资源: 缓存优先，后台更新（stale-while-revalidate）
  var shouldCache = CACHE_PATTERNS.some(function(pattern) {
    return pattern.test(url.pathname);
  });

  if (shouldCache) {
    event.respondWith(
      caches.match(request).then(function(cached) {
        // 后台更新缓存（不阻塞响应）
        var fetchPromise = fetch(request).then(function(response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(STATIC_CACHE).then(function(cache) {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(function() {
          // 网络失败，忽略（已有缓存或无缓存）
        });

        // 优先返回缓存，无缓存时等待网络
        return cached || fetchPromise;
      })
    );
    return;
  }

  // 其他请求：正常转发
});

// ===== 消息通信：支持手动更新 =====
self.addEventListener('message', function(event) {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
