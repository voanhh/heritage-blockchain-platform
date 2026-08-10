export function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f2] px-5">
      <section className="w-full max-w-md rounded border border-stone-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-600">Authentication foundation sẽ được hoàn thiện ở Phase 2.</p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded border border-stone-300 px-3 py-2" placeholder="Email" />
          <input className="w-full rounded border border-stone-300 px-3 py-2" placeholder="Password" type="password" />
          <button className="w-full rounded bg-emerald-700 px-4 py-2 font-medium text-white" type="button">
            Tiếp tục
          </button>
        </form>
      </section>
    </main>
  );
}

