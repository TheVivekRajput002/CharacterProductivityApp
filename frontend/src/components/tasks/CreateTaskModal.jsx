import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import axios from "axios"
import { useState } from "react";

export default function CreateTaskModal({ isOpen, onClose }) {

  const [task, setTask] = useState({
    title: "",
    tag: "health",
    priority: 3,
    due_date: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/task/create`, task, {
        withCredentials: true
      });

      console.log(response);

      setTask({
        title: "",
        tag: "health",
        priority: 3,
        due_date: "",
      });

      onClose();

    } catch (error) {
      console.error("error in handlesubmit", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md overflow-hidden rounded-2xl p-6 pointer-events-auto shadow-2xl"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-border)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                  Create New Task
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 transition-colors hover:bg-white/10"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => { setTask({ ...task, title: e.target.value }) }}
                    required
                    placeholder="E.g., Design homepage wireframes"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-500"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      color: "var(--color-text-primary)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>

                {/* Tag & Priority Row */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      Tag
                    </label>
                    <select
                      className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all appearance-none"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text-primary)",
                        border: "1px solid var(--color-border)",
                      }}
                      value={task.tag}
                      onChange={(e) => setTask({ ...task, tag: e.target.value })}

                    >
                      <option value="health">Health</option>
                      <option value="intelligence">Intelligence</option>
                      <option value="strength">Strength</option>
                      <option value="creativity">Creativity</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                      Priority
                    </label>
                    <select
                      className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all appearance-none"
                      style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text-primary)",
                        border: "1px solid var(--color-border)",
                      }}
                      value={task.priority}
                      onChange={(e) => setTask({ ...task, priority: Number(e.target.value) })}

                    >
                      <option value={3}>Low</option>
                      <option value={2}>Medium</option>
                      <option value={1}>High</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      color: "var(--color-text-primary)",
                      border: "1px solid var(--color-border)",
                    }}
                    value={task.due_date}
                    onChange={(e) => setTask({ ...task, due_date: e.target.value })}
                  />
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg px-5 py-2 text-sm font-semibold transition-transform active:scale-95"
                    style={{
                      backgroundColor: "var(--color-text-primary)",
                      color: "var(--color-bg)",
                    }}
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
