// Track the active video
let currentVideo = null;
let currentWidget = null;
let widgetVisible = true;

// Use event delegation - listen for 'play' events on document level
// This catches all videos (existing, dynamically added, in iframes) without constant DOM queries
document.addEventListener("play", handleVideoPlay, true); // Use capture phase

// Handle when a video starts playing
function handleVideoPlay(event) {
    const video = event.target;

    // Only handle video elements
    if (video.tagName !== "VIDEO") return;

    currentVideo = video;

    // Remove widget from previous video
    if (currentWidget && currentWidget.parentElement) {
        currentWidget.remove();
        currentWidget = null;
    }

    // Attach widget to currently playing video
    attachWidgetToVideo(video);
}

function applyWidgetVisibility() {
    if (!currentWidget) return;
    currentWidget.style.display = widgetVisible ? "block" : "none";
}

chrome.storage.sync.get(["widgetVisible"], (result) => {
    if (typeof result.widgetVisible === "boolean") {
        widgetVisible = result.widgetVisible;
        applyWidgetVisibility();
    }
});

// Keyboard shortcuts (page level only)
document.addEventListener("keydown", (e) => {
    if (!currentVideo) return;

    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
        return;
    }

    if (e.key >= "0" && e.key <= "9") {
        const num = e.key.charCodeAt(0) - 48;
        if (num === 0) {
            currentVideo.currentTime = 0;
        } else {
            currentVideo.currentTime = currentVideo.duration * (num / 10);
        }

        return;
    }

    switch (e.key.toLowerCase()) {
        case "d": // speed up
            currentVideo.playbackRate = Math.min(currentVideo.playbackRate + 0.1, 16);
            break;

        case "s": // speed down
            currentVideo.playbackRate = Math.max(currentVideo.playbackRate - 0.1, 0.1);
            break;

        case "r":
            currentVideo.playbackRate = 1.0;
            break;

        case "x": // seek forward
            currentVideo.currentTime += 10;
            break;

        case "z": // seek backward
            currentVideo.currentTime -= 10;
            break;

        case "v": // toggle React widget visibility
            widgetVisible = !widgetVisible;
            chrome.storage.sync.set({ widgetVisible });
            applyWidgetVisibility();
            break;
    }
});

// Load React injection script once
let reactScriptLoaded = false;

function loadReactScript() {
    if (reactScriptLoaded) return;
    reactScriptLoaded = true;

    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("injectReact.js");
    script.onload = () => {
        console.log("✅ React injection script loaded");
    };
    script.onerror = () => {
        console.error("❌ Failed to load React injection script");
        reactScriptLoaded = false;
    };
    document.head.appendChild(script);
}

// Load React script when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadReactScript);
} else {
    loadReactScript();
}

function attachWidgetToVideo(video) {
    // Remove any existing widget on this video
    const existingWidget = video.parentElement?.querySelector(".video-controller-widget");
    if (existingWidget) {
        existingWidget.remove();
    }

    // Ensure video container can hold absolute children
    const parent = video.parentElement;
    if (!parent) return;

    parent.style.position = "relative";

    // Create container
    const container = document.createElement("div");
    container.className = "video-controller-widget";
    container.style.position = "absolute";
    container.style.top = "10px";
    container.style.left = "10px";
    container.style.zIndex = "999999";
    container.style.minWidth = "140px";
    container.style.minHeight = "40px";
    container.style.pointerEvents = "auto";

    parent.appendChild(container);
    currentWidget = container;

    applyWidgetVisibility();

    console.log("📦 Widget container created for playing video");
}

function toggleWidgets() {
    if (currentWidget) {
        currentWidget.style.display = currentWidget.style.display === "none" ? "block" : "none";
    }
}

console.log("🎬 Video Controller Loaded");