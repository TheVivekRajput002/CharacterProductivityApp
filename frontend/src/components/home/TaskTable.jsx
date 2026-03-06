import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ─────────────────────────────────────────────────────────
   Sample task data (UI demonstration only)
   ───────────────────────────────────────────────────────── */
const sampleTasks = [
  { id: 1, title: "Design landing page hero", tag: "Design", priority: "High", dueDate: "Mar 12, 2026", progress: 75 },
  { id: 2, title: "Set up authentication flow", tag: "Backend", priority: "High", dueDate: "Mar 14, 2026", progress: 90 },
  { id: 3, title: "Create onboarding screens", tag: "UI/UX", priority: "Medium", dueDate: "Mar 18, 2026", progress: 50 },
  { id: 4, title: "Write API documentation", tag: "Docs", priority: "Low", dueDate: "Mar 22, 2026", progress: 30 },
  { id: 5, title: "Optimize database queries", tag: "Backend", priority: "Medium", dueDate: "Mar 25, 2026", progress: 60 },
];

/* ─────────────────────────────────────────────────────────
   Priority badge config – colors from CSS variables
   ───────────────────────────────────────────────────────── */
const priorityStyles = {
  High: { color: "var(--color-danger)", bg: "var(--color-danger-bg)" },
  Medium: { color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  Low: { color: "var(--color-muted)", bg: "var(--color-muted-bg)" },
};

/* ─────────────────────────────────────────────────────────
   Tag pill config
   ───────────────────────────────────────────────────────── */
const tagStyles = {
  Design: { color: "var(--color-accent)", bg: "var(--color-accent-bg)" },
  Backend: { color: "var(--color-primary)", bg: "var(--color-primary-subtle)" },
  "UI/UX": { color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  Docs: { color: "var(--color-muted)", bg: "var(--color-muted-bg)" },
  Frontend: { color: "var(--color-success)", bg: "var(--color-success-bg)" },
};

/* ─────────────────────────────────────────────────────────
   PriorityBadge – colored pill for priority level
   ───────────────────────────────────────────────────────── */
function PriorityBadge({ priority }) {
  const s = priorityStyles[priority] || priorityStyles.Low;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      {priority}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   TagPill – soft pill for category tag
   ───────────────────────────────────────────────────────── */
function TagPill({ tag }) {
  const s = tagStyles[tag] || { color: "var(--color-text-secondary)", bg: "var(--color-muted-bg)" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ color: s.color, backgroundColor: s.bg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {tag}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   ProgressBar – animated segmented bar with percentage
   ───────────────────────────────────────────────────────── */
function ProgressBar({ value }) {
  // 10 segments
  const totalSegments = 10;
  const filledSegments = Math.round((value / 100) * totalSegments);

  return (
    <div className="flex items-center gap-2.5">
      {/* Segmented bar */}
      <div className="flex gap-[3px]">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <motion.div
            key={i}
            className="h-2.5 w-[5px] rounded-[2px]"
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{
              opacity: i < filledSegments ? 1 : 0.15,
              scaleY: 1,
            }}
            transition={{
              delay: i * 0.04,
              duration: 0.35,
              ease: "easeOut",
            }}
            style={{
              backgroundColor:
                i < filledSegments ? "var(--color-primary)" : "var(--color-border)",
            }}
          />
        ))}
      </div>

      {/* Percentage */}
      <motion.span
        className="min-w-[32px] text-xs font-semibold tabular-nums"
        style={{ color: "var(--color-text-secondary)" }}
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {value}%
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CheckIcon – animated check SVG
   ───────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.path
        d="M3 8.5L6.5 12L13 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      />
    </motion.svg>
  );
}

/* ─────────────────────────────────────────────────────────
   TaskIcon – small icon for task title
   ───────────────────────────────────────────────────────── */
function TaskIcon({ completed }) {
  return (
    <div
      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
      style={{
        backgroundColor: completed ? "var(--color-success-bg)" : "var(--color-primary-subtle)",
        color: completed ? "var(--color-success)" : "var(--color-primary)",
      }}
    >
      {completed ? (
        <CheckIcon />
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4.5 7H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M7 4.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TaskRow – a single card-like row
   ───────────────────────────────────────────────────────── */
function TaskRow({ task, index, onComplete }) {
  const completed = task.progress === 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -2,
        boxShadow: "0 6px 24px var(--color-shadow)",
      }}
      className="grid items-center gap-3 rounded-lg px-4 py-2.5 transition-colors"
      style={{
        gridTemplateColumns: "2.2fr 0.7fr 0.6fr 0.9fr 1.1fr auto",
        backgroundColor: "var(--color-row)",
        border: "1px solid var(--color-border)",
        opacity: completed ? 0.6 : 1,
      }}
    >
      {/* Title + icon */}
      <div className="flex items-center gap-3 min-w-0">
        <TaskIcon completed={completed} />
        <motion.span
          animate={{ opacity: completed ? 0.5 : 1 }}
          className="truncate text-xs font-medium"
          style={{
            color: "var(--color-text-primary)",
            textDecoration: completed ? "line-through" : "none",
            textDecorationColor: "var(--color-muted)",
          }}
        >
          {task.title}
        </motion.span>
      </div>

      {/* Tag */}
      <div>
        <TagPill tag={task.tag} />
      </div>

      {/* Priority */}
      <div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Due date */}
      <span
        className="text-xs"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {task.dueDate}
      </span>

      {/* Progress bar */}
      <ProgressBar value={task.progress} />

      {/* Complete button */}
      <div className="flex justify-end">
        <AnimatePresence mode="wait">
          {completed ? (
            <motion.span
              key="done"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                color: "var(--color-success)",
                backgroundColor: "var(--color-success-bg)",
              }}
            >
              <CheckIcon />
              Done
            </motion.span>
          ) : (
            <motion.button
              key="btn"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onComplete(task.id)}
              className="cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors"
              style={{
                color: "var(--color-primary)",
                backgroundColor: "var(--color-primary-subtle)",
                border: "1px solid var(--color-primary-muted)",
              }}
            >
              Complete
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   TaskTable – main card container
   ───────────────────────────────────────────────────────── */
export default function TaskTable() {
  const [tasks, setTasks] = useState(sampleTasks);

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, progress: Math.min(t.progress + 10, 100) }
          : t
      )
    );
  };

  const completedCount = tasks.filter((t) => t.progress === 100).length;
  const activeCount = tasks.length - completedCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="w-full rounded-xl p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 8px 40px var(--color-shadow), 0 1px 4px var(--color-shadow-sm)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: "var(--color-success)" }}
        />
        <h2
          className="text-sm font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Active Services
        </h2>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {activeCount} Active · {completedCount} Completed
        </span>
      </div>

      {/* ── Column headers ── */}
      <div
        className="grid items-center gap-3 px-4 pb-1.5"
        style={{
          gridTemplateColumns: "2.2fr 0.7fr 0.6fr 0.9fr 1.1fr auto",
        }}
      >
        {["TITLE", "TAG", "PRIORITY", "DUE DATE", "PROGRESS", ""].map((h) => (
          <span
            key={h || "action"}
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* ── Task rows ── */}
      <div className="flex flex-col gap-2">
        {tasks.map((task, i) => (
          <TaskRow
            key={task.id}
            task={task}
            index={i}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        className="mt-3 flex items-center justify-between px-4 text-[11px]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <span>
          {completedCount} of {tasks.length} tasks completed
        </span>
        <span className="opacity-50">Click "Complete" to mark a task done</span>
      </div>
    </motion.div>
  );
}
