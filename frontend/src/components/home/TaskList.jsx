import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ── Mock Data ────────────────────────────────────────── */
const initialTasks = [
  { id: 1, title: "Schedule initial client meeting", category: "Discovery", status: "Completed", dueDate: "June 3, 2025" },
  { id: 2, title: "Gather business goals and user needs", category: "Discovery", status: "Completed", dueDate: "June 4, 2025" },
  { id: 3, title: "Review current website performance", category: "Discovery", status: "In Progress", dueDate: "June 5, 2025" },
  { id: 4, title: "Create wireframes for key pages", category: "Design", status: "Pending", dueDate: "June 10, 2025" },
  { id: 5, title: "Develop high-fidelity mockups", category: "Design", status: "Pending", dueDate: "June 15, 2025" },
];

/* ── Status Badge ─────────────────────────────────────── */
const statusConfig = {
  Completed: {
    color: "var(--color-success)",
    bg: "var(--color-success-bg)",
  },
  "In Progress": {
    color: "var(--color-warning)",
    bg: "var(--color-warning-bg)",
  },
  Pending: {
    color: "var(--color-muted)",
    bg: "var(--color-muted-bg)",
  },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending;

  return (
    <motion.span
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold select-none"
      style={{ color: cfg.color, backgroundColor: cfg.bg }}
    >
      <motion.span
        layout
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: cfg.color }}
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 0.4 }}
      />
      {status}
    </motion.span>
  );
}

/* ── Check Icon (SVG) ─────────────────────────────────── */
function CheckIcon({ checked }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill={checked ? "currentColor" : "none"}
        opacity={checked ? 0.15 : 1}
      />
      {checked && (
        <motion.path
          d="M5.5 9.5L7.5 11.5L12.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </svg>
  );
}

/* ── Task Row ─────────────────────────────────────────── */
function TaskRow({ task, index, onToggle }) {
  const isCompleted = task.status === "Completed";

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ backgroundColor: "var(--color-lightgray)" }}
      className="group transition-colors"
      style={{ borderBottom: "1px solid var(--color-separator)" }}
    >
      {/* No */}
      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {task.id}
      </td>

      {/* Task title + toggle */}
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.8 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 cursor-pointer rounded-md p-0.5 outline-none"
            style={{ color: isCompleted ? "var(--color-success)" : "var(--color-muted)" }}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            <CheckIcon checked={isCompleted} />
          </motion.button>

          <motion.span
            animate={{ opacity: isCompleted ? 0.55 : 1 }}
            transition={{ duration: 0.3 }}
            className="text-xs font-medium"
            style={{
              color: "var(--color-text-primary)",
              textDecoration: isCompleted ? "line-through" : "none",
              textDecorationColor: "var(--color-muted)",
            }}
          >
            {task.title}
          </motion.span>
        </div>
      </td>

      {/* Category */}
      <td
        className="px-4 py-2.5 text-xs"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {task.category}
      </td>

      {/* Status */}
      <td className="px-4 py-2.5">
        <AnimatePresence mode="wait">
          <StatusBadge key={task.status} status={task.status} />
        </AnimatePresence>
      </td>

      {/* Due Date */}
      <td className="px-4 py-2.5 text-xs" style={{ color: "var(--color-text-secondary)" }}>
        {task.dueDate}
      </td>
    </motion.tr>
  );
}

/* ── Task List Card ───────────────────────────────────── */
export default function TaskList({ hideHeader = false }) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" }
          : t
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full rounded-xl p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        boxShadow: "0 8px 32px var(--color-shadow), 0 1px 4px var(--color-shadow-sm)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      {!hideHeader && (
        <h2
          className="mb-3 text-sm font-bold tracking-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          Task List
        </h2>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              {["No", "Task", "Category", "Status", "Due Date"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                index={i}
                onToggle={handleToggle}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div
        className="mt-3 flex items-center justify-between px-4 text-[11px]"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <span>
          {tasks.filter((t) => t.status === "Completed").length} of {tasks.length} completed
        </span>
        <span className="opacity-60">Click the checkbox to toggle status</span>
      </div>
    </motion.div>
  );
}
