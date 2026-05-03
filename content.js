console.log("✅ content.js loaded");

if (typeof window.autoClickerInjected === "undefined") {

    window.autoClickerInjected = true;

    let clickX = null;
    let clickY = null;

    // 📍 Create visual marker
    function showClickMarker(x, y) {
        const marker = document.createElement("div");

        marker.style.position = "fixed";
        marker.style.left = x + "px";
        marker.style.top = y + "px";
        marker.style.width = "12px";
        marker.style.height = "12px";
        marker.style.background = "red";
        marker.style.borderRadius = "50%";
        marker.style.zIndex = "999999";
        marker.style.pointerEvents = "none";
        marker.style.transform = "translate(-50%, -50%)";
        marker.style.boxShadow = "0 0 10px red";

        document.body.appendChild(marker);

        setTimeout(() => marker.remove(), 300);
    }

    chrome.runtime.onMessage.addListener((msg) => {

        // 📍 SELECT POSITION
        if (msg.action === "select") {
            alert("Click anywhere to set position");

            document.addEventListener("click", (e) => {
                clickX = e.clientX;
                clickY = e.clientY;

                alert(`Saved (${clickX}, ${clickY})`);

                showClickMarker(clickX, clickY);
            }, { once: true });
        }

        // 🖱️ PERFORM CLICK
        if (msg.action === "click") {

            let x = clickX ?? window.innerWidth / 2;
            let y = clickY ?? window.innerHeight / 2;

            const el = document.elementFromPoint(x, y);

            if (el) {
                showClickMarker(x, y);
                el.click();

                chrome.runtime.sendMessage({ action: "clicked-confirm" });

            } else {
                console.warn("⚠️ No element found at:", x, y);
            }
        }
    });

}