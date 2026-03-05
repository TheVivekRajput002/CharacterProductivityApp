import { useState, useEffect, useRef } from "react";

/**
 * PixelCharacter
 * ──────────────
 * Static body, emotion-driven face animations + idle bounce.
 * Emotions: "idle" | "happy" | "sad" | "angry" | "surprised" | "love"
 */

const PX = 4; // px per grid cell → 16×20 grid = 64×80px
const W  = 16;
const H  = 20;

/* ── palette ── */
const C = {
  outline : "#1c1c1c",
  skin    : "#fde8c8",
  skinSh  : "#f0c090",
  white   : "#ffffff",
  blush   : "#f9a8d4",
  blushD  : "#f472b6",
  tear    : "#60a5fa",
  lipRed  : "#e11d48",
  angry   : "#fca5a5",
  angryD  : "#ef4444",
  loveR   : "#f43f5e",
  loveP   : "#fb7185",
  pupil   : "#1c1c1c",
  iris    : "#6366f1",
};

function Px({ x, y, w = 1, h = 1, fill, opacity }) {
  return (
    <rect
      x={x * PX} y={y * PX}
      width={w * PX} height={h * PX}
      fill={fill}
      opacity={opacity}
    />
  );
}

/* ─────────────── FACE EXPRESSIONS ─────────────── */
function Face({ emotion, tick }) {
  // tick drives per-emotion animation frames
  const blink = tick % 120 > 115; // blink every ~2s

  switch (emotion) {

    /* ── HAPPY ── bouncy big smile, squint eyes, cheeks */
    case "happy":
      return (
        <g>
          {/* cheeks */}
          <Px x={3} y={5} w={2} h={1} fill={C.blush} opacity={0.85}/>
          <Px x={11} y={5} w={2} h={1} fill={C.blush} opacity={0.85}/>
          {/* squint eyes (arc-ish) */}
          <Px x={4} y={4} w={3} h={1} fill={C.outline}/>
          <Px x={9} y={4} w={3} h={1} fill={C.outline}/>
          <Px x={4} y={3} w={3} h={1} fill={C.outline} opacity={0.25}/>
          <Px x={9} y={3} w={3} h={1} fill={C.outline} opacity={0.25}/>
          {/* big smile */}
          <Px x={4} y={7} w={1} h={1} fill={C.outline}/>
          <Px x={5} y={8} w={6} h={1} fill={C.outline}/>
          <Px x={11} y={7} w={1} h={1} fill={C.outline}/>
          {/* mouth fill */}
          <Px x={5} y={7} w={6} h={1} fill={C.lipRed} opacity={0.7}/>
          {/* sparkles */}
          {tick % 30 < 15 && <>
            <Px x={1} y={1} w={1} h={1} fill="#fbbf24"/>
            <Px x={14} y={2} w={1} h={1} fill="#fbbf24"/>
            <Px x={2} y={3} w={1} h={1} fill="#fbbf24" opacity={0.5}/>
          </>}
        </g>
      );

    /* ── SAD ── droopy eyes, tears falling */
    case "sad": {
      const tearY = (tick % 20) / 2; // tears animate downward
      return (
        <g>
          {/* droopy brows */}
          <Px x={4} y={3} w={3} h={1} fill={C.outline} opacity={0.5}/>
          <Px x={9} y={3} w={3} h={1} fill={C.outline} opacity={0.5}/>
          <Px x={3} y={2} w={1} h={1} fill={C.outline} opacity={0.35}/>
          <Px x={12} y={2} w={1} h={1} fill={C.outline} opacity={0.35}/>
          {/* sad eyes */}
          <Px x={4} y={4} w={3} h={3} fill={C.outline}/>
          <Px x={9} y={4} w={3} h={3} fill={C.outline}/>
          <Px x={5} y={5} w={1} h={1} fill={C.white}/>
          <Px x={10} y={5} w={1} h={1} fill={C.white}/>
          {/* tears */}
          <rect
            x={5 * PX} y={(7 + tearY) * PX}
            width={PX} height={PX * 1.5}
            fill={C.tear} opacity={0.9} rx={PX * 0.4}
          />
          <rect
            x={10 * PX} y={(7 + tearY * 0.7) * PX}
            width={PX} height={PX * 1.5}
            fill={C.tear} opacity={0.9} rx={PX * 0.4}
          />
          {/* frown */}
          <Px x={4} y={9} w={1} h={1} fill={C.outline}/>
          <Px x={5} y={8} w={6} h={1} fill={C.outline}/>
          <Px x={11} y={9} w={1} h={1} fill={C.outline}/>
        </g>
      );
    }

    /* ── ANGRY ── red flush, angry brows, gritted teeth */
    case "angry": {
      const shake = tick % 6 < 3 ? 0 : 1; // subtle face shake
      return (
        <g transform={`translate(${shake * PX * 0.3}, 0)`}>
          {/* red flush */}
          <Px x={3} y={2} w={10} h={7} fill={C.angry} opacity={0.35}/>
          {/* angry brows — slanted */}
          <Px x={4} y={3} w={1} h={1} fill={C.outline}/>
          <Px x={5} y={2} w={2} h={1} fill={C.outline}/>
          <Px x={11} y={3} w={1} h={1} fill={C.outline}/>
          <Px x={9} y={2} w={2} h={1} fill={C.outline}/>
          {/* angry eyes */}
          <Px x={4} y={4} w={3} h={2} fill={C.outline}/>
          <Px x={9} y={4} w={3} h={2} fill={C.outline}/>
          <Px x={5} y={4} w={1} h={1} fill={C.angryD} opacity={0.6}/>
          <Px x={10} y={4} w={1} h={1} fill={C.angryD} opacity={0.6}/>
          {/* gritted teeth / grimace */}
          <Px x={4} y={7} w={8} h={2} fill={C.outline}/>
          <Px x={5} y={8} w={2} h={1} fill={C.white}/>
          <Px x={8} y={8} w={2} h={1} fill={C.white}/>
          {/* lines on forehead */}
          <Px x={7} y={1} w={1} h={1} fill={C.angryD} opacity={0.5}/>
          <Px x={9} y={1} w={1} h={1} fill={C.angryD} opacity={0.5}/>
        </g>
      );
    }

    /* ── SURPRISED ── huge eyes, open mouth */
    case "surprised": {
      const pulse = tick % 20 < 10 ? 0 : 0.15;
      return (
        <g>
          {/* raised brows */}
          <Px x={4} y={2} w={3} h={1} fill={C.outline}/>
          <Px x={9} y={2} w={3} h={1} fill={C.outline}/>
          {/* big eyes */}
          <Px x={3} y={3} w={4} h={4} fill={C.outline}/>
          <Px x={9} y={3} w={4} h={4} fill={C.outline}/>
          {/* iris */}
          <Px x={4} y={4} w={2} h={2} fill={C.iris}/>
          <Px x={10} y={4} w={2} h={2} fill={C.iris}/>
          {/* pupil */}
          <Px x={4} y={4} w={1} h={1} fill={C.pupil}/>
          <Px x={10} y={4} w={1} h={1} fill={C.pupil}/>
          {/* shine */}
          <Px x={5} y={4} w={1} h={1} fill={C.white} opacity={0.8}/>
          <Px x={11} y={4} w={1} h={1} fill={C.white} opacity={0.8}/>
          {/* open mouth — O shape */}
          <Px x={5} y={7} w={6} h={3} fill={C.outline}/>
          <Px x={6} y={8} w={4} h={1} fill={C.lipRed} opacity={0.9}/>
          {/* sweat */}
          <Px x={13} y={3} w={1} h={2} fill={C.tear} opacity={0.7 + pulse}/>
        </g>
      );
    }

    /* ── LOVE ── heart eyes, big smile */
    case "love": {
      const heartBeat = tick % 20 < 10;
      return (
        <g>
          {/* cheeks */}
          <Px x={3} y={5} w={2} h={1} fill={C.blushD} opacity={0.7}/>
          <Px x={11} y={5} w={2} h={1} fill={C.blushD} opacity={0.7}/>
          {/* heart eyes */}
          {/* left heart */}
          <Px x={4} y={4} w={1} h={1} fill={C.loveR}/>
          <Px x={6} y={4} w={1} h={1} fill={C.loveR}/>
          <Px x={3} y={5} w={1} h={1} fill={C.loveR} opacity={0.4}/>
          <Px x={4} y={3} w={3} h={2} fill={C.loveR}/>
          <Px x={3} y={4} w={1} h={2} fill={C.loveR}/>
          <Px x={6} y={4} w={1} h={2} fill={C.loveR}/>
          <Px x={4} y={6} w={1} h={1} fill={C.loveR}/>
          <Px x={6} y={6} w={1} h={1} fill={C.loveR}/>
          <Px x={5} y={7} w={1} h={1} fill={C.loveR}/>
          {/* right heart */}
          <Px x={9} y={4} w={1} h={1} fill={C.loveR}/>
          <Px x={11} y={4} w={1} h={1} fill={C.loveR}/>
          <Px x={9} y={3} w={3} h={2} fill={C.loveR}/>
          <Px x={8} y={4} w={1} h={2} fill={C.loveR}/>
          <Px x={11} y={4} w={1} h={2} fill={C.loveR}/>
          <Px x={9} y={6} w={1} h={1} fill={C.loveR}/>
          <Px x={11} y={6} w={1} h={1} fill={C.loveR}/>
          <Px x={10} y={7} w={1} h={1} fill={C.loveR}/>
          {/* floating hearts */}
          {heartBeat && <>
            <Px x={1} y={1} w={1} h={1} fill={C.loveP} opacity={0.8}/>
            <Px x={14} y={0} w={1} h={1} fill={C.loveP} opacity={0.6}/>
          </>}
          {/* smile */}
          <Px x={4} y={9} w={1} h={1} fill={C.outline}/>
          <Px x={5} y={10} w={6} h={1} fill={C.outline}/>
          <Px x={11} y={9} w={1} h={1} fill={C.outline}/>
        </g>
      );
    }

    /* ── IDLE (neutral) ── */
    default:
      return (
        <g>
          {blink ? (
            /* blink */
            <>
              <Px x={4} y={5} w={3} h={1} fill={C.outline}/>
              <Px x={9} y={5} w={3} h={1} fill={C.outline}/>
            </>
          ) : (
            <>
              <Px x={4} y={4} w={3} h={3} fill={C.outline}/>
              <Px x={9} y={4} w={3} h={3} fill={C.outline}/>
              <Px x={5} y={5} w={1} h={1} fill={C.white}/>
              <Px x={10} y={5} w={1} h={1} fill={C.white}/>
            </>
          )}
          {/* calm straight mouth */}
          <Px x={5} y={8} w={6} h={1} fill={C.outline}/>
        </g>
      );
  }
}

/* ─────────────── STATIC BODY ─────────────── */
function Body() {
  return (
    <>
      {/* shadow under feet */}
      <ellipse cx={W*PX/2} cy={H*PX-1} rx={W*PX*0.28} ry={PX*0.5} fill="rgba(0,0,0,0.12)"/>
      {/* legs */}
      <Px x={3} y={15} w={4} h={4} fill={C.outline}/>
      <Px x={9} y={15} w={4} h={4} fill={C.outline}/>
      <Px x={4} y={16} w={2} h={2} fill={C.skinSh}/>
      <Px x={10} y={16} w={2} h={2} fill={C.skinSh}/>
      {/* feet */}
      <Px x={3} y={18} w={4} h={1} fill={C.outline}/>
      <Px x={9} y={18} w={4} h={1} fill={C.outline}/>
      {/* body */}
      <Px x={2} y={11} w={12} h={5} fill={C.outline}/>
      <Px x={3} y={12} w={10} h={3} fill={C.skin}/>
      <Px x={11} y={12} w={2} h={3} fill={C.skinSh}/>
      {/* neck */}
      <Px x={6} y={9} w={4} h={2} fill={C.outline}/>
      <Px x={7} y={9} w={2} h={2} fill={C.skin}/>
      {/* arms */}
      <Px x={0} y={11} w={3} h={4} fill={C.outline}/>
      <Px x={1} y={12} w={1} h={2} fill={C.skin}/>
      <Px x={13} y={11} w={3} h={4} fill={C.outline}/>
      <Px x={14} y={12} w={1} h={2} fill={C.skin}/>
      {/* head */}
      <Px x={2} y={1} w={12} h={9} fill={C.outline}/>
      <Px x={3} y={2} w={10} h={7} fill={C.skin}/>
      <Px x={11} y={2} w={2} h={7} fill={C.skinSh}/>
      {/* ear */}
      <Px x={1} y={3} w={2} h={4} fill={C.outline}/>
      <Px x={13} y={3} w={2} h={4} fill={C.outline}/>
      <Px x={1} y={4} w={1} h={2} fill={C.skinSh}/>
      <Px x={14} y={4} w={1} h={2} fill={C.skinSh}/>
      {/* head top highlight */}
      <Px x={4} y={2} w={4} h={1} fill="rgba(255,255,255,0.4)"/>
    </>
  );
}

/* ─────────────── FULL CHARACTER ─────────────── */
function CharacterSVG({ emotion, tick, bounceY }) {
  return (
    <svg
      width={W * PX}
      height={H * PX}
      viewBox={`0 0 ${W * PX} ${H * PX}`}
      style={{ imageRendering: "pixelated", display: "block", overflow: "visible" }}
    >
      <g transform={`translate(0, ${bounceY})`}>
        <Body/>
        <Face emotion={emotion} tick={tick}/>
      </g>
    </svg>
  );
}

/* ─────────────── EMOTION BUTTONS ─────────────── */
const EMOTIONS = [
  { key: "idle",      label: "😐", color: "#94a3b8" },
  { key: "happy",     label: "😄", color: "#fbbf24" },
  { key: "sad",       label: "😢", color: "#60a5fa" },
  { key: "angry",     label: "😠", color: "#f87171" },
  { key: "surprised", label: "😮", color: "#a78bfa" },
  { key: "love",      label: "🥰", color: "#f472b6" },
];

/* ─────────────── EXPORTED COMPONENT ─────────────── */
export default function PixelCharacter({
  emotion: externalEmotion,
  showControls = true,
}) {
  const [emotion, setEmotion] = useState(externalEmotion || "idle");
  const [tick, setTick]       = useState(0);
  const [bounceY, setBounceY] = useState(0);
  const rafRef                = useRef(null);
  const tickRef               = useRef(0);

  // sync external emotion prop
  useEffect(() => {
    if (externalEmotion) setEmotion(externalEmotion);
  }, [externalEmotion]);

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      frame++;
      tickRef.current = frame;
      setTick(frame);

      // BOUNCE: sine wave, ~1.5 bounces/sec at 60fps
      const raw = Math.sin((frame / 60) * Math.PI * 3);
      // only go UP (negative y = up), stay grounded at 0
      const up  = raw > 0 ? raw : 0;
      setBounceY(-Math.round(up * PX * 2));   // max 8px up

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

      {/* ── character ── */}
      <div style={{
        width: W * PX,
        height: H * PX,
        filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.18))",
      }}>
        <CharacterSVG emotion={emotion} tick={tick} bounceY={bounceY}/>
      </div>

      {/* ── emotion label ── */}
      <div style={{
        fontSize: 10,
        fontFamily: "monospace",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity: 0.5,
        userSelect: "none",
      }}>
        {emotion}
      </div>

      {/* ── buttons ── */}
      {showControls && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 200 }}>
          {EMOTIONS.map(e => (
            <button
              key={e.key}
              onClick={() => setEmotion(e.key)}
              style={{
                fontSize: 18,
                padding: "5px 8px",
                borderRadius: 10,
                border: "2px solid",
                borderColor: emotion === e.key ? e.color : "transparent",
                background: emotion === e.key ? e.color + "22" : "rgba(0,0,0,0.04)",
                cursor: "pointer",
                transform: emotion === e.key ? "scale(1.2)" : "scale(1)",
                transition: "all 0.15s ease",
                outline: "none",
              }}
              title={e.key}
            >
              {e.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}