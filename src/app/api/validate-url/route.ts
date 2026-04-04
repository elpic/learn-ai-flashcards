import { NextRequest, NextResponse } from "next/server";
import { isUrlSafeForFetch } from "@/lib/url-safety";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ reachable: false }, { status: 400 });
  }

  if (!isUrlSafeForFetch(url)) {
    return NextResponse.json({ reachable: false });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    return NextResponse.json({ reachable: response.ok });
  } catch {
    return NextResponse.json({ reachable: false });
  }
}
