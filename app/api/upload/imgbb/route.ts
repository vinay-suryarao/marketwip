import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "IMGBB_API_KEY is missing" }, { status: 500 });
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json({ message: "Image file is required" }, { status: 400 });
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ image: base64Image }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: "ImgBB upload failed" }, { status: 502 });
    }

    const payload = (await response.json()) as {
      data?: { display_url?: string; url?: string };
    };

    const imageUrl = payload.data?.display_url ?? payload.data?.url;
    if (!imageUrl) {
      return NextResponse.json({ message: "ImgBB did not return URL" }, { status: 502 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Upload route failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
