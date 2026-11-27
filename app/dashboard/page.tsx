const columns = [
  { title: "Backlog", count: 8, color: "bg-[#edece8]" },
  { title: "To do", count: 3, color: "bg-[#e8edf3]" },
  { title: "In progress", count: 2, color: "bg-[#f4e9d5]" },
  { title: "Done", count: 5, color: "bg-[#dde9d9]" }
];

const tasks = [
  ["Create wireframes", "Research interviews", "Prepare presentation"],
  ["Design navigation", "Build components"],
  ["Set up database", "API integration"],
  ["Project brief", "Team roles"]
];

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#f4f6f1] p-4 md:p-7">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 flex items-center justify-between rounded-2xl bg-white px-5 py-4">
          <div><p className="text-xs text-[#899087]">Workspace</p><h1 className="mt-1 font-semibold">Campus Connect</h1></div>
          <button className="rounded-full bg-[#263b27] px-4 py-2 text-sm font-medium text-white">+ Add task</button>
        </header>

        <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[["Progress", "68%"], ["Tasks", "18"], ["Sprint", "06"], ["Velocity", "24"]].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-4"><p className="text-xs text-[#899087]">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>
          ))}
        </section>

        <section className="grid gap-3 overflow-x-auto md:grid-cols-4">
          {columns.map((column, index) => (
            <div key={column.title} className="min-w-64 rounded-2xl bg-white p-3">
              <div className="mb-3 flex items-center justify-between px-1"><h2 className="text-sm font-semibold">{column.title}</h2><span className="text-xs text-[#92988f]">{column.count}</span></div>
              {tasks[index].map((task, taskIndex) => (
                <article key={task} draggable className="mb-2 rounded-xl border border-[#edf0ea] p-4">
                  <div className="mb-3 flex items-center justify-between"><span className={`h-2 w-10 rounded-full ${taskIndex === 0 ? "bg-[#dfb66d]" : "bg-[#b8c9b4]"}`} /><span className="text-xs text-[#9a9f96]">#{index + taskIndex + 12}</span></div>
                  <h3 className="text-sm font-medium">{task}</h3>
                  <div className="mt-5 flex items-center justify-between"><div className="grid h-7 w-7 place-items-center rounded-full bg-[#edf1e9] text-[10px] font-semibold">AM</div><span className="text-xs text-[#899087]">2d</span></div>
                </article>
              ))}
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
