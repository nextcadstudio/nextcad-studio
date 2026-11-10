import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
    return NextResponse.json(
        { success: false, error: message },
        { status }
    );
}

function validateShortUrl(value: unknown): string | null {
    if (typeof value !== "string") return null;

    try {
        const parsed = new URL(value);

        // Terima domain HTTPS yang dikembalikan API SafelinkEarn.
        // Tidak membatasi hostname karena domain shortener dapat berbeda.
        if (
            parsed.protocol !== "https:" ||
            !parsed.hostname ||
            parsed.username ||
            parsed.password
        ) {
            return null;
        }

        return parsed.toString();
    } catch {
        return null;
    }
}

// GET: Mengambil semua Safelink
export async function GET() {
    try {
        const { supabase } = await requireAdmin();

        const { data, error } = await supabase
            .from("safelink_links")
            .select(
                "id, original_url, shortened_url, alias, is_active, created_at"
            )
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Safelink GET:", error);
            return jsonError("Failed to retrieve the Safelink list", 500);
        }

        return NextResponse.json({
            success: true,
            data: data ?? [],
        });
    } catch (error) {
        console.error("Safelink GET error:", error);
        return jsonError("Administrator access is required", 401);
    }
}

// POST: Membuat shortlink SafelinkEarn
export async function POST(request: NextRequest) {
    try {
        const { supabase } = await requireAdmin();

        const body = await request.json();

        const url =
            typeof body.url === "string" ? body.url.trim() : "";

        const alias =
            typeof body.alias === "string" ? body.alias.trim() : "";

        if (!url) {
            return jsonError("Please enter a destination URL");
        }

        if (alias.length > 80) {
            return jsonError("Alias maximum 80 characters");
        }

        let destination: URL;

        try {
            destination = new URL(url);
        } catch {
            return jsonError("Invalid URL format");
        }

        if (
            !["http:", "https:"].includes(destination.protocol) ||
            destination.username ||
            destination.password
        ) {
            return jsonError("The URL must use HTTP or HTTPS");
        }

        const token = process.env.SAFELINKEARN_API_TOKEN;

        if (!token) {
            return jsonError(
                "SAFELINKEARN_API_TOKEN belum diatur di .env.local",
                500
            );
        }

        // Membuat request ke SafelinkEarn
        const apiUrl = new URL("https://safelinkearn.com/api");

        apiUrl.searchParams.set("api", token);
        apiUrl.searchParams.set("url", destination.toString());

        if (alias) {
            apiUrl.searchParams.set("alias", alias);
        }

        const response = await fetch(apiUrl.toString(), {
            method: "GET",
            cache: "no-store",
            signal: AbortSignal.timeout(20000),
        });

        if (!response.ok) {
            console.error(
                "SafelinkEarn HTTP error:",
                response.status
            );

            return jsonError(
                "SafelinkEarn API failed to respond",
                502
            );
        }

        let result: {
            status?: string;
            shortenedUrl?: string;
        };

        try {
            result = await response.json();
        } catch {
            return jsonError(
                "Response from SafelinkEarn is not a valid JSON",
                502
            );
        }

        if (result.status !== "success") {
            console.error("SafelinkEarn response:", result);

            return jsonError(
                "SafelinkEarn failed to generate the shortlink, please verify your API Token and destination URL",
                502
            );
        }

        // Validasi URL hasil dari SafelinkEarn
        const shortenedUrl = validateShortUrl(
            result.shortenedUrl
        );

        if (!shortenedUrl) {
            console.error(
                "Invalid SafelinkEarn URL",
                result.shortenedUrl
            );

            return jsonError(
                "SafelinkEarn returned an invalid shortlink",
                502
            );
        }

        // Simpan ke Supabase
        const { data, error } = await supabase
            .from("safelink_links")
            .insert({
                original_url: destination.toString(),
                shortened_url: shortenedUrl,
                alias: alias || null,
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            console.error("Safelink database insert:", error);

            return jsonError(
                "The shortlink was created successfully, but failed to save to Supabase",
                500
            );
        }

        return NextResponse.json({
            success: true,
            message: "Safelink successfully created",
            data,
        });
    } catch (error) {
        console.error("Safelink POST error:", error);

        return jsonError(
            "Failed to create Safelink",
            500
        );
    }
}

// PATCH: Mengaktifkan atau menonaktifkan Safelink
export async function PATCH(request: NextRequest) {
    try {
        const { supabase } = await requireAdmin();

        const body = await request.json();

        const { id, is_active } = body;

        if (
            typeof id !== "string" ||
            typeof is_active !== "boolean"
        ) {
            return jsonError("Invalid link ID or status");
        }

        const { data, error } = await supabase
            .from("safelink_links")
            .update({ is_active })
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) {
            console.error("Safelink PATCH:", error);
            return jsonError("Failed to update link status", 500);
        }

        if (!data) {
            return jsonError("Link not found", 404);
        }

        return NextResponse.json({
            success: true,
            message: "Safelink status successfully updated",
            data,
        });
    } catch (error) {
        console.error("Safelink PATCH error:", error);
        return jsonError("Administrator access is required", 401);
    }
}

// DELETE: Menghapus Safelink dari Supabase
export async function DELETE(request: NextRequest) {
    try {
        const { supabase } = await requireAdmin();

        const body = await request.json();

        if (typeof body.id !== "string") {
            return jsonError("Invalid link ID");
        }

        const { data, error } = await supabase
            .from("safelink_links")
            .delete()
            .eq("id", body.id)
            .select("id")
            .maybeSingle();

        if (error) {
            console.error("Safelink DELETE:", error);
            return jsonError("Failed to remove link", 500);
        }

        if (!data) {
            return jsonError("Link not found", 404);
        }

        return NextResponse.json({
            success: true,
            message: "Safelink has been successfully removed",
        });
    } catch (error) {
        console.error("Safelink DELETE error:", error);
        return jsonError("Administrator access is required", 401);
    }
}