import { NextResponse } from "next/server";
import { fetchSuperstarsData } from "@/lib/services/superstarsService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchSuperstarsData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch superstars data";
    return NextResponse.json({ error: message, investors: [] }, { status: 500 });
  }
}

