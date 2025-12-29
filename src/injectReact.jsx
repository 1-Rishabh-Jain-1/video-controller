import React from "react";
import ReactDOM from "react-dom/client";
import VideoWidget from "./ui/VideoWidget.jsx";

// Wait for DOM to be ready (important for YouTube / SPA sites)
function mountWidgets() {
  const containers = document.querySelectorAll(".video-controller-widget");

  containers.forEach(container => {
    // Avoid rendering twice in same container
    if (container.dataset.rendered === "true") return;
    container.dataset.rendered = "true";

    try {
      const root = ReactDOM.createRoot(container);
      root.render(<VideoWidget />);
      console.log("✅ React widget mounted in container");
    } catch (error) {
      console.error("❌ Failed to mount React widget:", error);
      container.dataset.rendered = "false"; // Allow retry
    }
  });
}

// Initial mount attempt
if (document.body) {
  mountWidgets();
} else {
  // Wait for body if not ready
  const bodyObserver = new MutationObserver(() => {
    if (document.body) {
      mountWidgets();
      bodyObserver.disconnect();
    }
  });
  bodyObserver.observe(document.documentElement, { childList: true });
}

// Re-run if any new widgets appear (YouTube/Netflix dynamic loading)
const obs = new MutationObserver(() => {
  mountWidgets();
});
obs.observe(document.body || document.documentElement, {
  childList: true,
  subtree: true
});

console.log("⚛️ React injection script loaded and ready!");