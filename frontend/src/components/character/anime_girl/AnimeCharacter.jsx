import { useState, useEffect } from "react";
import spriteUrl from "./spritesheet.png";

const SPRITE_COLS = 5;
const SPRITE_ROWS = 2;
const TOTAL_FRAMES = 8;

function getFrameStyle(frameIndex) {
  const col = frameIndex % SPRITE_COLS;
  const row = Math.floor(frameIndex / SPRITE_COLS);
  return {
    // In CSS, percentage background-position works differently. 
    // To correctly set frames with percentages, we use (index / (total - 1)) * 100
    backgroundPosition: `${SPRITE_COLS > 1 ? (col / (SPRITE_COLS - 1)) * 100 : 0}% ${SPRITE_ROWS > 1 ? (row / (SPRITE_ROWS - 1)) * 100 : 0}%`,
    backgroundSize: `${SPRITE_COLS * 100}% ${SPRITE_ROWS * 100}%`,
  };
}

export default function AnimeCharacter({ emotionTrigger }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!emotionTrigger) return;
    
    // reset to start when triggered
    setFrame(0);
    let currentFrame = 0;
    
    const interval = setInterval(() => {
      currentFrame++;
      if (currentFrame >= TOTAL_FRAMES) {
        clearInterval(interval);
        setFrame(0); // return to idle frame
      } else {
        setFrame(currentFrame);
      }
    }, 150); 
    
    return () => clearInterval(interval);
  }, [emotionTrigger]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto",
    }}>
      <div style={{
        width: 250, // Adjusted size to fit well in the mockup
        height: 180,
        backgroundImage: `url(${spriteUrl})`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        ...getFrameStyle(frame),
      }} />
    </div>
  );
}