import { useState } from "react";
import { motion } from "motion/react";

/* ── Mock Data ────────────────────────────────────────── */
const initialHabits = [
  { id: 1, name: "Reading", dots: Array(21).fill(false) },
  { id: 2, name: "Exercise", dots: Array(21).fill(false) },
  { id: 3, name: "Meditation", dots: Array(21).fill(false) },
];

/* ── Single Dot ───────────────────────────────────────── */
function Dot({ filled, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: index * 0.02,
        type: "spring",
        stiffness: 500,
        damping: 25,
      }}
      whileTap={{ scale: 0.7 }}
      whileHover={{ scale: 1.25 }}
      className="w-[10px] h-[10px] rounded-full cursor-pointer outline-none border-none p-0"
      style={{
        backgroundColor: filled
          ? "var(--color-text-primary)"
          : "var(--color-lightgray)",
        transition: "background-color 0.2s ease",
      }}
      aria-label={filled ? "Unmark day" : "Mark day"}
    />
  );
}

/* ── Habit Card ───────────────────────────────────────── */
function HabitCard({ habit, onToggleDot, cardIndex }) {
  const filledCount = habit.dots.filter(Boolean).length;
  const percentage = Math.round((filledCount / habit.dots.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: cardIndex * 0.1,
        duration: 0.4,
        ease: "easeOut",
      }}
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        boxShadow:
          "0 4px 16px var(--color-shadow), 0 1px 3px var(--color-shadow-sm)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          {habit.name}
        </span>
        <motion.span
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-sm font-semibold"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {percentage}%
        </motion.span>
      </div>

      {/* Dot Grid: 7 columns × 3 rows */}
      <div className="grid grid-cols-7 gap-[6px] place-items-center">
        {habit.dots.map((filled, i) => (
          <Dot
            key={i}
            filled={filled}
            index={i}
            onClick={() => onToggleDot(habit.id, i)}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Habit List ───────────────────────────────────────── */
export default function HabitList({ onHabitToggle }) {
  const [habits, setHabits] = useState(initialHabits);

  const handleToggleDot = (habitId, dotIndex) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;
    
    // Compute the new dot value before updating state
    const isNowFilled = !habit.dots[dotIndex];
    if (onHabitToggle) onHabitToggle(isNowFilled);

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const newDots = [...h.dots];
        newDots[dotIndex] = !newDots[dotIndex];
        return { ...h, dots: newDots };
      })
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col gap-4"
    >
      {/* Section Header */}
      <h2
        className="text-sm font-bold tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        Habit Tracker
      </h2>

      {/* Habit Cards */}
      {habits.map((habit, i) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          cardIndex={i}
          onToggleDot={handleToggleDot}
        />
      ))}
    </motion.div>
  );
}
