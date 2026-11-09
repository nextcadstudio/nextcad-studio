import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/admin";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TIME_ZONE = "Asia/Jakarta";
const PAGE_SIZE = 1000;

function getJakartaDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

    return `${get("year")}-${get("month")}-${get("day")}`;
}

function getJakartaStartOfDay(dateKey: string): Date {
  // Jakarta menggunakan UTC+7.
    return new Date(`${dateKey}T00:00:00+07:00`);
}

export async function GET() {
  try {
    await requireAdmin();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error("Analytics: Konfigurasi Supabase server belum lengkap.");

      return NextResponse.json(
        { error: "Konfigurasi Supabase server belum lengkap." },
        { status: 500 }
      );
    }

    const supabase = createSupabaseClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const now = new Date();
    const todayKey = getJakartaDateKey(now);

    // Tentukan awal rentang tujuh hari berdasarkan tanggal Jakarta.
    const today = new Date(`${todayKey}T00:00:00Z`);
    today.setUTCDate(today.getUTCDate() - 6);

    const startKey = today.toISOString().slice(0, 10);
    const since = getJakartaStartOfDay(startKey);

    // Ambil seluruh data dengan pagination, bukan hanya 10.000 baris.
    const visits: { visitor_id: string; visited_at: string }[] = [];

    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { data, error } = await supabase
        .from("website_visits")
        .select("visitor_id, visited_at")
        .gte("visited_at", since.toISOString())
        .lte("visited_at", now.toISOString())
        .order("visited_at", { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);

      if (error) {
        console.error(
          "Analytics read error:",
          error.code,
          error.message,
          error.details
        );

        return NextResponse.json(
          { error: "Gagal mengambil statistik dari database." },
          { status: 500 }
        );
      }

      const batch = data ?? [];
      visits.push(...batch);

      if (batch.length < PAGE_SIZE) {
        break;
      }
    }

    const grouped = new Map<
      string,
      { visits: number; visitors: Set<string> }
    >();

    // Siapkan tujuh tanggal kalender Jakarta.
    for (let i = 0; i < 7; i++) {
      const date = new Date(`${startKey}T00:00:00Z`);
      date.setUTCDate(date.getUTCDate() + i);

      const dateKey = date.toISOString().slice(0, 10);

      grouped.set(dateKey, {
        visits: 0,
        visitors: new Set<string>(),
      });
    }

    // Kelompokkan kunjungan berdasarkan tanggal Jakarta.
    for (const visit of visits) {
      if (!visit.visited_at) continue;

      const dateKey = getJakartaDateKey(new Date(visit.visited_at));
      const day = grouped.get(dateKey);

      if (day) {
        day.visits += 1;

        if (visit.visitor_id) {
          day.visitors.add(visit.visitor_id);
        }
      }
    }

    const days = Array.from(grouped.entries()).map(([date, stats]) => {
      const [year, month, day] = date.split("-").map(Number);
      const localDate = new Date(Date.UTC(year, month - 1, day));

      return {
        date,
        label: new Intl.DateTimeFormat("id-ID", {
          timeZone: "UTC",
          day: "numeric",
          month: "short",
        }).format(localDate),
        visits: stats.visits,
        unique: stats.visitors.size,
      };
    });

    return NextResponse.json(
      {
        days,
        total: visits.length,
        unique: new Set(
          visits
            .map((visit) => visit.visitor_id)
            .filter((id): id is string => Boolean(id))
        ).size,
        updatedAt: now.toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Analytics endpoint error:", error);

    return NextResponse.json(
      { error: "Akses ditolak atau terjadi kesalahan server." },
      { status: 500 }
    );
  }
}