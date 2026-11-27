import Link from "next/link";

export default function Register() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f4f6f1] px-6 py-10">
      <form className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(45,65,47,0.1)]">
        <Link href="/" className="text-xl font-semibold">FairShare</Link>
        <h1 className="mt-8 text-3xl font-semibold">Create your account</h1>
        <label className="mt-6 block text-sm font-medium">Full name<input className="mt-2 w-full rounded-xl border border-[#dde2da] px-4 py-3 outline-none focus:border-[#71816e]" placeholder="Alex Morgan" /></label>
        <label className="mt-4 block text-sm font-medium">Email<input className="mt-2 w-full rounded-xl border border-[#dde2da] px-4 py-3 outline-none focus:border-[#71816e]" type="email" placeholder="student@university.edu" /></label>
        <label className="mt-4 block text-sm font-medium">Password<input className="mt-2 w-full rounded-xl border border-[#dde2da] px-4 py-3 outline-none focus:border-[#71816e]" type="password" placeholder="At least 8 characters" /></label>
        <Link href="/dashboard" className="mt-6 block rounded-xl bg-[#263b27] py-3 text-center text-sm font-semibold text-white">Create account</Link>
        <p className="mt-5 text-center text-sm text-[#737a71]">Already registered? <Link href="/login" className="font-semibold text-[#263b27]">Log in</Link></p>
      </form>
    </main>
  );
}
