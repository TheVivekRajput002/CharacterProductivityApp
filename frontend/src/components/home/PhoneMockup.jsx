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

/* ── icon SVGs (outlined, minimal) ───────────────── */
const icons = {
    Automations: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.4} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87a6.47 6.47 0 0 1 .636.367c.31.21.678.3 1.05.218l1.267-.306c.527-.128 1.076.106 1.35.58l1.296 2.244a1.135 1.135 0 0 1-.24 1.52l-1.053.975a1.14 1.14 0 0 0-.378.856v.735c0 .32.13.627.378.856l1.053.975c.408.378.523.977.24 1.52l-1.296 2.244c-.274.474-.823.708-1.35.58l-1.267-.306a1.14 1.14 0 0 0-1.05.218 6.47 6.47 0 0 1-.636.367c-.333.184-.583.496-.646.87l-.213 1.281c-.09.543-.56.941-1.11.941h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281a1.14 1.14 0 0 0-.646-.87 6.47 6.47 0 0 1-.636-.367 1.14 1.14 0 0 0-1.05-.218l-1.267.306c-.527.128-1.076-.106-1.35-.58L2.89 16.364a1.135 1.135 0 0 1 .24-1.52l1.053-.975c.248-.229.378-.536.378-.856v-.735a1.14 1.14 0 0 0-.378-.856l-1.053-.975a1.136 1.136 0 0 1-.24-1.52l1.296-2.244c.274-.474.823-.708 1.35-.58l1.267.306c.372.082.74-.008 1.05-.218.2-.13.412-.249.636-.367.333-.184.583-.496.646-.87l.213-1.281Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    ),
    Mail: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.4} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
    ),
    Orders: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.4} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
    ),
    Gallery: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.4} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm12.75-11.25h.008v.008h-.008V6.75Z" />
        </svg>
    ),
    "Text Poke": (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.4} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
    ),
};

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

/* ── grid card ───────────────────────────────────── */
function GridCard({ label, icon }) {
    return (
        <div
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 px-2 cursor-pointer
        transition-shadow duration-200 hover:shadow-md"
            style={{
                backgroundColor: "var(--color-surface)",
                boxShadow: "0 1px 4px var(--color-shadow-sm)",
                border: "1px solid var(--color-border)",
            }}
        >
            <span style={{ color: "var(--color-text-secondary)" }}>{icon}</span>
            <span
                className="text-[11px] font-medium leading-tight"
                style={{ color: "var(--color-text-primary)" }}
            >
                {label}
            </span>
        </div>
    );
}

/* ── main component ──────────────────────────────── */
export default function PhoneMockup({ userName = "Chester" }) {
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
                                {/* <PixelCharacter showControls={true} /> */}
                                <SpriteCharacter showTrigger={true} displaySize={80} />
                                {/* <PixelGirl /> */}
                            </div>
                        </div>
                    </div>

                    {/* greeting */}
                    <div className="text-center -mt-4 relative z-10 px-5">
                        <h2
                            className="text-xl font-semibold tracking-tight"
                            style={{ color: "var(--color-text-primary)" }}
                        >
                            Good morning, {userName}
                        </h2>
                        <p
                            className="text-xs mt-1"
                            style={{ color: "var(--color-text-secondary)" }}
                        >
                            26°C and broken clouds
                        </p>
                    </div>

                    {/* app grid */}
                    <div className="flex-1 flex flex-col justify-end px-4 pb-6 pt-4 gap-2.5">
                        {/* row 1 — 2 items */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <GridCard label="Automations" icon={icons.Automations} />
                            <GridCard label="Mail" icon={icons.Mail} />
                        </div>
                        {/* row 2 — 3 items */}
                        <div className="grid grid-cols-3 gap-2.5">
                            <GridCard label="Orders" icon={icons.Orders} />
                            <GridCard label="Gallery" icon={icons.Gallery} />
                            <GridCard label="Text Poke" icon={icons["Text Poke"]} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
