
"use client";

import { useCallback, useEffect, useState } from "react";

type Day = {
    date: string;
    label: string;
    visits: number;
    unique: number;
};

type Stats = {
    days: Day[];
    total: number;
    unique: number;
    updatedAt: string;
};

export default function AnalyticsChart() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadStats = useCallback(async () => {
        setRefreshing(true);

        try {
            const response = await fetch("/api/analytics/stats", {
                method: "GET",
                cache: "no-store",
                headers: {
                    Accept: "application/json",
                },
            });

            const rawResponse = await response.text();

            let result: unknown = null;

            if (rawResponse.trim()) {
                try {
                    result = JSON.parse(rawResponse);
                } catch {
                    throw new Error(
                        "Server mengirim respons JSON yang tidak valid."
                    );
                }
            } else {
                throw new Error(
                    `Server mengirim respons kosong (HTTP ${response.status}).`
                );
            }

            if (!response.ok) {
                const serverError =
                    result &&
                        typeof result === "object" &&
                        "error" in result &&
                        typeof result.error === "string"
                        ? result.error
                        : `Gagal memuat statistik (HTTP ${response.status}).`;

                throw new Error(serverError);
            }

            if (!result || typeof result !== "object") {
                throw new Error("Format data statistik tidak valid.");
            }

            const data = result as Record<string, unknown>;

            if (
                !Array.isArray(data.days) ||
                typeof data.total !== "number" ||
                typeof data.unique !== "number" ||
                typeof data.updatedAt !== "string"
            ) {
                throw new Error("Format data statistik tidak sesuai.");
            }

            const validDays = data.days.every(
                (day: unknown) => {
                    if (!day || typeof day !== "object") return false;

                    const item = day as Record<string, unknown>;

                    return (
                        typeof item.date === "string" &&
                        typeof item.label === "string" &&
                        typeof item.visits === "number" &&
                        typeof item.unique === "number"
                    );
                }
            );

            if (!validDays) {
                throw new Error("Format data grafik tidak valid.");
            }

            setStats(result as Stats);
            setError("");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Gagal memuat statistik."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        void loadStats();

        const timer = window.setInterval(() => {
            void loadStats();
        }, 30000);

        return () => window.clearInterval(timer);
    }, [loadStats]);

    const maxVisits = Math.max(
        1,
        ...(stats?.days.map((day) => day.visits) ?? [])
    );

    return (
        <section className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#101726] p-6">
                    <p className="text-sm text-slate-400">
                        Total Visitors
                    </p>

                    <p className="mt-3 text-4xl font-bold text-white">
                        {stats?.total ?? "—"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500"> </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#101726] p-6">
                    <p className="text-sm text-slate-400">
                        Unique Visitors
                    </p>

                    <p className="mt-3 text-4xl font-bold text-violet-300">
                        {stats?.unique ?? "—"}
                    </p>

                    <p className="mt-2 text-xs text-slate-500"> </p>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101726] p-6 md:p-8">
                <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Traffic Overview
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Past 7 days website analytics
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => void loadStats()}
                        disabled={refreshing}
                        className="rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-xs text-violet-200 transition hover:bg-violet-400/20 disabled:opacity-50"
                    >
                        {refreshing
                            ? "Synchronizing..."
                            : "↻ Refresh"}
                    </button>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300"
                    >
                        {error}

                        <button
                            type="button"
                            onClick={() => void loadStats()}
                            className="ml-2 underline"
                        >
                            Coba lagi
                        </button>
                    </div>
                )}

                {loading && !stats ? (
                    <p className="py-16 text-center text-slate-400">
                        Loading visit data
                    </p>
                ) : stats ? (
                    <>
                        <div className="flex h-72 items-end gap-2 border-b border-white/10 pb-3 sm:gap-5">
                            {stats.days.map((day) => {
                                const height =
                                    day.visits > 0
                                        ? Math.max(
                                            5,
                                            (day.visits / maxVisits) * 100
                                        )
                                        : 0;

                                return (
                                    <div
                                        key={day.date}
                                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <span className="text-xs font-medium text-slate-200">
                                            {day.visits}
                                        </span>

                                        <div className="flex h-[75%] w-full items-end justify-center">
                                            <div
                                                title={`${day.visits} kunjungan`}
                                                className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-400 transition-all duration-500"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>

                                        <span className="text-center text-[10px] text-slate-400 sm:text-xs">
                                            {day.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {stats.days.every(
                            (day) => day.visits === 0
                        ) && (
                                <p className="mt-4 text-center text-sm text-slate-500">
                                    No visits found within this date range
                                </p>
                            )}

                        <div className="mt-5 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                            <span>
                                Data successfully stored in Supabase
                            </span>

                            <span>
                                Updated at{" "}
                                {new Date(
                                    stats.updatedAt
                                ).toLocaleTimeString("id-ID")}
                            </span>
                        </div>
                    </>
                ) : (
                    <p className="py-12 text-center text-slate-400">
                        Data statistik belum tersedia.
                    </p>
                )}
            </div>
        </section>
    );
}