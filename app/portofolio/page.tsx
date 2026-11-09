import { createClient } from "@/lib/supabase/server";
import HomeGallery from "@/app/components/HomeGallery";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, category, creator_name, image_url, description, software, status, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) console.error("Gagal mengambil proyek:", error.message);

    const projects = (data ?? []).map((project) => ({
        id: String(project.id),
        title: project.title ?? "Untitled Project",
        category: project.category ?? "Other",
        creator: project.creator_name ?? "NextCAD Studio",
        image: project.image_url ?? "",
        description: project.description ?? "",
        software: project.software ?? "",
        likes: 0,
    }));

    return <HomeGallery projects={projects} />;
}