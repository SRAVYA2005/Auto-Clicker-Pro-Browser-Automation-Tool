console.log("🔥 Background script loaded");

let intervalId = null;
let clickInterval = 5000;
let paused = false;

// 🔁 SAFE CLICK FUNCTION
function safeClick(tab) {
    if (!tab || !tab.id) {
        console.log("⚠️ No valid tab");
        return;
    }

    const url = tab.url || "";
    console.log("🌐 Active Tab URL:", url);

    if (
    !url ||
    url.startsWith("chrome://") ||
    url.startsWith("edge://") ||
    url.startsWith("about:") ||
    url.startsWith("chrome-extension://")
) {
    console.warn("❌ Skipping unsupported page:", url);
    return;
}

    // Try sending message
    chrome.tabs.sendMessage(tab.id, { action: "click" }, () => {

        // ❌ If content script missing → inject
        if (chrome.runtime.lastError) {
            console.warn("⚠️ Content script not found. Injecting...");

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            }, () => {

                if (chrome.runtime.lastError) {
                    console.error("❌ Injection failed:", chrome.runtime.lastError.message);
                    return;
                }

                console.log("✅ Script injected. Retrying click...");

                chrome.tabs.sendMessage(tab.id, { action: "click" });

                // ✅ notify popup AFTER retry
                chrome.runtime.sendMessage({ action: "clicked" });
            });

        } else {
            console.log("✅ Click message sent");

            // ✅ notify popup
            chrome.runtime.sendMessage({ action: "clicked" });
        }
    });
}

// ▶️ START CLICKING
function startClicking() {
    if (intervalId) clearInterval(intervalId);

    console.log("🚀 Starting auto clicker...");

    intervalId = setInterval(() => {
        if (paused) {
            console.log("⏸️ Paused...");
            return;
        }

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                safeClick(tabs[0]);
            } else {
                console.log("⚠️ No active tab found");
            }
        });

    }, clickInterval);
}

// 📩 MESSAGE HANDLER
chrome.runtime.onMessage.addListener((msg) => {
    console.log("📩 Message received:", msg);

    if (msg.action === "start") {
        clickInterval = msg.interval || 5000;
        paused = false;

        chrome.storage.local.set({
            running: true,
            paused: false,
            startTime: Date.now()
        });

        startClicking();
    }

    if (msg.action === "stop") {
        console.log("🛑 Stopping...");
        chrome.storage.local.set({ running: false, paused: false });

        if (intervalId) clearInterval(intervalId);
    }

    if (msg.action === "pause") {
        console.log("⏸️ Paused");
        paused = true;
        chrome.storage.local.set({ paused: true });
    }

    if (msg.action === "resume") {
        console.log("▶️ Resumed");
        paused = false;
        chrome.storage.local.set({ paused: false });
    }
});

// ⌨️ KEYBOARD SHORTCUTS
chrome.commands.onCommand.addListener((command) => {
    console.log("⌨️ Command triggered:", command);

    if (command === "start-clicking") {
        chrome.runtime.sendMessage({ action: "start" });
    }

    if (command === "stop-clicking") {
        chrome.runtime.sendMessage({ action: "stop" });
    }

    if (command === "pause-clicking") {
        chrome.runtime.sendMessage({ action: "pause" });
    }

    if (command === "resume-clicking") {
        chrome.runtime.sendMessage({ action: "resume" });
    }
});