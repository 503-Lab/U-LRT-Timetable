// キャッシュ名
const CACHE_NAME = 'my-cache-v1';
// キャッシュするファイルのリスト
const FILES_TO_CACHE = [
    '/index.html',
    '/style.css',
    '/script/main.js',
    '/script/util.js',
    '/script/config.js',
    '/image/map.js',
    '/image/icon/icon-192x192.js',
    '/image/icon/icon-512x512.js'
];

// インストール時にファイルをキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// フェッチイベントをリスニング
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュが見つかった場合はそのレスポンスを返す
                if (response) {
                    // ネットワークからもリクエストを行い、結果をキャッシュを更新する
                    fetch(event.request).then((networkResponse) => {
                        // レスポンスが有効な場合のみキャッシュを更新
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                    });
                    return response; // キャッシュからのレスポンスを返す
                }
                // キャッシュが見つからない場合はネットワークから取得
                return fetch(event.request).then((networkResponse) => {
                    // 取得したレスポンスをキャッシュに追加
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse; // ネットワークからのレスポンスを返す
                });
            })
    );
});