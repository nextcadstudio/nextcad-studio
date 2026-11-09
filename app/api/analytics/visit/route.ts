import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VisitBody = {
    visitorId?: unknown;
    sessionId?: unknown;
    pagePath?: unknown;
};

function jsonError(message: string, status: number) {
    return NextResponse.json(
        { success: false, error: message },
        { status }
    );
}

export async function POST(request: NextRequest) {
    try {
        // Tangani body kosong atau JSON rusak dengan aman.
        let body: VisitBody;

        try {
            const rawBody = await request.text();

            if (!rawBody.trim()) {
                return jsonError("Body request kosong.", 400);
            }

            body = JSON.parse(rawBody) as VisitBody;

            if (!body || typeof body !== "object" || Array.isArray(body)) {
                return jsonError("Format body tidak valid.", 400);
            }
        } catch {
            return jsonError("Body harus berupa JSON yang valid.", 400);
        }

        const visitorId =
            typeof body.visitorId === "string" ? body.visitorId : "";

        const sessionId =
            typeof body.sessionId === "string" ? body.sessionId : "";

        const pagePath =
            typeof body.pagePath === "string" ? body.pagePath : "";

        if (
            visitorId.length < 10 ||
            visitorId.length > 100 ||
            sessionId.length < 10 ||
            sessionId.length > 100 ||
            !pagePath.startsWith("/") ||
            pagePath.length > 500
        ) {
            return jsonError("Data kunjungan tidak valid.", 400);
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            console.error(
                "[Analytics] NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diatur."
            );

            return jsonError(
                "Konfigurasi Supabase server belum lengkap.",
                500
            );
        }

        const supabase = createSupabaseClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        // Satu sesi hanya mencatat satu kunjungan per halaman.
        const { data: existing, error: lookupError } = await supabase
            .from("website_visits")
            .select("id")
            .eq("session_id", sessionId)
            .eq("page_path", pagePath)
            .limit(1);

        if (lookupError) {
            console.error(
                "[Analytics] Gagal memeriksa duplikasi:",
                lookupError.code,
                lookupError.message
            );

            return jsonError("Gagal memeriksa data kunjungan.", 500);
        }

        if (existing && existing.length > 0) {
            return NextResponse.json({
                success: true,
                duplicate: true,
            });
        }

        const { error: insertError } = await supabase
            .from("website_visits")
            .insert({
                visitor_id: visitorId,
                session_id: sessionId,
                page_path: pagePath,
            });

        if (insertError) {
            if (insertError.code === "23505") {
                return NextResponse.json({
                    success: true,
                    duplicate: true,
                });
            }

            console.error(
                "[Analytics] Gagal menyimpan kunjungan:",
                insertError.code,
                insertError.message
            );

            return jsonError("Gagal menyimpan kunjungan.", 500);
        }

        return NextResponse.json({
            success: true,
            duplicate: false,
        });
    } catch (error) {
        console.error("[Analytics] Kesalahan endpoint:", error);

        return jsonError("Terjadi kesalahan server.", 500);
    }
}