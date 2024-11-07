let todayTimetable;// 今日の上がりの時刻表
let todaytimetable2;//　今日の下がりの時刻表
let currentDay;//現在の曜日

window.onload = async () => {
    const event = () => {
        updateTime();
        updateTimetable();
    }
    event();
    // 10 秒毎に実行
    setInterval(event, 10000);
}

// 現在時刻を表示する関数
function updateTime() {
    document.getElementById('CurrentTime').textContent = toStringTime(new Date());
}

// 時刻表を表示する関数
async function updateTimetable() {
    const now = new Date();

    const nowDay = now.getDay();
    if (!todayTimetable  || currentDay !== nowDay) {
        todayTimetable = await getTodayTimetable(Yoto3chomeAgariTimetable);
        todayTimetable2 = await getTodayTimetable(UniversityYotoCampusSagariTimetable);
        currentDay = nowDay;
    }

    const displayLines = getDisplayLines(todayTimetable, 2);
    const displayLines2 = getDisplayLines(todayTimetable2, 2);
    writeDisplayLines(1, displayLines);
    writeDisplayLines(2, displayLines, 2);
}

// 今日の時刻表を取得する関数
async function getTodayTimetable(Timetable) {
    const today = await getTodayEvent();

    console.log(`today:`);
    console.log(today);

    // 今日のイベントを取得できたら
    if (today) {
        if (today.isHoliday || today.isWeekend) {
            // もし土日、祝日なら
            return Timetable.weekends_holidays;// 土日、祝日の時刻表を返す
        } else {
            // もし平日なら
            return Timetable.weekdays;// 平日の時刻表を返す
        }
    } else {
        // 今日のイベントを取得できなかったらオフラインで 土日 を計算
        const today = new Date().getDay();
        // 0: 日曜日, 6: 土曜日
        return today === 0 || today === 6 ? Timetable.weekends_holidays : Timetable.weekdays;
    }
}

function getDisplayLines(todayTimetable, length) {

    // 基準時間を設定
    const ref_date = new Date();
    const tmp_date = ref_date.getDate();
    ref_date.setMinutes(ref_date.getMinutes() + HideMinutes);

    const ref_hours = ref_date.getHours();
    const ref_minutes = ref_date.getMinutes();

    const recentTimeList = [];

    // 基準時間の日付と現在の日付が違う場合
    if (tmp_date !== ref_date.getDate()) return recentTimeList;

    const hoursList = Object.keys(todayTimetable);
    hoursList.some(hours => {
        if (hours >= ref_hours) {
            const minutesList = todayTimetable[hours];
            return minutesList.some(minutes => {
                if (minutes >= ref_minutes || ref_hours < hours) {
                    const tmpDate = new Date();
                    tmpDate.setHours(hours);
                    tmpDate.setMinutes(minutes);
                    recentTimeList.push(tmpDate);
                }
                if (recentTimeList.length >= length) return true;
                return false;
            });
        }
    });
    return recentTimeList;
}

function writeDisplayLines(display_index, displayLines) {
    const now = new Date();
    for (let index = 0; index < displayLines.length; index++) {
        let line_date = displayLines[index];
        let line_text = "";
        let line_text_class = "notice";

        if (line_date) {
            // 現在時刻との差を ミリ秒単位で引き算 して 単位を分に変換して少数を切り捨て
            const diffIn_min = Math.floor((line_date.getTime() - now.getTime()) / (1000 * 60));
            line_text = `あと ${diffIn_min}分 `;

            if (diffIn_min >= WalkMinutes) {
                line_text += "余裕で間に合います";
                line_text_class = "notice notice-leeway";
            } else if (diffIn_min >= RunMinutes) {
                line_text += "歩いても間に合います";
                line_text_class = "notice notice-walk";
            } else {
                line_text += "走れば間に合います";
                line_text_class = "notice notice-run";
            }
        } else {
            const tmp_date = new Date();
            tmp_date.setHours(0);
            tmp_date.setMinutes(0);
            line_date = tmp_date;
            line_text = "なし";
        }

        // 電車のメッセージを設定
        const line_text_elm = document.getElementById(`line${display_index}_text_${index}`);
        line_text_elm.textContent = line_text;
        line_text_elm.className = line_text_class;

        // 電車の時刻を設定
        const line_time_elm = document.getElementById(`line${display_index}_time_${index}`);
        line_time_elm.textContent = toStringTime(line_date);
    };
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function (registration) {
        // 登録成功
        console.log('ServiceWorker の登録に成功しました。スコープ: ', registration.scope);
    }).catch(function (err) {
        // 登録失敗
        console.log('ServiceWorker の登録に失敗しました。', err);
    });
}