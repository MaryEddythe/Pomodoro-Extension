let countdown;
let time = 25 * 60; // Default time is 25 minutes

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        startTimer();
    } else if (message.command === 'pause') {
        pauseTimer();
    } else if (message.command === 'reset') {
        resetTimer();
    } else if (message.command === 'setTime') {
        setTime(message.time);
    }
});

function startTimer() {
    clearInterval(countdown); // Clear any existing intervals
    countdown = setInterval(() => {
        if (time > 0) {
            time--;
            updatePopup();
        } else {
            completeTimer(); // Handle timer completion
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdown); // Stop the countdown
}

function resetTimer() {
    clearInterval(countdown);
    time = 25 * 60; // Reset to default 25 minutes
    updatePopup();
}

function setTime(customTime) {
    clearInterval(countdown);
    time = customTime; // Update time to the custom value
    updatePopup();
}

function completeTimer() {
    clearInterval(countdown);
    time = 25 * 60; // Reset to default 25 minutes
    updatePopup();

    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'images/tomato128.png',
        title: 'Time is up!',
        message: 'Take a break, your 25-minute session is complete.',
        priority: 2
    });
}

function updatePopup() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    chrome.runtime.sendMessage({ timer: formattedTime });
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.command === 'start') {
        startTimer();
    } else if (message.command === 'pause') {
        stopTimer();
    } else if (message.command === 'reset') {
        resetTimer();
    } else if (message.command === 'setTime') {
        time = message.time;
        updatePopup();
    }
});
