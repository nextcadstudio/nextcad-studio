import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const range = Number(
    request.nextUrl.searchParams.get("range") ?? 7
  );

  if (![7, 30, 90].includes(range)) {
    return NextResponse.json(
      { error: "Range harus 7, 30, atau 90 hari." },
      { status: 400 }
    );
  }

  // TODO:
  // Ambil statistik asli dari database analytics.
  // Jangan gunakan angka di bawah sebagai data produksi.

  const chart = Array.from({ length: range }, (_, i) => ({
    label: new Date(
      Date.now() - (range - 1 - i) * 86400000
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    }),
    visitors: 0,
    pageViews: 0,
  }));

  return NextResponse.json({
    totalVisitors: 0,
    pageViews: 0,
    activeVisitors: 0,
    bounceRate: 0,
    visitorChange: 0,
    chart,
    sources: [
      { name: "Organic Search", percentage: 0 },
      { name: "Direct", percentage: 0 },
      { name: "Social Media", percentage: 0 },
      { name: "Referral", percentage: 0 },
    ],
    popularPages: [],
    deviceStats: [
      { name: "Desktop", percentage: 0 },
      { name: "Mobile", percentage: 0 },
      { name: "Tablet", percentage: 0 },
    ],
    updatedAt: new Date().toISOString(),
  });
}