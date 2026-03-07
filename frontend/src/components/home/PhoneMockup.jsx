import { motion } from "motion/react";
import PixelCharacter from "../character/PixelCharacter";
import SpriteCharacter from "../character/emo/SpriteCharacter";
import PixelGirl from "../character/pink_girl_character/PixelCharacter";
import AnimeCharacter from "../character/anime_girl/AnimeCharacter";
import axios from "axios"
import { useEffect } from 'react'
import { useState } from "react";

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
    const [character, setCharacter] = useState({
        stats: {
            health: 20,
            intelligence: 20,
            creativity: 20,
            discipline: 20,
        },
        level: 1,
        xp: 0,
    });

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/character`, {
                    withCredentials: true
                });
                if (response.data?.character) {
                    setCharacter(response.data.character);
                }
            } catch (error) {
                console.error("Failed to fetch character:", error);
            }
        };
        fetchCharacter();
    }, []);

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
                        {/* Level Badge (Top Left) */}
                        <div className="flex items-center justify-center px-3 py-1 rounded-[14px] shadow-sm"
                            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                            <span className="text-[10px] font-bold uppercase mr-1" style={{ color: "var(--color-text-secondary)" }}>Lvl</span>
                            <span className="text-xs font-bold" style={{ color: "var(--color-text-primary)" }}>{character.level || 1}</span>
                        </div>

                        <div className="flex-1 flex justify-center">
                            <span className="text-[10px] font-medium tracking-wide"
                                style={{ color: "var(--color-text-secondary)" }}>
                                {formattedDate()}
                            </span>
                        </div>

                        {/* XP Badge (Top Right) */}
                        <div className="flex items-center justify-center px-3 py-1 rounded-[14px] shadow-sm"
                            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                            <span className="text-xs font-bold mr-1" style={{ color: "var(--color-text-primary)" }}>{character.xp || 0}</span>
                            <span className="text-[10px] font-bold uppercase" style={{ color: "var(--color-text-secondary)" }}>XP</span>
                        </div>
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
                                {/* <AnimeCharacter emotionTrigger={animTrigger} /> */}
                                {/* <SpriteCharacter showTrigger={false} displaySize={180} emotionTrigger={animTrigger} /> */}
                                {/* <PixelGirl emotionTrigger={animTrigger} /> */}
                            </div>
                        </div>
                    </div>



                    {/* stats list */}
                    <div className="flex-1 flex flex-col justify-end px-4 pb-6 pt-2 gap-1.5">
                        <StatBar label="Health" percentage={character.stats?.health || 0} delay={0.05} />
                        <StatBar label="Intelligence" percentage={character.stats?.intelligence || 0} delay={0.15} />
                        <StatBar label="Creativity" percentage={character.stats?.creativity || 0} delay={0.25} />
                        <StatBar label="Discipline" percentage={character.stats?.discipline || 0} delay={0.35} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
