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

        case "x": // seek forward
            currentVideo.currentTime += 10;
            break;

        case "z": // seek backward
            currentVideo.currentTime -= 10;
            break;

        case "v": // toggle React widget visibility (coming soon)
            const widget = document.getElementById("video-controller-widget");
            if (widget) widget.style.display = widget.style.display === "none" ? "block" : "none";
            break;
    }
});