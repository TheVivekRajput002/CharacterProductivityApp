import { useState } from "react";
import TaskList from "../components/home/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import { Plus } from "lucide-react";

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="h-screen overflow-y-auto flex-1 p-6 lg:p-10"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1
              className="text-3xl font-bold tracking-tight mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Tasks
            </h1>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Manage your daily quests and objectives.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: "var(--color-text-primary)",
              color: "var(--color-bg)",
            }}
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>

        {/* Task List (reused from home) */}
        <div>
          <TaskList hideHeader={true} />
        </div>
      </div>

      {/* Modal Overlay */}
      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
