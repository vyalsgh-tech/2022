// ==========================================
// 1. 실시간 시계 연동
// ==========================================
let timeOffset = 0; 
async function syncServerTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul');
        const data = await response.json();
        timeOffset = new Date(data.datetime).getTime() - Date.now();
    } catch (error) {
        console.warn("시간 서버와 동기화 실패");
    }
}
function updateClock() {
    const now = new Date(Date.now() + timeOffset);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours} : ${minutes} : ${seconds}`;
}
syncServerTime().then(() => { updateClock(); setInterval(updateClock, 1000); });
setInterval(syncServerTime, 3600000);

// ==========================================
// 2. 구형 브라우저 호환 줌(Zoom) 기능
// ==========================================
let currentZoom = 1.0;
function updateScale() {
    document.body.style.zoom = currentZoom;
}
document.getElementById('btn-font-up').addEventListener('click', () => { currentZoom += 0.1; updateScale(); });
document.getElementById('btn-font-down').addEventListener('click', () => { currentZoom = Math.max(0.5, currentZoom - 0.1); updateScale(); });

// ==========================================
// 3. 시간표 버전 변경 로직
// ==========================================
const scheduleSelector = document.getElementById('schedule-selector');
const schedule2022 = document.getElementById('schedule-2022');
const schedule2015 = document.getElementById('schedule-2015');
const scheduleRegular = document.getElementById('schedule-regular'); 
const btnToggle5th = document.getElementById('btn-toggle-5th');
const period5Row = document.getElementById('period-5-row');
const schoolCode = document.getElementById('school-code'); 
const subjectHeader = document.getElementById('subject-header'); 

scheduleSelector.addEventListener('change', (e) => {
    schedule2022.style.display = 'none';
    schedule2015.style.display = 'none';
    scheduleRegular.style.display = 'none';
    btnToggle5th.style.display = 'none';

    if (e.target.value === '2022') {
        schedule2022.style.display = '';
        schoolCode.style.display = 'block'; 
        subjectHeader.textContent = '과목'; 
    } else if (e.target.value === '2015') {
        schedule2015.style.display = '';
        btnToggle5th.style.display = 'inline-block'; 
        schoolCode.style.display = 'block'; 
        subjectHeader.textContent = '과목'; 
    } else if (e.target.value === 'regular') {
        scheduleRegular.style.display = '';
        schoolCode.style.display = 'none'; 
        subjectHeader.textContent = '과목(코드)'; 
    }
});

btnToggle5th.addEventListener('click', () => {
    period5Row.style.display = period5Row.style.display === 'none' ? '' : 'none';
});

// ==========================================
// 4. 과목명 글자수 비례 자동 조절
// ==========================================
document.querySelectorAll('.subject-input').forEach(input => {
    input.addEventListener('input', function() {
        const len = this.value.length;
        if (len >= 12) {
            this.style.fontSize = '65%';
            this.style.letterSpacing = '-1.5px';
        } else if (len > 8) {
            this.style.fontSize = '85%';
            this.style.letterSpacing = '-0.5px';
        } else {
            this.style.fontSize = '100%';
            this.style.letterSpacing = 'normal';
        }
    });
});