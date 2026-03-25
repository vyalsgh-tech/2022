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
// 3. 시간표 버전 변경 및 요소 제어 로직
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
    if (period5Row.style.display === 'none') {
        period5Row.style.display = '';
    } else {
        period5Row.style.display = 'none';
    }
});

// ==========================================
// 4. 과목명 긴 글자 입력 시 폰트 자동 압축 로직
// ==========================================
const subjectInputs = document.querySelectorAll('.subject-input');

subjectInputs.forEach(input => {
    input.addEventListener('input', function() {
        const len = this.value.length;
        
        // 수정: 8글자 초과(9글자 이상) 시 크기와 자간을 줄입니다.
        if (len >= 12) {
            this.style.fontSize = '65%';
            this.style.letterSpacing = '-1.5px';
        } else if (len > 8) { // 8글자를 초과하는 경우
            this.style.fontSize = '85%';
            this.style.letterSpacing = '-0.5px';
        } else {
            // 8글자 이하일 때는 기본 크기 유지
            this.style.fontSize = '100%';
            this.style.letterSpacing = 'normal';
        }
    });
});