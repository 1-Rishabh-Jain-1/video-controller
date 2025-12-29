// Track the active video
let currentVideo = null;

function findVideo() {
    const videos = document.querySelectorAll("video");
    if (videos.length > 0) currentVideo = videos[0];
}
findVideo();

// Detect newly added videos too (YouTube loads dynamically)
const observer = new MutationObserver(findVideo);
observer.observe(document.body, { subtree: true, childList: true });

// Keyboard shortcuts (page level only)
document.addEventListener("keydown", (e) => {
    if (!currentVideo) return;

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