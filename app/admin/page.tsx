import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import AdminCopyProtection from "./AntiCopyProtection";

export default async function AdminDashboard() {
    const { supabase } = await requireAdmin();

    const { data: projects, error } = await supabase
        .from("projects")
        .select("id, status, category")
        .order("created_at", { ascending: false });

    const all = projects ?? [];

    const published = all.filter(
        (project) => project.status === "published"
    ).length;

    const drafts = all.filter(
        (project) => project.status === "draft"
    ).length;

    const categories = new Set(
        all.map((project) => project.category).filter(Boolean)
    ).size;

    const stats = [
        {
            label: "Total Projects",
            value: all.length,
            icon: "▦",
            description: "All artwork in your library",
            color: "violet",
        },
        {
            label: "Published",
            value: published,
            icon: "▤",
            description: "Visible to your audience",
            color: "emerald",
        },
        {
            label: "Drafts",
            value: drafts,
            icon: "◷",
            description: "Work in progress",
            color: "amber",
        },
        {
            label: "Categories",
            value: categories,
            icon: "☰",
            description: "Creative disciplines",
            color: "sky",
        },
    ];

    const colorStyles: Record<string, string> = {
        violet: "bg-violet-500/15 text-violet-300 ring-violet-400/15",
        emerald: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/15",
        amber: "bg-amber-500/15 text-amber-300 ring-amber-400/15",
        sky: "bg-sky-500/15 text-sky-300 ring-sky-400/15",
    };

    return (
        <div className="admin-protected space-y-9">
            <AdminCopyProtection />

            <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Dashboard<span className="text-violet-400"> </span>
                    </h1>
                </div>
            </header>

            <section>
                <div className="mb-5 flex items-end justify-end">
                    <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        Live Data
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="group rounded-2xl border border-white/[0.08] bg-[#0e111b] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-400/25 hover:bg-[#111522]"
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-sm text-slate-400">
                                    {stat.label}
                                </p>

                                <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ring-1 ${colorStyles[stat.color]}`}
                                >
                                    {stat.icon}
                                </span>
                            </div>

                            <p className="mt-5 text-4xl font-bold tracking-tight">
                                {stat.value}
                            </p>

                            <p className="mt-2 text-xs text-slate-500">
                                {stat.description}
                            </p>

                            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className={`h-full rounded-full ${stat.color === "violet"
                                            ? "w-3/4 bg-violet-400"
                                            : stat.color === "emerald"
                                                ? "w-2/3 bg-emerald-400"
                                                : stat.color === "amber"
                                                    ? "w-1/2 bg-amber-400"
                                                    : "w-2/5 bg-sky-400"
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-semibold">Project Library</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Your current portfolio activity.
                            </p>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-300">
                            Unable to load project data. Check your database permissions.
                        </div>
                    ) : all.length === 0 ? (
                        <div className="mt-6 rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-300">
                                🗀
                            </div>

                            <h3 className="mt-4 font-semibold">
                                Your library is waiting
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Upload your 3D project here
                            </p>

                            <Link
                                href="/admin/projects/new"
                                className="mt-5 inline-flex rounded-xl bg-violet-500/15 px-4 py-2.5 text-sm font-medium text-violet-200 transition hover:bg-violet-500/25"
                            >
                                Add Project
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {all.slice(0, 5).map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xl text-violet-300">
                                        ◈
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {project.category || "Uncategorized project"}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-slate-500">
                                            Project ID: {project.id}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${project.status === "published"
                                                ? "bg-emerald-400/10 text-emerald-300"
                                                : "bg-amber-400/10 text-amber-300"
                                            }`}
                                    >
                                        {project.status || "unknown"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-6">
                    <h2 className="font-semibold">Quick Actions</h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Jump straight into your workflow.
                    </p>

                    <div className="mt-6 grid gap-3">
                        {/* CREATE PROJECT */}
                        <Link
                            href="/admin/projects/new"
                            className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-violet-400/30 hover:bg-violet-500/[0.06]"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                                ＋
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    Create Project
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                    Add new 3D artwork
                                </span>
                            </span>

                            <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300">
                                →
                            </span>
                        </Link>

                        {/* MANAGE LIBRARY */}
                        <Link
                            href="/admin/projects"
                            className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-sky-400/30 hover:bg-sky-500/[0.06]"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/15 text-xl text-sky-300">
                                🗀
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    Manage Library
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                    Edit and organize projects
                                </span>
                            </span>

                            <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-sky-300">
                                →
                            </span>
                        </Link>

                        {/* SAFELINK MANAGER */}
                        <Link
                            href="/admin/safelinks"
                            className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-violet-400/30 hover:bg-violet-500/[0.06]"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
                                🔒︎
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    Safelink Manager
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                    Manage external monetized links
                                </span>
                            </span>

                            <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300">
                                →
                            </span>
                        </Link>

                        {/* VISIT WEBSITE */}
                        <Link
                            href="/"
                            className="group flex items-center gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-emerald-400/30 hover:bg-emerald-500/[0.06]"
                        >
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-xl text-emerald-300">
                                ↗
                            </span>

                            <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">
                                    Visit Website
                                </span>
                                <span className="mt-1 block text-xs text-slate-500">
                                    Preview your public portfolio
                                </span>
                            </span>

                            <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-300">
                                →
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/[0.07] pt-5 text-xs text-slate-600">
                NextCAD Studio · Admin Panel
            </footer>
        </div>
    );
}