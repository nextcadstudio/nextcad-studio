import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { deleteProject } from "../actions";
import AdminCopyProtection from "../AntiCopyProtection";

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
  }>;
}) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="admin-protected mx-auto max-w-6xl">
      <AdminCopyProtection />

      {/* Header halaman */}
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mt-2 text-3xl font-bold">
            Library Project
          </h1>
        </div>
      </div>

      {/* Notifikasi berhasil */}
      {params.saved && (
        <p className="notice mb-4">
          Project successfully saved
        </p>
      )}

      {params.deleted && (
        <p className="notice mb-4">
          Project successfully deleted
        </p>
      )}

      {/* Tabel proyek */}
      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="p-4">Projects</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {(data ?? []).map((p) => (
              <tr
                key={p.id}
                className="border-t border-white/10"
              >
                <td className="min-w-64 p-4">
                  <div className="font-semibold">
                    {p.title}
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    {p.creator_name}
                  </div>
                </td>

                <td className="p-4">
                  {p.category}
                </td>

                <td className="p-4">
                  <span
                    className={
                      p.status === "Published"
                        ? "status-live"
                        : "status-draft"
                    }
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link
                      className="text-violet-300 transition hover:text-violet-200"
                      href={`/admin/projects/${p.id}/edit`}
                    >
                      Edit
                    </Link>

                    <form action={deleteProject}>
                      <input
                        type="hidden"
                        name="id"
                        value={p.id}
                      />

                      <button
                        type="submit"
                        className="text-rose-300 transition hover:text-rose-200"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!data || data.length === 0) && (
          <p className="p-8 text-center text-slate-400">
            No projects available yet
          </p>
        )}
      </div>

      {/* Tombol kembali di kanan bawah */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/admin"
          aria-label="Kembali ke Dashboard Admin"
          title="Kembali ke Dashboard Admin"
          className="group inline-flex items-center justify-center gap-2 rounded-xl p-3 text-slate-400 transition-all duration-200 hover:bg-violet-500/15 hover:text-violet-300"
        >
          <span className="text-xl transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>

          <span className="text-sm">
            Back to Dashboard
          </span>
        </Link>
      </div>
    </div>
  );
}