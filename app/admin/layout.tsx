import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { logoutAdmin } from "./actions";
import AdminCopyProtection from "./AntiCopyProtection";

const menuItems = [
  { href: "/admin", icon: "🏠︎", label: "Dashboard" },
  { href: "/admin/projects", icon: "🗀", label: "Library Project" },
  { href: "/admin/analytics", icon: "🗠", label: "View Analytics" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="admin-protected min-h-screen bg-[#080a12] text-white md:flex">
      <AdminCopyProtection />

      <aside className="w-full border-b border-white/10 bg-[#0c0f19] md:sticky md:top-0 md:h-screen md:w-[270px] md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex h-full flex-col p-5 md:p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500 text-2xl font-bold shadow-lg shadow-violet-500/20">
              👤
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">
                NextCAD <span className="text-violet-400">Studio</span>
              </p>
              <p className="mt-0.5 text-[10px] tracking-[0.25em] text-slate-500"></p>
            </div>
          </Link>

          <div className="mt-10">
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.25em] text-slate-500">
              FEATURES
            </p>

            <nav className="grid gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                    item.href === "/admin"
                      ? "bg-violet-500/15 font-semibold text-violet-300 ring-1 ring-violet-400/20"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}

                  {item.href === "/admin" && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </Link>
              ))}

              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                <span className="text-lg">↗</span>
                Visit Website
              </Link>
            </nav>
          </div>

          <div className="mt-8 rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-transparent p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/15 text-xl text-violet-300">
              ✦
            </div>

            <p className="text-sm font-semibold">Your creative space</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Organize your 3D artwork and build your portfolio.
            </p>
          </div>

          <div className="mt-auto hidden border-t border-white/10 pt-5 md:block">
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <span className="text-lg">⇥</span>
                Logout
              </button>
            </form>

            <p className="mt-4 px-4 text-[10px] tracking-wider text-slate-600">
              NextCAD Studio © 2026
            </p>
          </div>

          <div className="mt-4 md:hidden">
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-xl px-4 py-2 text-sm text-slate-400 hover:text-rose-300"
              >
                ⇥ Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}