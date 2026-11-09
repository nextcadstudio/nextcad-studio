import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/admin";
import ProjectForm from "../../ProjectForm";

export default async function EditProjectPage({ params }: {params: Promise<{id:string}>}) {
  const {id} = await params;
  const {supabase} = await requireAdmin();
  const {data,error} = await supabase.from("projects").select("*").eq("id",id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();
  return <div className="max-w-5xl mx-auto"><p className="text-xs tracking-[.25em] text-violet-300">FORM PANEL</p><h1 className="text-3xl font-bold mt-2 mb-7">Edit Project</h1><ProjectForm project={data}/></div>;
}
