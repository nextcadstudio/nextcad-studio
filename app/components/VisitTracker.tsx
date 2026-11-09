"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getOrCreateId(storage: Storage, key: string): string {
    const existing = storage.getItem(key);

    if (existing) return existing;

    const id = crypto.randomUUID();
    storage.setItem(key, id);

    return id;
}

export default function VisitTracker() {
    const pathname = usePathname();
    const lastSentPath = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname) return;

        // Jangan catat halaman admin.
        if (
            pathname === "/admin" ||
            pathname.startsWith("/admin/")
        ) {
            return;
        }

        // Path ini sudah berhasil dicatat.
        if (lastSentPath.current === pathname) return;

        let visitorId: string;
        let sessionId: string;

        try {
            visitorId = getOrCreateId(
                localStorage,
                "renderhub_visitor_id"
            );

            sessionId = getOrCreateId(
                sessionStorage,
                "renderhub_session_id"
            );
        } catch (error) {
            console.error(
                "[Analytics] Gagal membuat ID:",
                error
            );
            return;
        }

        let cancelled = false;

        const pagePath = pathname;

        async function sendVisit() {
            try {
                const response = await fetch(
                    "/api/analytics/visit",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            visitorId,
                            sessionId,
                            pagePath,
                        }),
                        keepalive: true,
                    }
                );

                const rawResponse = await response.text();

                let result: {
                    success?: boolean;
                    error?: string;
                } | null = null;

                if (rawResponse.trim()) {
                    try {
                        result = JSON.parse(rawResponse);
                    } catch {
                        throw new Error(
                            "Server mengirim respons JSON yang tidak valid."
                        );
                    }
                }

                if (!response.ok || result?.success !== true) {
                    throw new Error(
                        result?.error ||
                        `HTTP ${response.status}`
                    );
                }

                // Tandai hanya setelah server mengonfirmasi sukses.
                if (!cancelled) {
                    lastSentPath.current = pagePath;
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        "[Analytics] Gagal mencatat:",
                        error
                    );
                }
            }
        }

        void sendVisit();

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    return null;
}