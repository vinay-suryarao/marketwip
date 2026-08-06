import { NextRequest, NextResponse } from "next/server";
import { fetchStockData } from "@/lib/services/analyzerService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name || name.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing 'name' query parameter" },
      { status: 400 },
    );
  }

  try {
    const data = await fetchStockData(name.trim());
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stock data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
