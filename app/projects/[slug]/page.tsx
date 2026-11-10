"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  Check,
  Eye,
  Heart,
  Share2,
  Tag,
  UserRound,
  Download,
} from "lucide-react";

const projects = [
  {
    slug: "modern-house-villa",
    title: "Modern House Villa",
    creator: "Rizky Pratama",
    category: "Architecture",
    views: "1.2k",
    downloads: 248,
    software: "Blender, Cycles",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90",
    description:
      "A contemporary architectural visualization exploring natural materials, balanced lighting, and the relationship between indoor and outdoor spaces. This project focuses on realistic materials, carefully composed camera angles, and a calm modern atmosphere.",
    tags: ["Architecture", "Interior", "Visualization"],
  },
  {
    slug: "sports-car-concept",
    title: "Sports Car Concept",
    creator: "Andi Saputra",
    category: "Product Design",
    views: "980",
    downloads: 196,
    software: "Blender, Cycles",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=90",
    description:
      "An automotive-inspired concept showcase featuring sculpted surfaces, dramatic lighting, and a clean studio presentation.",
    tags: ["Automotive", "Product Design", "Studio"],
  },
  {
    slug: "fantasy-character",
    title: "Fantasy Character",
    creator: "Dewi Lestari",
    category: "Character",
    views: "2.3k",
    downloads: 412,
    software: "Blender, ZBrush",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1800&q=90",
    description:
      "A creative digital-art showcase exploring imaginative forms, atmospheric lighting, and visual storytelling.",
    tags: ["Character", "Digital Art", "Fantasy"],
  },
  {
    slug: "minimalist-interior",
    title: "Minimalist Interior",
    creator: "Bima Aditya",
    category: "Interior",
    views: "1.7k",
    downloads: 320,
    software: "Blender, V-Ray",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90",
    description:
      "A minimalist interior visualization combining soft daylight, carefully selected furniture, and refined material details.",
    tags: ["Interior", "Minimalist", "Architecture"],
  },
  {
    slug: "contemporary-living",
    title: "Contemporary Living",
    creator: "Nadia Putri",
    category: "Interior",
    views: "860",
    downloads: 142,
    software: "Blender, Cycles",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90",
    description:
      "A contemporary living space study with modern furnishings, natural textures, and a welcoming atmosphere.",
    tags: ["Living Room", "Interior", "Modern"],
  },
  {
    slug: "modern-architecture",
    title: "Modern Architecture",
    creator: "Arka Studio",
    category: "Architecture",
    views: "1.4k",
    downloads: 275,
    software: "Blender, Cycles",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=90",
    description:
      "An architectural study emphasizing geometric forms, material contrast, and clean contemporary composition.",
    tags: ["Architecture", "Exterior", "Modern"],
  },
  {
    slug: "product-visualization",
    title: "Product Visualization",
    creator: "Kreatif Studio",
    category: "Product Design",
    views: "760",
    downloads: 118,
    software: "Blender, Cycles",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=90",
    description:
      "A product presentation focused on clear composition, material definition, and a polished commercial aesthetic.",
    tags: ["Product", "Commercial", "Studio"],
  },
  {
    slug: "creative-environment",
    title: "Creative Environment",
    creator: "Horizon Creative",
    category: "Game Asset",
    views: "2.1k",
    downloads: 390,
    software: "Blender, Unreal Engine",
    year: "2026",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=90",
    description:
      "An atmospheric environment concept designed to inspire immersive worlds, cinematic scenes, and digital storytelling.",
    tags: ["Environment", "Game Asset", "Concept"],
  },
];

export default function ProjectDetailPage() {
  const params = useParams<{ slug: string }>();
  const [favorite, setFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  const project = projects.find(
    (item) => item.slug === params.slug
  );

  async function shareProject() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: project?.title ?? "RenderHub Project",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
      }
    } catch {
      // Sharing was cancelled or is unavailable.
    }
  }

  if (!project) {
    return (
      <main className="flex min-h-screen items-center
        justify-center bg-[#080d16] px-6 text-white">
        <div className="max-w-md text-center">
          <Box className="mx-auto text-violet-400" size={42} />
          <h1 className="mt-5 text-2xl font-bold">
            Project not found
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Karya ini tidak ditemukan. Silakan kembali
            ke galeri RenderHub.
          </p>
          <Link href="/"
            className="mt-6 inline-flex items-center gap-2
              rounded-xl bg-violet-600 px-5 py-3
              text-sm font-semibold hover:bg-violet-500">
            <ArrowLeft size={17} /> Back to gallery
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080d16] text-slate-100">
      <header className="sticky top-0 z-20 border-b
        border-white/[0.08] bg-[#080d16]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px]
          items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Box size={29} className="text-violet-400" />
            <span className="text-xl font-bold tracking-tight">
              RenderHub
            </span>
          </Link>

          <Link href="/" className="inline-flex items-center
            gap-2 rounded-xl border border-white/10
            px-4 py-2.5 text-sm text-slate-300
            transition hover:bg-white/[0.06] hover:text-white">
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Back to gallery</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-2
          text-sm text-slate-500">
          <Link href="/" className="hover:text-violet-300">
            Home
          </Link>
          <span>/</span>
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-300">{project.title}</span>
        </div>

        <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border
              border-white/10 bg-[#101725]">
              <img
                src={project.image}
                alt={project.title}
                className="max-h-[760px] min-h-[300px] w-full
                  object-cover sm:min-h-[440px]"
              />
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border
                  border-violet-300/20 bg-violet-400/10
                  px-3 py-1.5 text-xs font-medium text-violet-200">
                  {project.category}
                </span>
                <span className="text-sm text-slate-500">
                  Published {project.year}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold
                tracking-tight sm:text-5xl">
                {project.title}
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7
                text-slate-300 sm:text-base">
                {project.description}
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-lg font-semibold">
                Project tags
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="inline-flex
                    items-center gap-2 rounded-lg
                    border border-white/10 bg-[#111927]
                    px-3 py-2 text-sm text-slate-300">
                    <Tag size={14} /> {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-lg font-semibold">
                About this project
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border
                  border-white/[0.08] bg-[#101725] p-4">
                  <p className="text-xs text-slate-500">
                    Software
                  </p>
                  <p className="mt-2 font-medium">
                    {project.software}
                  </p>
                </div>
                <div className="rounded-xl border
                  border-white/[0.08] bg-[#101725] p-4">
                  <p className="text-xs text-slate-500">
                    Project category
                  </p>
                  <p className="mt-2 font-medium">
                    {project.category}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border
              border-white/[0.08] bg-[#101725] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase
                tracking-[0.16em] text-violet-300">
                Project creator
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0
                  items-center justify-center rounded-full
                  bg-gradient-to-br from-violet-500
                  to-indigo-700 text-lg font-bold">
                  {project.creator.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">
                    {project.creator}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    3D Artist
                  </p>
                </div>
                <UserRound size={19}
                  className="ml-auto text-slate-500" />
              </div>

              <div className="my-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#0a101b] p-3">
                  <Eye size={17} className="text-slate-400" />
                  <p className="mt-2 text-xl font-bold">
                    {project.views}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Views
                  </p>
                </div>
                <div className="rounded-xl bg-[#0a101b] p-3">
                  <Download size={17}
                    className="text-slate-400" />
                  <p className="mt-2 text-xl font-bold">
                    {project.downloads}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Downloads
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFavorite(!favorite)}
                aria-pressed={favorite}
                className="flex w-full items-center
                  justify-center gap-2 rounded-xl border
                  border-white/10 px-4 py-3 text-sm
                  font-semibold transition hover:bg-white/[0.06]">
                <Heart size={18}
                  className={favorite
                    ? "fill-pink-400 text-pink-400"
                    : ""}
                />
                {favorite ? "Saved to favorites" : "Add to favorites"}
              </button>

              <button
                onClick={shareProject}
                className="mt-3 flex w-full items-center
                  justify-center gap-2 rounded-xl
                  bg-violet-600 px-4 py-3 text-sm
                  font-semibold transition hover:bg-violet-500">
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                {copied ? "Link copied" : "Share project"}
                {!copied && <ArrowUpRight size={16} />}
              </button>

              <p className="mt-4 text-center text-xs leading-5
                text-slate-500">
                Sample portfolio data. Favorites and statistics
                are not saved to a database yet.
              </p>
            </div>

            <Link href="/" className="flex items-center
              justify-between rounded-2xl border
              border-white/[0.08] bg-[#101725] p-5
              transition hover:border-violet-300/30">
              <span>
                <span className="block font-semibold">
                  Discover more artwork
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Explore the RenderHub gallery
                </span>
              </span>
              <ArrowUpRight size={20}
                className="text-violet-300" />
            </Link>
          </aside>
        </section>

        <footer className="mt-16 border-t border-white/10
          py-6 text-sm text-slate-500">
          RenderHub © 2025 — A creative space for 3D artists.
        </footer>
      </div>
    </main>
  );
}