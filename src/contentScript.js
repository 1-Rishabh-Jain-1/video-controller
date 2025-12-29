// Track the active video
let currentVideo = null;

// Hover switching
document.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "VIDEO") currentVideo = e.target;
});

// Playing video takes control
function registerVideos() {
    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
        video.addEventListener("play", () => currentVideo = video);
        attachWidgetToVideo(video);
    });
}
registerVideos();

new MutationObserver(registerVideos).observe(document.body, { childList: true, subtree: true });

// Keyboard shortcuts (page level only)
document.addEventListener("keydown", (e) => {
    if (!currentVideo) return;

    if (!isNaN(e.key)) {
        const num = Number(e.key);
        if (num === 0) {
            currentVideo.currentTime = 0;
        } else {
            currentVideo.currentTime = currentVideo.duration * (num / 10);
        }
        console.log(`⏩ Jump: ${num * 10}%`);
        return;
    }

    switch (e.key.toLowerCase()) {
        case "d": // speed up
            currentVideo.playbackRate = Math.min(currentVideo.playbackRate + 0.1, 16);
            console.log("--------------------currentVideo.playbackRate" + currentVideo.playbackRate + "--------------------");
            break;

        case "s": // speed down
            currentVideo.playbackRate = Math.max(currentVideo.playbackRate - 0.1, 0.1);
            console.log("--------------------currentVideo.playbackRate" + currentVideo.playbackRate + "--------------------");
            break;

        case "r":
            currentVideo.playbackRate = 1.0;
            console.log("--------------------currentVideo.playbackRate" + currentVideo.playbackRate + "--------------------");
            break;

        case "x": // seek forward
            currentVideo.currentTime += 10;
            break;

        case "z": // seek backward
            currentVideo.currentTime -= 10;
            break;

        case "v": // toggle React widget visibility
            toggleWidgets();
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
    // Avoid duplicates on same video
    if (video.parentElement.querySelector(".video-controller-widget")) return;

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

    // Trigger React injection (it will find this container via MutationObserver)
    console.log("📦 Widget container created, waiting for React injection...");
}

function toggleWidgets() {
    document.querySelectorAll(".video-controller-widget").forEach(widget => {
        widget.style.display = widget.style.display === "none" ? "block" : "none";
    });
}

console.log("🎬 Video Controller Loaded");