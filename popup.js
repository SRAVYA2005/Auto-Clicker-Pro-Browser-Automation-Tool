let timerInterval;
let clickCount = 0;

// BUTTONS
document.getElementById("select").onclick = send("select");

document.getElementById("start").onclick = () => {
    const interval = parseInt(document.getElementById("interval").value);
    chrome.runtime.sendMessage({ action: "start", interval });
    startTimer();
};

document.getElementById("stop").onclick = () => {
    chrome.runtime.sendMessage({ action: "stop" });
    updateStatus("Stopped");
    resetTimer();
};

document.getElementById("pause").onclick = () => {
    chrome.runtime.sendMessage({ action: "pause" });
    updateStatus("Paused");
};

document.getElementById("resume").onclick = () => {
    chrome.runtime.sendMessage({ action: "resume" });
    updateStatus("Running");
};

// HELPERS
function send(action) {
    return () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action });
            }
        });
    };
}

function updateStatus(text) {
    const el = document.getElementById("status");
    el.innerText = text;
    el.className = "status " + text.toLowerCase();
}

// TIMER
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        chrome.storage.local.get(["startTime", "running", "paused"], (data) => {
            if (data.running) {
                let sec = Math.floor((Date.now() - data.startTime) / 1000);
                document.getElementById("timer").innerText = sec + "s";

                if (data.paused) updateStatus("Paused");
                else updateStatus("Running");
            }
        });
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById("timer").innerText = "0s";
}

// 🔥 CLICK FEEDBACK LISTENER
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "clicked") {

        clickCount++;

        const status = document.getElementById("clickStatus");
        const counter = document.getElementById("clickCount");

        if (!status || !counter) return;

        status.innerText = "✅ Clicked!";
        counter.innerText = clickCount;

        // animation
        status.classList.add("flash");

        setTimeout(() => {
            status.classList.remove("flash");
            status.innerText = "Waiting...";
        }, 500);
    }
});

// LOAD
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["running"], (data) => {
        if (data.running) startTimer();
    });
});