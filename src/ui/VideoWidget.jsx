import React, { useState, useEffect } from "react";

export default function VideoWidget() {
    const [speed, setSpeed] = useState(1);

    // Helper to get the active/hovered/last-played video
    const getVideo = () => document.querySelector("video");

    const changeSpeed = (delta) => {
        const video = getVideo();
        if (!video) return;
        video.playbackRate = Math.min(Math.max(video.playbackRate + delta, 0.1), 16);
        setSpeed(video.playbackRate);
    };

    const resetSpeed = () => {
        const video = getVideo();
        if (!video) return;
        video.playbackRate = 1.0;
        setSpeed(1);
    };

    const seek = (offset) => {
        const video = getVideo();
        if (!video) return;
        video.currentTime += offset;
    };

    // Keep UI synced with actual video speed
    useEffect(() => {
        const interval = setInterval(() => {
            const video = getVideo();
            if (video && speed !== video.playbackRate) {
                setSpeed(video.playbackRate);
            }
        }, 250);
        return () => clearInterval(interval);
    }, [speed]);

    return (
        <div
            style={{
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "8px",
                borderRadius: "8px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                userSelect: "none",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)"
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <button onClick={(e) => { e.stopPropagation(); seek(-10) }} style={btn}>⏪</button>
            <button onClick={(e) => { e.stopPropagation(); changeSpeed(-0.1) }} style={btn}>-</button>
            <span style={{ minWidth: "45px", textAlign: "center" }}>
                {speed.toFixed(2)}x
            </span>
            <button onClick={(e) => { e.stopPropagation(); resetSpeed() }} style={btn}>⟳</button>
            <button onClick={(e) => { e.stopPropagation(); changeSpeed(0.1) }} style={btn}>+</button>
            <button onClick={(e) => { e.stopPropagation(); seek(10) }} style={btn}>⏩</button>
        </div>
    );
}

// Shared button style
const btn = {
    background: "rgba(255,255,255,0.15)",
    color: "white",
    border: "none",
    padding: "4px 6px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
};