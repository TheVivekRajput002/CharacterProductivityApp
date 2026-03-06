import { useState, useEffect, useRef, useCallback } from "react";
import "./happy/spritesheet.css";
import "./angry/spritesheet.css";

/**
 * SpriteCharacter
 * ───────────────
 * Renders a character using emotion-based spritesheets.
 * Two small emoji buttons trigger happy / angry animations.
 * Uses requestAnimationFrame for smooth, consistent frame timing.
 */

const EMOTIONS = {
    happy: { frames: 14, size: 800, label: "😄", color: "#fbbf24" },
    angry: { frames: 8, size: 480, label: "😠", color: "#f87171" },
};

export default function SpriteCharacter({
    fps = 8,
    displaySize = 80,
    showTrigger = true,
    emotionTrigger = null,
}) {
    const [emotion, setEmotion] = useState("happy");
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(0);
    const frameRef = useRef(0);

    const emo = EMOTIONS[emotion] || EMOTIONS.happy;
    const interval = 1000 / fps;

    const play = useCallback(
        (emoKey) => {
            // stop any running animation
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            const e = EMOTIONS[emoKey] || EMOTIONS.happy;
            setEmotion(emoKey);
            frameRef.current = 0;
            setCurrentFrame(0);
            setIsPlaying(true);
            lastTimeRef.current = 0;

            const step = (timestamp) => {
                if (!lastTimeRef.current) lastTimeRef.current = timestamp;
                const elapsed = timestamp - lastTimeRef.current;

                if (elapsed >= interval) {
                    lastTimeRef.current = timestamp - (elapsed % interval);
                    frameRef.current += 1;

                    if (frameRef.current >= e.frames) {
                        setIsPlaying(false);
                        frameRef.current = 0;
                        setCurrentFrame(0);
                        return; // stop
                    }
                    setCurrentFrame(frameRef.current);
                }
                rafRef.current = requestAnimationFrame(step);
            };

            rafRef.current = requestAnimationFrame(step);
        },
        [interval]
    );

    // cleanup on unmount
    useEffect(() => () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    // watch for external emotion triggers
    useEffect(() => {
        if (emotionTrigger && emotionTrigger.t) {
            play(emotionTrigger.emotion);
        }
    }, [emotionTrigger, play]);

    const scale = displaySize / emo.size;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
            }}
        >
            {/* ── character sprite ── */}
            <div
                style={{
                    width: displaySize,
                    height: displaySize,
                    overflow: "hidden",
                    filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.18))",
                }}
            >
                <div
                    className={`sprite-${emotion} frame-${currentFrame}`}
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                    }}
                />
            </div>

            {/* ── two small emotion trigger buttons ── */}
            {showTrigger && (
                <div style={{ display: "flex", gap: 6 }}>
                    {Object.entries(EMOTIONS).map(([key, val]) => (
                        <button
                            key={key}
                            onClick={() => play(key)}
                            disabled={isPlaying}
                            title={key}
                            style={{
                                fontSize: 14,
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                border: "2px solid",
                                borderColor: emotion === key && !isPlaying ? val.color : "transparent",
                                background:
                                    emotion === key
                                        ? val.color + "22"
                                        : "rgba(0,0,0,0.05)",
                                cursor: isPlaying ? "default" : "pointer",
                                transition: "all 0.15s ease",
                                opacity: isPlaying ? 0.5 : 1,
                                outline: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: 0,
                            }}
                        >
                            {val.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
