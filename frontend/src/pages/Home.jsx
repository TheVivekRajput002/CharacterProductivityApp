import { useState } from "react";
import PhoneMockup from "../components/home/PhoneMockup";
import HabitList from "../components/home/HabitList";
import TaskList from "../components/home/TaskList";
import TaskTable from "../components/home/TaskTable";

export default function Home() {
  const [animTrigger, setAnimTrigger] = useState(null);

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

  const handleHabitToggle = (isFilled) => {
    setAnimTrigger({ emotion: isFilled ? "happy" : "angry", t: Date.now() });
  };

  return (
    <div
      className="h-screen overflow-hidden flex pl-5"
      style={{ background: "var(--color-bg)" }}
    >
      {/* ── Left: Phone mockup (fixed width, centered) ── */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 items-center justify-center py-4 px-4">
        <PhoneMockup userName="Chester" animTrigger={animTrigger} character={character} setCharacter={setCharacter}/>
      </aside>

      {/* ── Right: Dashboard grid ── */}
      <main className="flex-1 min-w-0 overflow-y-auto py-6 pr-6 pl-2 lg:pl-4">
        <div className="flex gap-5">

          <div className="w-1/3">
            <HabitList onHabitToggle={handleHabitToggle} />
          </div>
          <div className="w-2/3">
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-5">
              <TaskList onTaskToggle={handleHabitToggle} setCharacter={setCharacter}/>
              <TaskTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}