import Link from "next/link";

export default function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F4F0] px-6">
      <form className="w-full max-w-md rounded-[2rem] border border-[#E5E3DC] bg-white p-8 shadow-[0_20px_60px_rgba(22,22,29,0.08)]">
        <Link href="/" className="text-xl font-semibold">FairSharely EDU</Link>
        <h1 className="mt-10 text-3xl font-semibold">Dobro došao/la nazad</h1>
        <label className="mt-8 block text-sm font-medium">Imejl<input className="mt-2 w-full rounded-xl border border-[#E5E3DC] px-4 py-3 outline-none focus:border-[#FF6B35]" type="email" placeholder="student@university.edu" /></label>
        <label className="mt-4 block text-sm font-medium">Lozinka<input className="mt-2 w-full rounded-xl border border-[#E5E3DC] px-4 py-3 outline-none focus:border-[#FF6B35]" type="password" placeholder="••••••••" /></label>
        <Link href="/dashboard" className="mt-6 block rounded-xl bg-[#FF6B35] py-3 text-center text-sm font-semibold text-white hover:bg-[#E85B29]">Prijavi se</Link>
        <p className="mt-5 text-center text-sm text-[#6B6A73]">Nemaš nalog? <Link href="/register" className="font-semibold text-[#16161D]">Napravi nalog</Link></p>
      </form>
    </main>
  );
}
