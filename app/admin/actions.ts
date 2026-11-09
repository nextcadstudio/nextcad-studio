"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function field(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}
function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function saveProject(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(form, "id");
  const title = field(form, "title");
  const image_url = field(form, "image_url");
  const status = field(form, "status");
  if (!title || !image_url) throw new Error("Judul dan URL gambar wajib diisi.");
  let parsed: URL;
  try { parsed = new URL(image_url); } catch { throw new Error("URL gambar tidak valid."); }
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("URL gambar harus HTTP/HTTPS.");
  if (!["draft", "published"].includes(status)) throw new Error("Status tidak valid.");

  const payload = {
    title, slug: slugify(title) || crypto.randomUUID(),
    description: field(form, "description"),
    category: field(form, "category") || "Other",
    software: field(form, "software"),
    creator_name: field(form, "creator_name") || "NextCAD Studio Creator",
    image_url, status,
  };
  let error;
  if (id) ({ error } = await supabase.from("projects").update(payload).eq("id", id));
  else ({ error } = await supabase.from("projects").insert(payload));
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?saved=1");
}

export async function deleteProject(form: FormData) {
  const { supabase } = await requireAdmin();
  const id = field(form, "id");
  if (!id) throw new Error("ID proyek tidak ditemukan.");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}

export async function logoutAdmin() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}