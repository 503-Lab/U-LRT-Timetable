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
    event.respondWith(caches.match(event.request).then(async (cacheResponse) => {
        try {
            // キャッシュが見つかった場合はキャッシュのレスポンスを返す
            if (cacheResponse) {
                // キャッシュの更新を試みる
                tryPutCache(event);
                return cacheResponse;
            } else {
                // そうでなければネットワークのレスポンスを返す
                return fetch(event.request);
            }
        } catch {
            // ステータスコード 404 の空の文字列を返す
            return new Response("", { status: 404 });
        }
    }));
});

async function tryPutCache(event) {
    const networkResponse = await fetch(event.request);
    // キャッシュされる設定のリクエストで、レスポンスが有効な場合のみキャッシュを更新
    if (networkResponse && networkResponse.status === 200) {
        // ネットワークのレスポンスをキャッシュに追加
        caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse);
        });
    }
}