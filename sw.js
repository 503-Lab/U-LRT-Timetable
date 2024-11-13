// キャッシュ名
const CACHE_NAME = 'file-cache-v1';
// キャッシュするファイルのリスト
const FILES_TO_CACHE = [
    './',
    './manifest.json',
    './index.html',
    './style.css',
    './script/main.js',
    './script/util.js',
    './script/config.js',
    './image/map/UniversityYotoCampus.png',
    './image/map/Yoto3chome.png',
    './image/icon/icon-192x192.png',
    './image/icon/icon-512x512.png'
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
    event.respondWith(caches.match(event.request).then((response) => {
        // キャッシュが見つかった場合
        if (response) {
            // ネットワークにリクエストを送信する
            return fetch(event.request).then((networkResponse) => {
                // キャッシュを更新
                putCache(event, networkResponse);
                // ネットワークからのレスポンスを返す
                return networkResponse;
            }).catch(() => {
                // オフラインの場合はキャッシュのレスポンスを返す
                return response;
            });
        }
        // キャッシュが見つからない場合はネットワークから取得
        return fetch(event.request).then((networkResponse) => {
            // キャッシュを更新
            putCache(event, networkResponse);
            // ネットワークからのレスポンスを返す
            return networkResponse;
        }).catch(() => {
            // オフラインでキャッシュもない場合
            return new Response("", { status: 404 });
        });
    }));
});

function putCache(event, networkResponse) {
    // レスポンスが有効な場合のみキャッシュを更新
    if (networkResponse && networkResponse.status === 200) {
        const networkResponseClone = networkResponse.clone();
        // 複製したレスポンスをキャッシュに追加
        caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponseClone);
        });
    }
}