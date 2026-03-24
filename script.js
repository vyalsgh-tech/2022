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

// 간격(위아래 문단 높이) 조절 기능
document.getElementById('btn-space-up').addEventListener('click', () => {
    currentSpaceScale += 0.1;
    updateScale();
});

document.getElementById('btn-space-down').addEventListener('click', () => {
    currentSpaceScale = Math.max(0.3, currentSpaceScale - 0.1); // 최소 간격 제한
    updateScale();
});