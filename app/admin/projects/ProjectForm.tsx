import { saveProject } from "../actions";

type Project = {id?:string;title?:string;description?:string;category?:string;software?:string;creator_name?:string;image_url?:string;status?:string};
export default function ProjectForm({ project }: { project?: Project }) {
  return <form action={saveProject} className="panel p-5 md:p-7 space-y-5 max-w-3xl">
    {project?.id && <input type="hidden" name="id" value={project.id}/>}
    <div className="grid sm:grid-cols-2 gap-5">
      <label className="fieldlabel">Project Title<input className="field" name="title" required defaultValue={project?.title??""} placeholder=" "/></label>
      <label className="fieldlabel">Category<select className="field" name="category" defaultValue={project?.category??"Architecture"}>{["Architecture","Interior","Product Design","Character","Environment","Vehicle","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="fieldlabel">Creator Name<input className="field" name="creator_name" defaultValue={project?.creator_name??"NextCAD Studio"} required/></label>
      <label className="fieldlabel">Software<input className="field" name="software" defaultValue={project?.software??""} placeholder="SolidWorks, Blender..."/></label>
    </div>
    <label className="fieldlabel">Image Address<input className="field" name="image_url" type="url" required defaultValue={project?.image_url??""} placeholder="https://..."/></label>
    <label className="fieldlabel">Description<textarea className="field min-h-32" name="description" defaultValue={project?.description??""} placeholder=" "/></label>
    <label className="fieldlabel">Status<select className="field" name="status" defaultValue={project?.status??"draft"}><option value="draft">Draft — belum tampil di galeri</option><option value="published">Published — tampil di galeri publik</option></select></label>
    <div className="flex flex-wrap gap-3"><button className="primary">Submit</button><a className="secondary" href="/admin/projects">Cancel</a></div>
  </form>;
}
