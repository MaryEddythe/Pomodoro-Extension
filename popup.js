document.addEventListener("DOMContentLoaded", () => {
  const timerDisplay = document.getElementById("timer");
  const startBtn = document.getElementById("start");
  const stopBtn = document.getElementById("stop");
  const resetBtn = document.getElementById("reset");
  const settingsIcon = document.getElementById("settings-icon");
  const settingsDiv = document.getElementById("settings");
  const customTimeInput = document.getElementById("custom-time");
  const setTimeBtn = document.getElementById("set-time");

  function updateUI(timerData) {
    const minutes = Math.floor(timerData.timeRemaining / 60);
    const seconds = timerData.timeRemaining % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    if (timerData.isRunning) {
      startBtn.classList.add("hidden");
      stopBtn.classList.remove("hidden");
      resetBtn.classList.remove("hidden");
    } else {
      startBtn.classList.remove("hidden");
      stopBtn.classList.add("hidden");
      resetBtn.classList.add("hidden");
    }
  }

  chrome.runtime.sendMessage({ command: "getTimerData" }, (response) => {
    if (response) updateUI(response);
  });

  startBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "start" });
  });

  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "stop" });
  });

  resetBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ command: "reset" });
  });

  setInterval(() => {
    chrome.runtime.sendMessage({ command: "getTimerData" }, (response) => {
      if (response) updateUI(response);
    });
  }, 1000);

  settingsIcon.addEventListener("click", () => {
    settingsDiv.classList.toggle("hidden");
  });

  setTimeBtn.addEventListener("click", () => {
    const customTime = parseInt(customTimeInput.value, 10);
    if (customTime > 0 && customTime <= 60) {
      chrome.runtime.sendMessage({ command: "setCustomTime", time: customTime * 60 });
      customTimeInput.value = "";
      settingsDiv.classList.add("hidden");
    } else {
      alert("Please enter a time between 1 and 60 minutes.");
    }
  });
});
