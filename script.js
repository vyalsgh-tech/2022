// ==========================================
// 1. 실시간 시계 연동 (한국 표준시)
// ==========================================
let timeOffset = 0; 

async function syncServerTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul');
        const data = await response.json();
        
        const serverTime = new Date(data.datetime).getTime();
        const localTime = Date.now();
        
        timeOffset = serverTime - localTime;
    } catch (error) {
        console.warn("시간 서버와 동기화할 수 없습니다. 기기 로컬 시간을 사용합니다.", error);
    }
}

function updateClock() {
    const now = new Date(Date.now() + timeOffset);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours} : ${minutes} : ${seconds}`;
}

syncServerTime().then(() => {
    updateClock(); 
    setInterval(updateClock, 1000); 
});
setInterval(syncServerTime, 3600000);

// ==========================================
// 2. 화면 크기 및 문단 높이 조절 로직 (버튼 기능)
// ==========================================
let currentFontScale = 1.0;
let currentSpaceScale = 1.0;

function updateScale() {
    document.documentElement.style.setProperty('--font-scale', currentFontScale);
    document.documentElement.style.setProperty('--space-scale', currentSpaceScale);
}

document.getElementById('btn-font-up').addEventListener('click', () => {
    currentFontScale += 0.1;
    updateScale();
});
document.getElementById('btn-font-down').addEventListener('click', () => {
    currentFontScale = Math.max(0.5, currentFontScale - 0.1);
    updateScale();
});
document.getElementById('btn-space-up').addEventListener('click', () => {
    currentSpaceScale += 0.1;
    updateScale();
});
document.getElementById('btn-space-down').addEventListener('click', () => {
    currentSpaceScale = Math.max(0.3, currentSpaceScale - 0.1);
    updateScale();
});

// ==========================================
// 3. 시간표 버전 변경 및 5교시 토글 로직 추가
// ==========================================
const scheduleSelector = document.getElementById('schedule-selector');
const schedule2022 = document.getElementById('schedule-2022');
const schedule2015 = document.getElementById('schedule-2015');
const btnToggle5th = document.getElementById('btn-toggle-5th');
const period5Row = document.getElementById('period-5-row');

// 타이틀(드롭다운) 변경 이벤트
scheduleSelector.addEventListener('change', (e) => {
    if (e.target.value === '2022') {
        schedule2022.style.display = ''; // 2022년도 표시
        schedule2015.style.display = 'none'; // 2015년도 숨김
        btnToggle5th.style.display = 'none'; // 5교시 버튼 숨김
    } else if (e.target.value === '2015') {
        schedule2022.style.display = 'none'; // 2022년도 숨김
        schedule2015.style.display = ''; // 2015년도 표시
        btnToggle5th.style.display = 'inline-block'; // 5교시 버튼 표시
    }
});

// 5교시 추가/삭제 버튼 이벤트
btnToggle5th.addEventListener('click', () => {
    // 5교시가 숨겨져 있다면 보이게, 보인다면 숨기게 전환
    if (period5Row.style.display === 'none') {
        period5Row.style.display = '';
    } else {
        period5Row.style.display = 'none';
    }
});