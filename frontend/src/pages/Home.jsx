import PhoneMockup from "../components/home/PhoneMockup";
import HabitList from "../components/home/HabitList";
import TaskList from "../components/home/TaskList";
import TaskTable from "../components/home/TaskTable";

export default function Home() {
  return (
    <div
      className="h-screen overflow-hidden flex pl-5"
      style={{ background: "var(--color-bg)" }}
    >
      {/* ── Left: Phone mockup (fixed width, centered) ── */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 items-center justify-center py-4 px-4">
        <PhoneMockup userName="Chester" />
      </aside>

      {/* ── Right: Dashboard grid ── */}
      <main className="flex-1 min-w-0 overflow-y-auto py-6 pr-6 pl-2 lg:pl-4">
        <div className="flex gap-5">

          <div className="w-1/3">
            <HabitList />
          </div>
          <div className="w-2/3">
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
              <TaskList />
              <TaskTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}