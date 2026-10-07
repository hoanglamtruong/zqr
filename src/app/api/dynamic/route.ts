import { NextRequest, NextResponse } from "next/server";
import { createDynamicQR, listDynamicQRs } from "@/lib/dynamic-qr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function GET() {
  const items = await listDynamicQRs();
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const targetUrlRaw = typeof body?.targetUrl === "string" ? body.targetUrl : "";
  const targetUrl = normalizeUrl(targetUrlRaw);

  if (!targetUrl) {
    return NextResponse.json({ error: "Thiếu đích đến (targetUrl)." }, { status: 400 });
  }

  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json({ error: "Đích đến không phải URL hợp lệ." }, { status: 400 });
  }

  const record = await createDynamicQR(title || "QR Động không tên", targetUrl);
  return NextResponse.json({ item: record }, { status: 201 });
}
