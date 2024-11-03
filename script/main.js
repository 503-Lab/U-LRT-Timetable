
window.onload = () => {
    updateTime();
    updateTimetable()
}

// 現在時刻を表示する関数
function updateTime() {
    const event = () => {
        document.getElementById('CurrentTime').textContent = getCurrentTime();
    }
    event();
    // 10 秒毎に実行
    setInterval(event, 10000);
}


// 時刻表を表示する関数
async function updateTimetable() {

    let todayTimetable = await getTodayTimetable();

    const event = () => {

        const displayLines = getDisplayLines(todayTimetable, 2);
        displayLines.forEach((line, index) => {
            document.getElementById(`line_${index}`).textContent = `${line.getHours()}:${line.getMinutes()}`;
        });
    }
    event();
    // 10 秒毎に実行
    setInterval(event, 10000);
}

// 今日の時刻表を取得する関数
async function getTodayTimetable() {
    const today = await getTodayEvent();

    if (today.isHoliday || today.isWeekend) {
        // もし土日、祝日なら
        return Timetable.weekends_holidays;// 土日、祝日の時刻表を返す
    } else {
        // もし平日なら
        return Timetable.weekdays;// 平日の時刻表を返す
    }
}

function getDisplayLines(todayTimetable, length) {

    const now = new Date();
    const now_hours = now.getHours();
    const now_minutes = now.getMinutes();

    const recentTimeList = [];

    const hoursList = Object.keys(todayTimetable);
    for (let i = 0; i < hoursList.length; i++) {
        if (recentTimeList.length >= length) break;
        const hours = hoursList[i];
        if (hours >= now_hours) {
            const minutesList = todayTimetable[hours];
            for (let j = 0; j < minutesList.length; j++) {
                if (recentTimeList.length >= length) break;
                const minutes = minutesList[j];
                if (minutes >= now_minutes) {
                    const tmpDate = new Date();
                    tmpDate.setHours(hours);
                    tmpDate.setMinutes(minutes);
                    recentTimeList.push(tmpDate);
                }
            }
        }
    }
    return recentTimeList;
}