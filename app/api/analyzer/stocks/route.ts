import { NextResponse } from "next/server";
import { fetchStockList } from "@/lib/services/analyzerService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stocks = await fetchStockList();
    return NextResponse.json({ stocks }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch stock list";
    return NextResponse.json({ error: message, stocks: [] }, { status: 500 });
  }
}
