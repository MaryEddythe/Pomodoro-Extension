let timerData = {
  timeRemaining: 25 * 60, // Default: 25 minutes
  isRunning: false,
  isWorkSession: true, // Work session by default
  intervalId: null
};

// Format the time for the badge (e.g., "25:00")
function formatTimeForBadge(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Update the badge text and background color
function updateBadge() {
  if (timerData.isRunning && timerData.timeRemaining > 0) {
    const badgeText = formatTimeForBadge(timerData.timeRemaining);
    chrome.action.setBadgeText({ text: badgeText });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); // Green for active
  } else {
    chrome.action.setBadgeText({ text: "" }); // Clear badge when stopped or finished
  }
}

// Start the timer
function startTimer() {
  if (timerData.isRunning) return; // Prevent multiple intervals
  timerData.isRunning = true;

  timerData.intervalId = setInterval(() => {
    if (timerData.timeRemaining > 0) {
      timerData.timeRemaining--;
      updateBadge(); // Update the badge every second
      chrome.storage.local.set({ timerData }); // Persist state
    } else {
      clearInterval(timerData.intervalId);
      timerData.isRunning = false;
      timerData.timeRemaining = timerData.isWorkSession ? 5 * 60 : 25 * 60; // Toggle work/break
      timerData.isWorkSession = !timerData.isWorkSession;

      // Show notification
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/tomato128.png",
        title: "Pomodoro Timer",
        message: timerData.isWorkSession ? "Time to focus!" : "Take a short break!",
        priority: 2
      });

      updateBadge(); // Reset the badge
      chrome.storage.local.set({ timerData }); // Persist updated state
    }
  }, 1000);
}

// Stop the timer
function stopTimer() {
  clearInterval(timerData.intervalId);
  timerData.isRunning = false;
  updateBadge(); // Clear badge on stop
  chrome.storage.local.set({ timerData });
}

// Reset the timer
function resetTimer() {
  clearInterval(timerData.intervalId);
  timerData.isRunning = false;
  timerData.timeRemaining = timerData.isWorkSession ? 25 * 60 : 5 * 60; // Reset to default
  updateBadge(); // Reset badge text
  chrome.storage.local.set({ timerData });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") {
    startTimer();
  } else if (message.command === "stop") {
    stopTimer();
  } else if (message.command === "reset") {
    resetTimer();
  } else if (message.command === "getTimerData") {
    sendResponse(timerData); // Send the current timer state to the popup
  } else if (message.command === "setCustomTime") {
    timerData.timeRemaining = message.time; // Set custom time
    updateBadge(); // Update badge immediately
    chrome.storage.local.set({ timerData }); // Persist updated state
  }
});

// Initialize badge on extension load or when installed
chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});