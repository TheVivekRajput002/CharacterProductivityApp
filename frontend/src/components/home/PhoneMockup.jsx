import { motion } from "motion/react";
import PixelCharacter from "../character/PixelCharacter";
import SpriteCharacter from "../character/emo/SpriteCharacter";
import PixelGirl from "../character/pink_girl_character/PixelCharacter";

/* ── helpers ──────────────────────────────────────── */
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formattedDate() {
    const d = new Date();
    return `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`;
}



/* ── palm-tree top-bar icon ──────────────────────── */
const PalmIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        strokeWidth={1.4} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 21v-8m0 0c-2.5-1-5-3.5-5-7 2.5 0 4.5 1.5 5 4m0 3c2.5-1 5-3.5 5-7-2.5 0-4.5 1.5-5 4m0-4c-1-3-1-5.5 0-7 1.5 1 2.5 3.5 2 6m-2-6c-1.5 1-2.5 3.5-2 6" />
    </svg>
);

/* ── avatar badge ────────────────────────────────── */
const AvatarBadge = () => (
    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/60 shadow-sm"
        style={{
            background:
                "conic-gradient(from 0deg, #e879a8, #f59e42, #facc15, #4ade80, #38bdf8, #a78bfa, #e879a8)",
        }}
    >
        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/90 backdrop-blur-sm bg-white/10">
            U
        </div>
    </div>
);

/* ── stat bar ────────────────────────────────────── */
function StatBar({ label, percentage, delay = 0 }) {
    return (
        <div
            className="flex flex-col w-full rounded-xl py-2 px-3"
            style={{
                backgroundColor: "var(--color-surface)",
                boxShadow: "0 1px 3px var(--color-shadow-sm)",
                border: "1px solid var(--color-border)",
            }}
        >
            <span className="text-[10px] font-medium mb-3 tracking-wide" 
                  style={{ color: "var(--color-text-secondary)" }}>
                {label}
            </span>

            <div className="relative mb-0.5">
                {/* Tooltip */}
                <motion.div
                    initial={{ left: 0, opacity: 0 }}
                    animate={{ left: `${percentage}%`, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: delay + 0.1 }}
                    className="absolute -top-[18px] -translate-x-1/2 flex flex-col items-center drop-shadow-sm z-10"
                >
                    <div className="px-1 py-[2px] rounded-[3px] text-[8px] font-bold leading-none"
                         style={{ backgroundColor: "var(--color-text-primary)", color: "var(--color-bg)" }}>
                        {percentage}%
                    </div>
                    <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-l-transparent border-r-transparent" 
                         style={{ borderTopColor: "var(--color-text-primary)" }} />
                </motion.div>

                {/* Track */}
                <div className="h-[4px] w-full rounded-full relative" style={{ backgroundColor: "var(--color-lightgray)" }}>
                    {/* Fill */}
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: delay }}
                        className="h-full rounded-full absolute left-0 top-0"
                        style={{ backgroundColor: "var(--color-text-primary)" }}
                    />
                </div>
            </div>
        </div>
    );
}

/* ── main component ──────────────────────────────── */
export default function PhoneMockup({ userName = "Chester", animTrigger }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-full select-none"
        >
            {/* ── phone shell ────────────────────────── */}
            <div
                className="relative rounded-[40px] overflow-hidden h-full"
                style={{
                    aspectRatio: "9 / 19.5",
                    width: "auto",
                    backgroundColor: "var(--color-surface)",
                    boxShadow:
                        "0 20px 60px var(--color-shadow), inset 0 0 0 1px var(--color-border), inset 0 1px 0 rgba(255,255,255,0.08)",
                    border: "6px solid var(--color-lightgray)",
                }}
            >
                {/* notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full z-20"
                    style={{ backgroundColor: "var(--color-lightgray)" }}
                />

                {/* ── screen content ───────────────────── */}
                <div className="relative w-full h-full flex flex-col overflow-hidden"
                    style={{ backgroundColor: "var(--color-bg)" }}>

                    {/* top bar */}
                    <div className="relative z-10 flex items-center justify-between px-5 pt-8 pb-2">
                        <PalmIcon />
                        <span className="text-xs font-medium tracking-wide"
                            style={{ color: "var(--color-text-secondary)" }}>
                            {formattedDate()}
                        </span>
                        <AvatarBadge />
                    </div>

                    {/* hero image */}
                    <div className="relative w-full flex-shrink-0" style={{ height: "42%" }}>
                        <img
                            src="/hero_beach.png"
                            alt="Dreamy coastal scene"
                            className="w-full h-full object-cover"
                        />
                        {/* fade overlay */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-1/2"
                            style={{
                                background: "linear-gradient(to top, var(--color-bg), transparent)",
                            }}
                        />

                        {/* pixel character floating over hero */}
                        <div className="absolute inset-0 flex items-end justify-center z-10"
                            style={{ pointerEvents: "none", paddingBottom: "8px" }}>
                            <div style={{ pointerEvents: "auto", transform: "scale(1)" }}>
                                <PixelCharacter showControls={false} emotionTrigger={animTrigger} />
                                {/* <SpriteCharacter showTrigger={false} displaySize={180} emotionTrigger={animTrigger} /> */}
                                {/* <PixelGirl emotionTrigger={animTrigger} /> */}
                            </div>
                        </div>
                    </div>

                

                    {/* stats list */}
                    <div className="flex-1 flex flex-col justify-end px-4 pb-6 pt-2 gap-1.5">
                        <StatBar label="Health" percentage={80} delay={0.05} />
                        <StatBar label="Intelligence" percentage={65} delay={0.15} />
                        <StatBar label="Creativity" percentage={90} delay={0.25} />
                        <StatBar label="Discipline" percentage={50} delay={0.35} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
