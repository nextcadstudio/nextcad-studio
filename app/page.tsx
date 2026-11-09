import { createClient } from "@/lib/supabase/server";
import HomeGallery from "./components/HomeGallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .select(
            "id, title, slug, category, creator_name, image_url, description, software, status"
        )
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(
            "Gagal mengambil proyek:",
            error.message
        );
    }

    const projects = (data ?? []).map((project) => ({
        id: String(project.id),
        title: project.title ?? "Untitled Project",
        category: project.category ?? "Other",
        creator: project.creator_name ?? "NextCAD Studio Creator",
        image: project.image_url ?? "/placeholder-project.jpg",
        description: project.description ?? "",
        software: project.software ?? "",
        likes: 0,
    }));

    return <HomeGallery projects={projects} />;
}