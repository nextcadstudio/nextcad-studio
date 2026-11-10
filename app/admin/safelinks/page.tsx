"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Safelink = {
    id: string;
    original_url: string;
    shortened_url: string;
    alias: string | null;
    is_active: boolean;
    created_at: string;
};

export default function SafelinkManagerPage() {
    const [links, setLinks] = useState<Safelink[]>([]);
    const [url, setUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState("");

    // Load links without calling setState synchronously in an effect
    const loadLinks = useCallback(async () => {
        const response = await fetch("/api/safelink", {
            cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Failed to retrieve data");
        }

        setLinks(result.data || []);
    }, []);

    // Initial data fetching
    useEffect(() => {
        let cancelled = false;

        async function fetchInitialLinks() {
            try {
                const response = await fetch("/api/safelink", {
                    cache: "no-store",
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || "Failed to retrieve data"
                    );
                }

                if (!cancelled) {
                    setLinks(result.data || []);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to retrieve data"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchInitialLinks();

        return () => {
            cancelled = true;
        };
    }, []);

    // Refresh links manually
    const refreshLinks = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            await loadLinks();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to retrieve data"
            );
        } finally {
            setLoading(false);
        }
    }, [loadLinks]);

    // Generate Safelink
    async function generateLink(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setGenerating(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/safelink", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: url.trim(),
                    alias: alias.trim() || undefined,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to generate Safelink"
                );
            }

            setMessage("Safelink successfully created");
            setUrl("");
            setAlias("");

            await loadLinks();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setGenerating(false);
        }
    }

    // Activate / Deactivate
    async function toggleLink(link: Safelink) {
        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/safelink", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: link.id,
                    is_active: !link.is_active,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to update status"
                );
            }

            await loadLinks();

            setMessage("Link status successfully updated");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update status"
            );
        }
    }

    // Delete Safelink
    async function deleteLink(id: string) {
        const confirmed = window.confirm(
            "Please confirm if you wish to delete this link"
        );

        if (!confirmed) return;

        setError("");
        setMessage("");

        try {
            const response = await fetch("/api/safelink", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to remove link"
                );
            }

            await loadLinks();

            setMessage("Link successfully removed");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to remove link"
            );
        }
    }

    // Copy Safelink
    async function copyLink(link: string) {
        try {
            await navigator.clipboard.writeText(link);

            setCopied(link);

            window.setTimeout(() => {
                setCopied((current) =>
                    current === link ? "" : current
                );
            }, 2000);
        } catch {
            setError("Failed to copy the link");
        }
    }

    const activeCount = links.filter(
        (link) => link.is_active
    ).length;

    return (
        <main className="admin-protected min-h-screen space-y-8 text-white">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/admin"
                        className="text-sm text-violet-300 transition hover:text-violet-200"
                    >
                        Back to Dashboard
                    </Link>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight">
                        Safelink Manager
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        Manage your external monetized links.
                    </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Live Data
                </span>
            </header>

            <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-5">
                    <p className="text-sm text-slate-400">
                        Total Links
                    </p>
                    <p className="mt-3 text-3xl font-bold">
                        {links.length}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-5">
                    <p className="text-sm text-slate-400">
                        Active Links
                    </p>
                    <p className="mt-3 text-3xl font-bold text-emerald-400">
                        {activeCount}
                    </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-5">
                    <p className="text-sm text-slate-400">
                        Inactive Links
                    </p>
                    <p className="mt-3 text-3xl font-bold text-amber-400">
                        {links.length - activeCount}
                    </p>
                </div>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-6">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold">
                        Generate Safelink
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Enter an external URL to monetize it through SafelinkEarn.
                    </p>
                </div>

                <form onSubmit={generateLink} className="space-y-5">
                    <label className="block text-sm text-slate-300">
                        Destination URL

                        <input
                            type="url"
                            required
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/download/file.zip"
                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        Custom Alias

                        <span className="ml-2 text-xs text-slate-500">
                            Optional
                        </span>

                        <input
                            type="text"
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            placeholder="NextCAD Studio"
                            maxLength={80}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#080b14] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400"
                        />
                    </label>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300"
                        >
                            {error}
                        </div>
                    )}

                    {message && (
                        <div
                            role="status"
                            className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-300"
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={generating}
                        className="w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {generating
                            ? "Generating..."
                            : "Generate Safelink"}
                    </button>
                </form>
            </section>

            <section className="rounded-2xl border border-white/[0.08] bg-[#0e111b] p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Your Safelink
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Manage generated external links.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void refreshLinks()}
                        disabled={loading}
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "↻ Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 text-center text-sm text-slate-500">
                        Loading Safelink...
                    </div>
                ) : links.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 px-5 py-12 text-center">
                        <div className="text-3xl">🔗</div>

                        <h3 className="mt-4 font-semibold">
                            No Safelink Yet
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Generate your first monetized external link above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {links.map((link) => (
                            <article
                                key={link.id}
                                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-sm font-semibold">
                                        {link.alias || "Safelink"}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${link.is_active
                                                ? "bg-emerald-400/10 text-emerald-300"
                                                : "bg-amber-400/10 text-amber-300"
                                            }`}
                                    >
                                        {link.is_active ? "Active" : "Inactive"}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Original URL
                                        </p>

                                        <p className="mt-1 break-all text-sm text-slate-300">
                                            {link.original_url}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Safelink URL
                                        </p>

                                        <a
                                            href={link.shortened_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block break-all text-sm text-violet-300 hover:text-violet-200"
                                        >
                                            {link.shortened_url}
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                                    <button
                                        type="button"
                                        onClick={() => void copyLink(link.shortened_url)}
                                        className="rounded-lg bg-violet-500/15 px-3 py-2 text-xs font-medium text-violet-300 transition hover:bg-violet-500/25"
                                    >
                                        {copied === link.shortened_url
                                            ? "Copied!"
                                            : "Copy Link"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => void toggleLink(link)}
                                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/5"
                                    >
                                        {link.is_active
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => void deleteLink(link.id)}
                                        className="rounded-lg border border-rose-400/20 px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-400/10"
                                    >
                                        Delete
                                    </button>
                                </div>

                                <p className="mt-3 text-xs text-slate-600">
                                    Created :{" "}
                                    {new Date(link.created_at).toLocaleString("id-ID")}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <footer className="border-t border-white/[0.07] pt-5 text-xs text-slate-600">
                NextCAD Studio · Safelink Manager
            </footer>
        </main>
    );
}