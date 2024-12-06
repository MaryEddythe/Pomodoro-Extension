document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    const settingsIcon = document.getElementById('settings-icon');
    const settingsDiv = document.getElementById('settings');

    // Start Timer
    startButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'start' });
        resetButton.classList.remove('hidden'); // Show Reset button
    });

    // Stop Timer
    stopButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'pause' });
    });

    // Reset Timer
    resetButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'reset' });
    });

    // Toggle Settings
    settingsIcon.addEventListener('click', () => {
        settingsDiv.classList.toggle('hidden');
    });

    // Set Custom Time
    document.getElementById('set-time').addEventListener('click', () => {
        const customTime = parseInt(document.getElementById('custom-time').value, 10);
        if (customTime && customTime > 0 && customTime <= 60) {
            chrome.runtime.sendMessage({ command: 'setTime', time: customTime * 60 });
        } else {
            alert('Please enter a valid number between 1 and 60.');
        }
    });

    // Update Timer Display
    chrome.runtime.onMessage.addListener((message) => {
        if (message.timer) {
            document.getElementById('timer').textContent = message.timer;
        }
    });
});
