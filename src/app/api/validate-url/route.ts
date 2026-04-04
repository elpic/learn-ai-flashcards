import { NextRequest, NextResponse } from "next/server";
import { isUrlSafeForFetch } from "@/lib/url-safety";
import { createRateLimiter } from "@/lib/rate-limit";

// 30 requests per minute per IP (higher than generate since validation fires on typing)
const rateLimiter = createRateLimiter(30, 60_000);

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = rateLimiter.check(ip);
  if (!allowed) {
    return NextResponse.json({ reachable: false }, { status: 429 });
  }

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
