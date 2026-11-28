import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F4F0] text-[#16161D]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FF6B35] text-xl font-bold text-white">f</span>
          <span className="text-lg font-semibold tracking-tight">FairSharely EDU</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-medium text-[#6B6A73] hover:bg-white">Prijava</Link>
          <Link href="/register" className="rounded-full bg-[#FF6B35] px-5 py-2 text-sm font-semibold text-white hover:bg-[#E85B29]">Počni</Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#6B6A73]">Upravljanje studentskim projektima</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">Podelite posao.<br />Uspite zajedno.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#6B6A73]">Planirajte zadatke, pratite napredak i raspodelite opterećenje tako da se svačiji doprinos vidi.</p>
          <Link href="/dashboard" className="mt-8 inline-block rounded-full bg-[#FF6B35] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#E85B29]">Otvori projekat</Link>
        </div>

        <div className="rounded-[2rem] border border-[#E5E3DC] bg-white p-4 shadow-[0_24px_80px_rgba(22,22,29,0.08)]">
          <div className="rounded-[1.5rem] bg-[#F5F4F0] p-5">
            <div className="mb-5 flex items-center justify-between"><span className="font-semibold">Naš projekat</span><span className="rounded-full bg-white px-3 py-1 text-xs text-[#6B6A73]">Zajedno, korak po korak</span></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Za uraditi", "U toku", "Završeno"].map((column, index) => (
                <div key={column} className="rounded-2xl bg-[#f7f8f5] p-3">
                  <p className="mb-3 text-xs font-semibold text-[#6B6A73]">{column}</p>
                  {[0, 1].slice(0, index === 2 ? 1 : 2).map((item) => (
                    <div key={item} className="mb-2 rounded-xl bg-white p-3 shadow-sm">
                      <div className={`mb-3 h-2 w-12 rounded-full ${index === 0 ? "bg-[#9CCBFF]" : index === 1 ? "bg-[#FF6B35]" : "bg-[#93E2C3]"}`} />
                      <div className="h-2 w-full rounded-full bg-[#E5E3DC]" />
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
