// 現在時刻 を 取得して return
function getCurrentTime() {
    const now = new Date();
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
}

// Get リクエスト
// json を return する
// 失敗したら undefined を return する
function getJSON(url) {
    return new Promise((resolve) => {
        fetch(url)
            .then((res) => res.json())
            .then((json) => resolve(json))
            .catch(() => resolve(undefined));
    });
}

// 今日が休日か祝日なのか調べて結果を return
async function getTodayEvent() {
    // 現在時刻を取得してタイムスタンプに変換（ミリ秒単位）
    const timestamp = new Date().getTime();
    // GetTodayEventURL にリクエストを送信して そのレスポンスを return
    return await getJSON(`${GetTodayEventURL}?timestamp=${timestamp}`);
}