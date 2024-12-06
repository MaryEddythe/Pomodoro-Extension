let timerData = {
  timeRemaining: 25 * 60,
  isRunning: false,
  isWorkSession: true,
  intervalId: null
};

function startTimer() {
  if (timerData.isRunning) return;
  timerData.isRunning = true;

  timerData.intervalId = setInterval(() => {
    if (timerData.timeRemaining > 0) {
      timerData.timeRemaining--;
      chrome.storage.local.set({ timerData });
    } else {
      clearInterval(timerData.intervalId);
      timerData.isRunning = false;
      timerData.timeRemaining = timerData.isWorkSession ? 5 * 60 : 25 * 60;
      timerData.isWorkSession = !timerData.isWorkSession;

      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/time.png",
        title: "Pomodoro Timer",
        message: timerData.isWorkSession ? "Time to focus!" : "Take a short break!",
        priority: 2
      });

      chrome.storage.local.set({ timerData });
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerData.intervalId);
  timerData.isRunning = false;
  chrome.storage.local.set({ timerData });
}

function resetTimer() {
  clearInterval(timerData.intervalId);
  timerData.isRunning = false;
  timerData.timeRemaining = timerData.isWorkSession ? 25 * 60 : 5 * 60;
  chrome.storage.local.set({ timerData });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "start") startTimer();
  else if (message.command === "stop") stopTimer();
  else if (message.command === "reset") resetTimer();
  else if (message.command === "getTimerData") sendResponse(timerData);
  else if (message.command === "setCustomTime") {
    resetTimer();
    timerData.timeRemaining = message.time;
    chrome.storage.local.set({ timerData });
  }
});
