let workTime = 25 * 60; // Default work time in seconds (25 minutes)
let breakTime = 5 * 60; // Default break time in seconds (5 minutes)
let isWorking = true; // Flag to track if the timer is in work or break mode
let interval;
let timerRunning = false; // To track whether the timer is running

// Load the saved state (if any) from localStorage
window.onload = function() {
    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
        const state = JSON.parse(savedState);
        workTime = state.workTime;
        breakTime = state.breakTime;
        isWorking = state.isWorking;
        timerRunning = state.timerRunning;
        document.getElementById('timer').textContent = formatTime(isWorking ? workTime : breakTime);

        if (timerRunning) {
            startTimer();
        }
    } else {
        document.getElementById('timer').textContent = formatTime(workTime);
    }
};

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('stop').addEventListener('click', stopTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('set-time').addEventListener('click', setCustomTime);
document.getElementById('settings-icon').addEventListener('click', toggleSettings);

function startTimer() {
    // Show Stop and Reset buttons, hide Start button
    document.getElementById('start').classList.add('hidden');
    document.getElementById('stop').classList.remove('hidden');
    document.getElementById('reset').classList.remove('hidden');

    interval = setInterval(updateTimer, 1000);
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
    document.getElementById('reset').disabled = false;
    
    timerRunning = true; // Timer is running
    saveState(); // Save the current state to localStorage
}

function stopTimer() {
    clearInterval(interval);
    // Hide Stop and Reset buttons, show Start button
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('stop').classList.add('hidden');
    document.getElementById('reset').classList.add('hidden');

    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;

    timerRunning = false; // Timer is stopped
    saveState(); // Save the current state to localStorage
}

function resetTimer() {
    clearInterval(interval);
    document.getElementById('timer').textContent = formatTime(workTime);
    // Hide Stop and Reset buttons, show Start button
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('stop').classList.add('hidden');
    document.getElementById('reset').classList.add('hidden');

    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
    document.getElementById('reset').disabled = true;
    isWorking = true;
    timerRunning = false; // Timer is reset
    saveState(); // Save the current state to localStorage
}

function updateTimer() {
    if (isWorking) {
        workTime--;
        document.getElementById('timer').textContent = formatTime(workTime);
        if (workTime === 0) {
            clearInterval(interval);
            isWorking = false;
            workTime = 25 * 60; // Reset work time
            alert("Time's up! Take a short break.");
            startBreakTimer();
        }
    } else {
        breakTime--;
        document.getElementById('timer').textContent = formatTime(breakTime);
        if (breakTime === 0) {
            clearInterval(interval);
            breakTime = 5 * 60; // Reset break time
            alert("Break's over! Let's get back to work.");
            startTimer(); // Start the next cycle
        }
    }

    saveState(); // Save the state after every second
}

function startBreakTimer() {
    interval = setInterval(updateTimer, 1000);
    document.getElementById('start').disabled = true;
    document.getElementById('stop').disabled = false;
    document.getElementById('reset').disabled = false;
    
    timerRunning = true; // Timer is running during break
    saveState(); // Save the state
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function setCustomTime() {
    const customTime = parseInt(document.getElementById('custom-time').value, 10);
    if (customTime && customTime >= 1 && customTime <= 60) {
        workTime = customTime * 60; // Set custom work time in seconds
        document.getElementById('timer').textContent = formatTime(workTime);
        document.getElementById('settings').classList.add('hidden'); // Hide settings
        document.getElementById('start').disabled = false;
    } else {
        alert('Please enter a valid number between 1 and 60.');
    }
}

function toggleSettings() {
    const settings = document.getElementById('settings');
    settings.classList.toggle('hidden');
}

function saveState() {
    const state = {
        workTime: workTime,
        breakTime: breakTime,
        isWorking: isWorking,
        timerRunning: timerRunning
    };
    localStorage.setItem('pomodoroState', JSON.stringify(state)); // Save state to localStorage
}
