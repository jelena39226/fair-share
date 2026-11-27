import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f6f1] text-[#20251f]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="text-xl font-semibold tracking-tight">FairShare</div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium">Log in</Link>
          <Link href="/register" className="rounded-full bg-[#263b27] px-5 py-2 text-sm font-medium text-white">Get started</Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#71816e]">Student project management</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">Share the work.<br />Own the outcome.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#697068]">Plan sprints, organize tasks, and keep every teammate moving together.</p>
          <Link href="/dashboard" className="mt-8 inline-block rounded-full bg-[#263b27] px-7 py-3.5 text-sm font-semibold text-white">Open workspace</Link>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white p-4 shadow-[0_24px_80px_rgba(45,65,47,0.12)]">
          <div className="rounded-[1.5rem] bg-[#e8ede5] p-5">
            <div className="mb-5 flex items-center justify-between"><span className="font-semibold">Sprint 06</span><span className="rounded-full bg-white px-3 py-1 text-xs">12 tasks</span></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["To do", "In progress", "Done"].map((column, index) => (
                <div key={column} className="rounded-2xl bg-[#f7f8f5] p-3">
                  <p className="mb-3 text-xs font-semibold text-[#778076]">{column}</p>
                  {[0, 1].slice(0, index === 2 ? 1 : 2).map((item) => (
                    <div key={item} className="mb-2 rounded-xl bg-white p-3 shadow-sm">
                      <div className="mb-3 h-2 w-12 rounded-full bg-[#cbd7c7]" />
                      <div className="h-2 w-full rounded-full bg-[#edf0ea]" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
