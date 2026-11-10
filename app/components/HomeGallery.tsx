"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Project = {
    id: string;
    title: string;
    category: string;
    creator: string;
    image: string;
    description: string;
    software: string;
    likes: number;
};

const iconPaths: Record<string, string> = {
    home: "M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-7h6v7",
    explore: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM16 8l-2.5 5.5L8 16l2.5-5.5L16 8Z",
    cube: "m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10",

    // Ikon gedung untuk menu Company Profile
    "building-2": "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9h.01M9 12h.01M9 15h.01M9 18h.01M15 12h.01M15 15h.01M15 18h.01",

    heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z",
    users: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM20 8v6M23 11h-6",
    search: "m21 21-4.3-4.3M19 10.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z",
    sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
    close: "M18 6 6 18M6 6l12 12",
    arrow: "M5 12h14M12 5l7 7-7 7",
    share: "M12 16V3M7 8l5-5 5 5M5 12v8h14v-8",
    layers: "m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5",
};

function Icon({
    name,
    size = 20,
    filled = false,
}: {
    name: string;
    size?: number;
    filled?: boolean;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={iconPaths[name] || iconPaths.cube} />
        </svg>
    );
}

const whatsappUrl = (message: string) =>
    `https://wa.me/6288293243900?text=${encodeURIComponent(message)}`;

export default function HomeGallery({
    projects = [],
}: {
    projects: Project[];
}) {
    const categories = [
        "All Projects",
        ...Array.from(
            new Set(projects.map((p) => p.category).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b)),
    ];

    const [activeCategory, setActiveCategory] = useState("All Projects");
    const [search, setSearch] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activePage, setActivePage] = useState("Home");
    const [sortBy, setSortBy] = useState("Featured");
    const [notice, setNotice] = useState("");

    // Mengelola timer notifikasi agar tidak berjalan setelah komponen dilepas.
    const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            if (noticeTimerRef.current) {
                clearTimeout(noticeTimerRef.current);
                noticeTimerRef.current = null;
            }
        };
    }, []);

    function showNotice(message: string, duration = 2500) {
        if (!isMountedRef.current) return;

        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }

        setNotice(message);

        noticeTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
                setNotice("");
            }

            noticeTimerRef.current = null;
        }, duration);
    }

    const filteredProjects = useMemo(() => {
        let result = projects.filter((project) => {
            const categoryMatch =
                activeCategory === "All Projects" ||
                project.category === activeCategory;

            const term = search.toLowerCase().trim();

            const searchMatch =
                !term ||
                [
                    project.title,
                    project.category,
                    project.creator,
                    project.software,
                ].some((value) =>
                    (value || "").toLowerCase().includes(term)
                );

            const pageMatch =
                activePage !== "Favorites" ||
                favorites.includes(project.id);

            return categoryMatch && searchMatch && pageMatch;
        });

        if (sortBy === "Most Liked") {
            result = [...result].sort((a, b) => b.likes - a.likes);
        }

        if (sortBy === "A–Z") {
            result = [...result].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        }

        return result;
    }, [
        projects,
        activeCategory,
        search,
        favorites,
        activePage,
        sortBy,
    ]);

    function selectPage(page: string) {
        setActivePage(page);
        setSearch("");
        setActiveCategory("All Projects");
        setSelectedProject(null);
    }

    function toggleFavorite(id: string) {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    }

    async function shareProject(project: Project) {
        const url = `${window.location.origin}/#project-${project.id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: project.title,
                    text: `Lihat karya ${project.title} di NextCAD Studio`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                showNotice("Link proyek berhasil disalin.");
            }
        } catch {
            /* Berbagi dibatalkan pengguna. */
        }
    }

    return (
        <main className="min-h-screen bg-[#080b13] text-slate-100">
            <style jsx global>{`
                * {
                    box-sizing: border-box;
                }

                html {
                    scroll-behavior: smooth;
                }

                body {
                    margin: 0;
                    background: #080b13;
                    font-family: Arial, Helvetica, sans-serif;
                }

                button,
                input,
                select {
                    font: inherit;
                }

                button {
                    cursor: pointer;
                }

                button,
                a,
                input,
                select {
                    -webkit-tap-highlight-color: transparent;
                }

                button:focus-visible,
                a:focus-visible,
                input:focus-visible,
                select:focus-visible {
                    outline: 2px solid #c4b5fd;
                    outline-offset: 4px;
                }

                a,
                button {
                    transition-property:
                        color,
                        background-color,
                        border-color,
                        opacity,
                        box-shadow,
                        transform;
                    transition-duration: 200ms;
                }

                a:active,
                button:active {
                    transform: scale(0.985);
                }

                ::selection {
                    background: #8b5cf6;
                    color: white;
                }

                .rh-scrollbar::-webkit-scrollbar {
                    height: 5px;
                    width: 5px;
                }

                .rh-scrollbar::-webkit-scrollbar-thumb {
                    background: #343b4d;
                    border-radius: 10px;
                }

                /* Portfolio styling stays scoped here; no nested styled-jsx tags. */
                .portfolio-shell {
                    --portfolio-gold: #a78bfa;
                    position: relative;
                    isolation: isolate;
                    background-image:
                        radial-gradient(
                            ellipse at 82% 12%,
                            rgba(167, 139, 250, 0.075),
                            transparent 32%
                        ),
                        radial-gradient(
                            ellipse at 5% 55%,
                            rgba(117, 94, 171, 0.08),
                            transparent 30%
                        );
                }

                .portfolio-shell::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    opacity: 0.15;
                    background-image:
                        linear-gradient(
                            rgba(255, 255, 255, 0.045) 1px,
                            transparent 1px
                        ),
                        linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0.045) 1px,
                            transparent 1px
                        );
                    background-size: 54px 54px;
                    mask-image: linear-gradient(to bottom, black, transparent 70%);
                }

                .portfolio-shell .spotlight {
                    transform: scale(1.025);
                    filter: saturate(0.72) contrast(1.04) brightness(0.78);
                    opacity: 0.72;
                    mix-blend-mode: screen;
                    -webkit-mask-image:
                        linear-gradient(
                            90deg,
                            transparent 0%,
                            rgba(0, 0, 0, 0.28) 13%,
                            #000 36%,
                            #000 78%,
                            transparent 100%
                        ),
                        linear-gradient(
                            0deg,
                            transparent 0%,
                            #000 20%,
                            #000 82%,
                            transparent 100%
                        );
                    mask-image:
                        linear-gradient(
                            90deg,
                            transparent 0%,
                            rgba(0, 0, 0, 0.28) 13%,
                            #000 36%,
                            #000 78%,
                            transparent 100%
                        ),
                        linear-gradient(
                            0deg,
                            transparent 0%,
                            #000 20%,
                            #000 82%,
                            transparent 100%
                        );
                    -webkit-mask-composite: source-in;
                    mask-composite: intersect;
                    transition:
                        transform 1.1s cubic-bezier(0.2, 0.75, 0.2, 1),
                        filter 0.7s ease,
                        opacity 0.7s ease;
                }

                .portfolio-shell:hover .spotlight {
                    transform: scale(1.065) translate3d(-0.4%, 0.4%, 0);
                    filter: saturate(0.92) contrast(1.06) brightness(0.9);
                    opacity: 0.86;
                }

                .portfolio-shell .hero-image-glow {
                    background:
                        radial-gradient(
                            ellipse at 76% 38%,
                            rgba(167, 139, 250, 0.13),
                            transparent 34%
                        ),
                        linear-gradient(
                            90deg,
                            #090d16 0%,
                            rgba(9, 13, 22, 0.96) 20%,
                            rgba(9, 13, 22, 0.74) 38%,
                            rgba(9, 13, 22, 0.12) 68%,
                            rgba(9, 13, 22, 0.22) 100%
                        );
                }

                .portfolio-shell .image-edge-fade {
                    background: linear-gradient(
                        0deg,
                        #090d16 0%,
                        rgba(9, 13, 22, 0.62) 12%,
                        transparent 38%,
                        rgba(9, 13, 22, 0.22) 100%
                    );
                }

                .portfolio-shell .service-card {
                    box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
                    transition:
                        transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1),
                        border-color 0.32s ease,
                        background 0.32s ease,
                        box-shadow 0.32s ease;
                }

                .portfolio-shell .service-card:hover {
                    transform: translateY(-6px);
                    border-color: rgba(167, 139, 250, 0.56);
                    box-shadow:
                        0 22px 55px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(167, 139, 250, 0.04) inset;
                }

                .portfolio-shell .service-card:active {
                    transform: translateY(-2px) scale(0.99);
                }

                .portfolio-shell .magnetic-link {
                    transition:
                        transform 0.24s ease,
                        box-shadow 0.24s ease,
                        background-color 0.24s ease,
                        border-color 0.24s ease,
                        color 0.24s ease;
                }

                .portfolio-shell .magnetic-link:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 36px rgba(167, 139, 250, 0.13);
                }

                .portfolio-shell .reveal-line {
                    transform-origin: left;
                    transition: transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
                }

                .portfolio-shell .principle-row {
                    transition:
                        padding-left 0.25s ease,
                        background-color 0.25s ease;
                }

                .portfolio-shell .principle-row:hover {
                    padding-left: 0.6rem;
                    background: linear-gradient(
                        90deg,
                        rgba(167, 139, 250, 0.045),
                        transparent
                    );
                }

                .portfolio-shell a:focus-visible,
                .portfolio-shell button:focus-visible {
                    outline-color: var(--portfolio-gold);
                }

                @keyframes portfolio-rise {
                    from {
                        opacity: 0;
                        transform: translateY(14px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .portfolio-shell .portfolio-enter {
                    animation: portfolio-rise 0.7s both;
                }

                .portfolio-shell .portfolio-enter-delay {
                    animation: portfolio-rise 0.7s 0.12s both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .portfolio-shell *,
                    .portfolio-shell *::before,
                    .portfolio-shell *::after {
                        animation: none !important;
                        transition-duration: 0.01ms !important;
                        scroll-behavior: auto !important;
                    }
                }
            `}</style>

            <div className="flex min-h-screen w-full items-start gap-4 p-4">
                <aside className="sticky top-4 z-30 hidden h-[calc(100vh-2rem)] w-[240px] min-w-[240px] shrink-0 flex-col overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0b101c] px-1 py-7 lg:flex">
                    <button
                        onClick={() => selectPage("Home")}
                        className="mb-12 flex items-center gap-3 text-left"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                            <Icon name="cube" size={27} />
                        </span>
                        <span className="text-[18px] font-bold tracking-tight">
                            NextCAD<span className="text-violet-400"> Studio</span>
                        </span>
                    </button>

                    <p className="mb-4 px-3 text-[11px] font-semibold tracking-[0.22em] text-slate-500">
                        WORKSPACE
                    </p>

                    <nav className="space-y-2">
                        {[
                            { label: "Home", icon: "home" },
                            { label: "Explore", icon: "explore" },
                            { label: "3D Design", icon: "cube" },
                            { label: "Company Profile", icon: "building-2" },
                            { label: "Creator", icon: "users" },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => selectPage(item.label)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activePage === item.label
                                        ? "bg-[#202b40] font-semibold text-white"
                                        : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                            >
                                <Icon name={item.icon} size={19} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <p className="mb-4 mt-10 px-3 text-[11px] font-semibold tracking-[0.22em] text-slate-500">
                        YOUR LIBRARY
                    </p>

                    <button
                        onClick={() => selectPage("Favorites")}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${activePage === "Favorites"
                                ? "bg-[#202b40] text-white"
                                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                            }`}
                    >
                        <Icon name="heart" size={19} />
                        Favorites
                        <span className="ml-auto text-xs text-violet-300">
                            {favorites.length}
                        </span>
                    </button>

                    <div className="mt-auto rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 to-[#151b2b] p-4">
                        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                            <Icon name="layers" size={23} />
                        </span>
                        <h3 className="font-semibold">Creator Space</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Your next great 3D project starts here.
                        </p>
                        <button
                            onClick={() =>
                                showNotice(
                                    "For collaboration opportunities, please reach out to Creator",
                                    3000
                                )
                            }
                            className="mt-4 w-full rounded-xl bg-violet-600 px-3 py-3 text-sm font-semibold transition hover:bg-violet-500"
                        >
                            Become a Creator
                        </button>
                    </div>

                    <div className="mt-6 flex w-full min-w-0 items-center gap-2 border-t border-white/[0.08] pt-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-700 font-bold">
                            N
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="whitespace-nowrap text-[13px] font-semibold leading-tight tracking-tight">
                                NextCAD Studio
                            </p>
                            <p className="mt-1 text-xs text-slate-500">Guest</p>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080b13]">
                    <header className="sticky top-0 z-20 flex min-h-[62px] flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080b13]/95 px-4 py-2.5 backdrop-blur-xl sm:px-5 lg:px-6 xl:px-8">
                        <button
                            onClick={() => selectPage("Home")}
                            className="flex items-center gap-2 text-lg font-bold lg:hidden"
                        >
                            <span className="text-violet-400">
                                <Icon name="cube" size={25} />
                            </span>
                            NextCAD Studio
                        </button>

                        <label className="flex min-w-[180px] flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#131b2a] px-4 py-3 md:max-w-[600px]">
                            <span className="text-slate-500">
                                <Icon name="search" size={19} />
                            </span>
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search 3D designs, creators, categories..."
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                                aria-label="Cari karya 3D"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="text-slate-400 hover:text-white"
                                    aria-label="Hapus pencarian"
                                >
                                    <Icon name="close" size={17} />
                                </button>
                            )}
                        </label>

                        <Link
                            href="/admin/login"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2.5 text-sm font-semibold text-violet-200 transition hover:border-violet-300/60 hover:bg-violet-500/20 hover:text-white sm:px-4"
                        >
                            👤 Login
                        </Link>
                    </header>

                    <div
                        className={
                            activePage === "Company Profile"
                                ? "w-full px-0 py-0"
                                : "mx-auto max-w-[1600px] px-5 py-7 md:px-8 md:py-9"
                        }
                    >
                        {activePage === "Company Profile" ? (
                            <section className="portfolio-shell relative isolate mx-auto w-full max-w-[1600px] overflow-hidden bg-[#070b13] text-white">
                                {/* HERO */}
                                <section className="portfolio-hero group relative isolate min-h-[286px] overflow-hidden border-b border-white/10 lg:min-h-[286px]">
                                    <Image
                                        src="/images/nextcad-portfolio-hero.jpg"
                                        alt="Rumah modern dengan pencahayaan arsitektur yang hangat"
                                        fill
                                        priority
                                        unoptimized
                                        sizes="(max-width: 768px) 100vw, 1600px"
                                        className="spotlight absolute inset-0 -z-30 object-cover object-center"
                                    />

                                    <div className="hero-image-glow pointer-events-none absolute inset-0 -z-20" />
                                    <div className="image-edge-fade pointer-events-none absolute inset-0 -z-10" />
                                    <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-[#070b13]/90 via-transparent to-[#070b13]/15" />

                                    <div className="portfolio-enter grid min-h-[300px] min-w-0 items-center gap-5 px-4 py-7 sm:px-5 md:grid-cols-[minmax(0,1fr)] lg:min-h-[300px] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] lg:gap-6 lg:px-6 lg:py-6 xl:px-8">
                                        <div className="min-w-0 max-w-[900px]">
                                            <p className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.28em] text-[#a78bfa] sm:text-[11px]">
                                                Company Profile
                                            </p>

                                            <h1 className="max-w-[520px] text-[2rem] font-light leading-[1.02] tracking-[-.045em] sm:text-1xl lg:text-[clamp(2rem,3vw,2.5rem)]">
                                                NextCAD Studio{" "}
                                                <span className="block font-semibold text-[#a78bfa]"> </span>
                                            </h1>

                                            <div className="mt-3 w-full max-w-[850px] space-y-3 text-justify text-[12px] leading-[1.7] text-slate-200 sm:text-[13px] sm:leading-[1.75]">
                                                <p>
                                                    Established in 2025, NextCAD Studio was founded with a vision to transform architectural and design concepts into compelling visual representations that communicate ideas with clarity, precision, and purpose.
                                                </p>
                                                <p>
                                                    We are a design visualization studio specializing in translating creative concepts into refined, detailed, and visually engaging presentations. By combining design expertise, technical precision, and a strong understanding of visual communication, we help bring ideas to life and turn complex concepts into tangible visual experiences.
                                                </p>
                                                <p>
                                                    At NextCAD Studio, we believe that every design begins with an idea, and every idea deserves to be presented with the highest level of professionalism. Our approach goes beyond producing visual representations, we focus on capturing the essence of each project highlighting its unique characteristics and communicating its intended value through thoughtful and impactful visualization.
                                                </p>
                                                <p>
                                                    We work alongside architects, property developers, interior designers, businesses, and private clients to support their creative and professional objectives. Whether presenting an architectural concept, exploring an interior design direction, or preparing visual materials for a business proposal, we strive to deliver results that strengthen communication, support decision-making, and create lasting impressions.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="hidden min-w-0 h-full min-h-[200px] items-start justify-end gap-2 self-stretch pt-10 text-[9px] uppercase tracking-[.2em] text-slate-200/80 md:flex lg:pt-12">
                                            <div className="flex flex-col gap-3 border-l border-white/25 pl-4">
                                                {[
                                                    "Architecture",
                                                    "Interior",
                                                    "3D Visualization",
                                                    "CAD & Modeling",
                                                ].map((label) => (
                                                    <span
                                                        key={label}
                                                        className="transition hover:translate-x-1 hover:text-[#a78bfa]"
                                                    >
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#070b13] to-transparent" />
                                </section>

                                {/* STATS BAR */}
                                <section className="grid grid-cols-1 gap-2 border-b border-white/10 bg-[#080d16]/90 px-3 py-3 sm:grid-cols-3 sm:gap-2 sm:px-5 lg:px-6 xl:px-8">
                                    {[
                                        { icon: "cube", value: "100+", label: "Projects Completed" },
                                        { icon: "users", value: "50+", label: "Happy Clients" },
                                        { icon: "star", value: "5+", label: "Years of Experience" },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="group flex items-center gap-3 rounded-xl px-2 py-1 transition hover:bg-white/[.035]"
                                        >
                                            <span className="flex h-10 w-10 items-center justify-center text-[#a78bfa] transition group-hover:scale-110">
                                                {stat.icon === "star" ? (
                                                    <span className="text-3xl">☆</span>
                                                ) : (
                                                    <Icon name={stat.icon} size={24} />
                                                )}
                                            </span>
                                            <div>
                                                <p className="text-xl font-light leading-none tracking-tight">
                                                    {stat.value}
                                                </p>
                                                <p className="mt-1.5 text-[11px] text-slate-400">
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </section>

                                {/* ABOUT */}
                                <section className="grid min-w-0 items-center gap-6 border-b border-white/[.07] px-4 py-7 sm:px-5 sm:py-8 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-8 lg:px-6 xl:gap-10 xl:px-8">
                                    <div className="max-w-[460px]">
                                        <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#a78bfa]">
                                            Our Vision
                                        </p>
                                        <h2 className="mt-3 text-2xl font-light leading-tight sm:text-3xl">
                                            More than design.
                                            <br />
                                            <span className="font-semibold text-[#a78bfa]">
                                                We create confidence.
                                            </span>
                                        </h2>
                                        <p className="mt-3 text-xs leading-[1.8] text-slate-300 sm:text-[13px]">
                                            To become a trusted design visualization partner recognized for creative excellence, technical precision, and the ability to transform ideas into meaningful visual experiences.
                                        </p>
                                        <a
                                            href="#company-services"
                                            className="magnetic-link mt-4 inline-flex items-center gap-3 rounded-lg border border-[#a78bfa]/60 px-4 py-2.5 text-xs font-medium text-[#c4b5fd] hover:bg-[#a78bfa]/10"
                                        >
                                            Tentang Kami <span>↗</span>
                                        </a>
                                    </div>

                                    <a
                                        href="#company-services"
                                        className="story-image group relative block h-[220px] w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#111722] sm:h-[260px] lg:h-[300px]"
                                        aria-label="Lihat layanan NextCAD Studio"
                                    >
                                        <Image
                                            src="/images/nextcad-portfolio-story.jpg"
                                            alt="Visualisasi bangunan modern dengan material dan pencahayaan hangat"
                                            width={1600}
                                            height={900}
                                            unoptimized
                                            sizes="(max-width: 768px) 100vw, 900px"
                                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] group-hover:saturate-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#080d16]/70 via-[#080d16]/10 to-transparent transition group-hover:from-[#080d16]/50" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#080d16]/55 to-transparent" />
                                        <div className="absolute bottom-5 left-5 flex items-center gap-3 sm:bottom-7 sm:left-7">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#a78bfa] bg-[#080d16]/50 text-lg text-[#c4b5fd] backdrop-blur transition group-hover:scale-110 group-hover:bg-[#a78bfa] group-hover:text-[#10131a]">
                                                ▶
                                            </span>
                                            <span>
                                                <span className="block text-sm font-medium text-white">
                                                    Explore Our Studio
                                                </span>
                                                <span className="mt-1 block text-[10px] text-slate-300">
                                                    Design · Visualization · CAD
                                                </span>
                                            </span>
                                        </div>
                                    </a>
                                </section>

                                {/* SERVICES */}
                                <section
                                    id="company-services"
                                    className="scroll-mt-24 border-b border-white/[.07] px-4 py-5 sm:px-5 lg:px-6 xl:px-8"
                                >
                                    <div className="mb-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                                        <div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#a78bfa]">
                                                Our Expertise
                                            </p>
                                            <h2 className="mt-2 text-2xl font-light leading-tight sm:text-1xl">
                                                Our services focus on delivering comprehensive visual solutions
                                                <br className="hidden sm:block" />
                                            </h2>
                                        </div>
                                        <p className="max-w-sm text-xs leading-6 text-slate-400"> </p>
                                    </div>

                                    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                        {[
                                            {
                                                n: "",
                                                title: "Architectural Visualization",
                                                tag: "ARCHITECTURE",
                                                desc: "Transforming architectural concepts into realistic and compelling visual presentations.",
                                                icon: "⌂",
                                            },
                                            {
                                                n: "",
                                                title: "Interior Design Visualization",
                                                tag: "INTERIOR",
                                                desc: "Presenting interior spaces through detailed compositions, materials, lighting, and spatial elements.",
                                                icon: "▧",
                                            },
                                            {
                                                n: "",
                                                title: "3D Modeling & CAD",
                                                tag: "TECHNICAL DESIGN",
                                                desc: "Developing accurate three-dimensional representations to communicate design intent effectively.",
                                                icon: "⬡",
                                            },
                                            {
                                                n: "",
                                                title: "Product & Concept Visualization",
                                                tag: "PRODUCT / CONCEPT",
                                                desc: "Product concept visualization to make ideas more concrete for presentation purposes.",
                                                icon: "▱",
                                            },
                                        ].map((service) => (
                                            <article
                                                key={service.title}
                                                className="service-card group relative flex min-h-[146px] flex-col overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#111a27] to-[#0a101a] p-4 transition duration-300 hover:-translate-y-1.5 hover:border-[#a78bfa]/60 hover:from-[#192231] hover:to-[#101620] hover:shadow-[0_18px_42px_rgba(0,0,0,.25)] sm:p-5"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#a78bfa]/25 bg-[#a78bfa]/[.06] text-xl text-[#a78bfa] transition group-hover:rotate-3 group-hover:border-[#a78bfa]/70 group-hover:bg-[#a78bfa]/10">
                                                        {service.icon}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] tracking-[.2em] text-slate-500">
                                                            {service.n}
                                                        </p>
                                                        <h3 className="mt-1 text-[13px] font-semibold leading-snug text-slate-100 transition group-hover:text-[#c4b5fd]">
                                                            {service.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <p className="mt-3 flex-1 text-[11px] leading-[1.7] text-slate-400">
                                                    {service.desc}
                                                </p>
                                                <div className="reveal-line absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#a78bfa] to-transparent transition-transform group-hover:scale-x-100" />
                                            </article>
                                        ))}
                                    </div>
                                </section>

                                {/* WHY NEXTCAD */}
                                <section className="grid min-w-0 gap-5 border-b border-white/[.07] px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,.8fr)_minmax(0,2.2fr)] lg:items-center lg:gap-6 lg:px-6 xl:gap-9 xl:px-8">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[.28em] text-[#a78bfa]">
                                            Our Commitment
                                        </p>
                                        <h2 className="mt-3 text-2xl font-light text-justify leading-tight sm:text-3xl">
                                            A thoughtful process.
                                        </h2>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-3 sm:gap-4">
                                        {[
                                            {
                                                icon: "☷",
                                                title: "Client-Focused Collaboration",
                                                desc: "We prioritize clear communication and a thorough understanding of project requirements from the very beginning to ensure seamless execution.",
                                            },
                                            {
                                                icon: "✳",
                                                title: "Detail-Oriented Execution",
                                                desc: "We carefully consider proportion, composition, materials, and visual presentation.",
                                            },
                                            {
                                                icon: "▣",
                                                title: "Professional Presentation",
                                                desc: "We transform complex concepts into clear, actionable insights for teams and clients.",
                                            },
                                        ].map((item) => (
                                            <article
                                                key={item.title}
                                                className="group flex gap-3 rounded-xl p-2 transition hover:bg-white/[.035]"
                                            >
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[.08] bg-[#101722] text-xl text-[#a78bfa] transition group-hover:border-[#a78bfa]/40 group-hover:bg-[#a78bfa]/10">
                                                    {item.icon}
                                                </span>
                                                <div>
                                                    <h3 className="text-xs font-semibold leading-5 text-slate-100 transition group-hover:text-[#c4b5fd]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1.5 text-[10px] leading-[1.7] text-slate-400">
                                                        {item.desc}
                                                    </p>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                </section>

                                {/* CONTACT */}
                                <section
                                    id="contact"
                                    className="mx-4 my-5 flex min-w-0 flex-col items-center justify-center gap-4 rounded-xl border border-[#a78bfa]/20 bg-gradient-to-r from-[#171b24] via-[#101722] to-[#0b1019] p-5 text-center sm:mx-5 sm:p-6 lg:mx-6 xl:mx-8"
                                >
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[.25em] text-[#a78bfa]"></p>
                                        <h2 className="mt-2 text-xl font-light sm:text-2xl">
                                            Are you looking to turn your ideas into action?
                                        </h2>
                                        <p className="mt-1 text-xs leading-5 text-slate-400">
                                            Let&apos;s begin with a brief discussion regarding your requirements.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            selectPage("Creator");
                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        className="magnetic-link inline-flex items-center justify-center rounded-lg bg-[#a78bfa] px-7 py-3 text-xs font-extrabold text-[#111318] shadow-[0_0_12px_rgba(167,139,250,0.15)] transition-all duration-300 hover:bg-[#c4b5fd] hover:text-white hover:shadow-[0_0_12px_rgba(196,181,253,0.8),0_0_28px_rgba(167,139,250,0.65),0_0_45px_rgba(167,139,250,0.35)]"
                                    >
                                        Start a Project
                                    </button>
                                </section>

                                <footer className="flex flex-col gap-2 border-t border-white/[.08] px-4 py-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6 xl:px-8">
                                    <p className="font-semibold tracking-wide text-slate-300">
                                        <span className="font-normal text-slate-500"> </span>
                                    </p>
                                    <p>NextCAD Studio © 2025</p>
                                </footer>
                            </section>
                        ) : activePage === "Creator" ? (
                            <section className="rounded-3xl border border-white/10 bg-[#0b101c] p-6 sm:p-10">
                                <p className="text-xs font-semibold tracking-[0.25em] text-violet-300"></p>
                                <h1 className="mt-4 text-3xl font-semibold sm:text-3xl">
                                    Creator<span className="text-violet-300"></span>
                                </h1>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                                    Contact us today for expert consultations and tailored 3D design solutions.
                                </p>

                                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {Array.from(
                                        new Set(projects.map((project) => project.creator))
                                    ).map((creator) => (
                                        <article
                                            key={creator}
                                            className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-white/[0.09] bg-gradient-to-b from-[#151b2b] to-[#0d1220] p-7 text-center"
                                        >
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#211b3c] text-3xl font-semibold text-violet-200">
                                                {creator.charAt(0).toUpperCase()}
                                            </div>
                                            <h2 className="mt-5 text-xl font-semibold">
                                                {creator}
                                            </h2>
                                            <p className="mt-2 text-xs tracking-wide text-slate-500">
                                                3D ARTIST &amp; DESIGNER
                                            </p>
                                            <a
                                                href={whatsappUrl(
                                                    `Halo NextCAD Studio, saya tertarik dengan karya ${creator}. Saya ingin bertanya tentang jasa desain 3D.`
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20"
                                            >
                                                Chat via WhatsApp
                                            </a>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <>
                                {activePage === "Home" && (
                                    <section className="relative isolate min-h-[400px] overflow-hidden rounded-[24px] border border-white/10 bg-[#151a2b] md:min-h-[470px]">
                                        <Image
                                            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=90"
                                            alt="Interior modern sebagai inspirasi visual 3D"
                                            fill
                                            sizes="(max-width: 768px) 100vw, 1600px"
                                            unoptimized
                                            priority
                                            className="absolute inset-0 -z-20 object-cover"
                                        />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#080b13] via-[#080b13]/90 to-[#080b13]/25" />
                                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080b13]/70 to-transparent" />

                                        <div className="flex min-h-[400px] max-w-3xl flex-col justify-center p-7 sm:p-10 md:min-h-[470px] md:p-12">
                                            <span className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-medium tracking-wide text-violet-200">
                                                ✦ YOUR CREATIVE UNIVERSE
                                            </span>

                                            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
                                                Discover &amp; Share
                                                <span className="mt-1 block text-violet-300">
                                                    3D Creations.
                                                </span>
                                            </h1>

                                            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                                                Explore inspiring 3D artwork, discover talented creators, and find your next creative inspiration.
                                            </p>

                                            <form
                                                onSubmit={(event) => {
                                                    event.preventDefault();
                                                    document
                                                        .getElementById("gallery")
                                                        ?.scrollIntoView({ behavior: "smooth" });
                                                }}
                                                className="mt-7 flex max-w-[550px] items-center gap-2 rounded-xl border border-white/15 bg-[#0b101c]/80 p-2 backdrop-blur-md"
                                            >
                                                <span className="pl-2 text-slate-400">
                                                    <Icon name="search" size={20} />
                                                </span>
                                                <input
                                                    value={search}
                                                    onChange={(event) =>
                                                        setSearch(event.target.value)
                                                    }
                                                    placeholder="Find your inspiration..."
                                                    className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-slate-400"
                                                    aria-label="Cari inspirasi"
                                                />
                                                <button
                                                    type="submit"
                                                    className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                                                >
                                                    Search
                                                </button>
                                            </form>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {["Architecture", "Product Design", "Interior"].map(
                                                    (category) => (
                                                        <button
                                                            key={category}
                                                            onClick={() => {
                                                                setActiveCategory(category);
                                                                document
                                                                    .getElementById("gallery")
                                                                    ?.scrollIntoView({
                                                                        behavior: "smooth",
                                                                    });
                                                            }}
                                                            className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-xs text-slate-200 hover:border-violet-400/50 hover:bg-violet-500/15"
                                                        >
                                                            {category}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                <section
                                    id="gallery"
                                    className={`${activePage === "Home" ? "mt-10" : ""} scroll-mt-28`}
                                >
                                    <div className="flex flex-wrap items-end justify-between gap-4">
                                        <div>
                                            <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-violet-300">
                                                {activePage === "Favorites"
                                                    ? "YOUR COLLECTION"
                                                    : "FRESH INSPIRATION"}
                                            </p>
                                            <h2 className="text-2xl font-bold sm:text-3xl">
                                                {activePage === "Favorites"
                                                    ? "Your Favorites"
                                                    : activePage === "3D Design"
                                                        ? "3D Design"
                                                        : activePage === "Explore"
                                                            ? "Explore Projects"
                                                            : "Latest Projects"}
                                            </h2>
                                            <p className="mt-2 text-sm text-slate-400">
                                                Discover artwork from the creative community.
                                            </p>
                                        </div>

                                        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-sm text-slate-300">
                                            <Icon name="sliders" size={17} />
                                            <select
                                                value={sortBy}
                                                onChange={(event) =>
                                                    setSortBy(event.target.value)
                                                }
                                                className="max-w-[125px] bg-transparent outline-none"
                                                aria-label="Urutkan proyek"
                                            >
                                                <option className="bg-[#111827]" value="Featured">
                                                    Featured
                                                </option>
                                                <option className="bg-[#111827]" value="Most Liked">
                                                    Most Liked
                                                </option>
                                                <option className="bg-[#111827]" value="A–Z">
                                                    A–Z
                                                </option>
                                            </select>
                                        </label>
                                    </div>

                                    <div className="rh-scrollbar mt-6 flex gap-2 overflow-x-auto pb-3">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-medium transition ${activeCategory === category
                                                        ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                                                        : "border-white/10 bg-[#111827] text-slate-400 hover:border-white/20 hover:text-white"
                                                    }`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                                        <span>
                                            {filteredProjects.length}{" "}
                                            {filteredProjects.length === 1
                                                ? "project"
                                                : "projects"}
                                        </span>
                                        {search && (
                                            <button
                                                onClick={() => setSearch("")}
                                                className="text-violet-300 hover:text-violet-200"
                                            >
                                                Clear search
                                            </button>
                                        )}
                                    </div>

                                    {filteredProjects.length ? (
                                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                            {filteredProjects.map((project) => {
                                                const isFavorite = favorites.includes(
                                                    project.id
                                                );

                                                return (
                                                    <article
                                                        key={project.id}
                                                        id={`project-${project.id}`}
                                                        className="group min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101725] transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 hover:shadow-xl hover:shadow-black/20"
                                                    >
                                                        <div className="relative overflow-hidden">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedProject(project)
                                                                }
                                                                className="block w-full text-left"
                                                                aria-label={`Lihat ${project.title}`}
                                                            >
                                                                <Image
                                                                    src={project.image}
                                                                    alt={project.title}
                                                                    width={1200}
                                                                    height={900}
                                                                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                                                                    unoptimized
                                                                    className="aspect-[4/3] w-full object-cover object-center transition duration-500 group-hover:scale-105"
                                                                />
                                                            </button>

                                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

                                                            <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur">
                                                                {project.category}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    toggleFavorite(project.id)
                                                                }
                                                                aria-label={
                                                                    isFavorite
                                                                        ? "Hapus dari favorit"
                                                                        : "Tambahkan ke favorit"
                                                                }
                                                                aria-pressed={isFavorite}
                                                                className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition ${isFavorite
                                                                        ? "bg-violet-600 text-white"
                                                                        : "bg-black/45 text-white hover:bg-violet-600"
                                                                    }`}
                                                            >
                                                                <Icon
                                                                    name="heart"
                                                                    size={19}
                                                                    filled={isFavorite}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="p-4">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedProject(project)
                                                                }
                                                                className="block w-full truncate text-left font-semibold text-slate-100 hover:text-violet-300"
                                                            >
                                                                {project.title}
                                                            </button>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                by {project.creator}
                                                            </p>

                                                            <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3">
                                                                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                                                    <Icon name="heart" size={15} />
                                                                    {project.likes +
                                                                        (isFavorite ? 1 : 0)}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        setSelectedProject(project)
                                                                    }
                                                                    className="flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200"
                                                                >
                                                                    View project
                                                                    <Icon name="arrow" size={15} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="mt-6 rounded-2xl border border-dashed border-white/15 px-5 py-16 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
                                                <Icon name="search" size={25} />
                                            </div>
                                            <h3 className="mt-4 text-lg font-semibold">
                                                No projects found
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-400">
                                                Coba kata kunci atau kategori yang berbeda.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setSearch("");
                                                    setActiveCategory("All Projects");

                                                    if (activePage === "Favorites") {
                                                        setActivePage("Home");
                                                    }
                                                }}
                                                className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                                            >
                                                Reset filters
                                            </button>
                                        </div>
                                    )}
                                </section>

                                <footer className="mt-14 flex flex-col gap-3 border-t border-white/[0.08] py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                                    <p> </p>
                                    <p>Designed for artists, creators, and dreamers.</p>
                                </footer>
                            </>
                        )}
                    </div>
                </section>
            </div>

            {selectedProject && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedProject(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="project-title"
                        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#101725] shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="relative">
                            <Image
                                src={selectedProject.image}
                                alt={selectedProject.title}
                                width={1600}
                                height={900}
                                sizes="(max-width: 768px) 100vw, 768px"
                                unoptimized
                                className="aspect-[16/9] max-h-[55vh] w-full object-cover object-center"
                            />
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white hover:bg-black"
                                aria-label="Tutup detail"
                            >
                                <Icon name="close" size={20} />
                            </button>
                        </div>

                        <div className="p-6 sm:p-8">
                            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs text-violet-200">
                                {selectedProject.category}
                            </span>

                            <h2
                                id="project-title"
                                className="mt-4 text-2xl font-bold sm:text-3xl"
                            >
                                {selectedProject.title}
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Created by {selectedProject.creator}
                            </p>

                            <p className="mt-5 text-sm leading-7 text-slate-300">
                                {selectedProject.description}
                            </p>

                            <div className="mt-5 rounded-xl border border-white/[0.08] bg-[#0b101c] p-4">
                                <p className="text-xs text-slate-500">
                                    TOOLS &amp; SOFTWARE
                                </p>
                                <p className="mt-2 text-sm text-slate-200">
                                    {selectedProject.software}
                                </p>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    onClick={() =>
                                        toggleFavorite(selectedProject.id)
                                    }
                                    className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium hover:bg-white/[0.05]"
                                >
                                    <Icon
                                        name="heart"
                                        size={18}
                                        filled={favorites.includes(selectedProject.id)}
                                    />
                                    {favorites.includes(selectedProject.id)
                                        ? "Saved to favorites"
                                        : "Add to favorites"}
                                </button>

                                <button
                                    onClick={() => shareProject(selectedProject)}
                                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold hover:bg-violet-500"
                                >
                                    <Icon name="share" size={17} />
                                    Share project
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl border border-violet-400/20 bg-[#171c2d] px-5 py-4 text-sm text-white shadow-xl"
                >
                    {notice}
                </div>
            )}
        </main>
    );
}