import { NextRequest, NextResponse } from "next/server";
import { updateFIIDIIActivity } from "@/lib/services/fiiDiiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fiiCashMarket, diiCashMarket } = body;

    // Validate input
    if (
      typeof fiiCashMarket !== "number" ||
      typeof diiCashMarket !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input. Both values must be numbers." },
        { status: 400 }
      );
    }

    // Update FII/DII data (old data automatically replaced)
    // Firestore security rules will verify admin status on write
    const result = await updateFIIDIIActivity(fiiCashMarket, diiCashMarket);

    return NextResponse.json(
      {
        message: "FII/DII data updated successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating FII/DII data:", error);

    // Check if it's a Firebase permission error
    if (error.code === "permission-denied" || error.message?.includes("permission")) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
