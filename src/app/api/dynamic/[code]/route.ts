import { NextRequest, NextResponse } from "next/server";
import { deleteDynamicQR, getDynamicQR, updateDynamicQR } from "@/lib/dynamic-qr";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const item = await getDynamicQR(code);
  if (!item) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json().catch(() => null);

  const updates: { title?: string; targetUrl?: string } = {};
  if (typeof body?.title === "string") {
    updates.title = body.title.trim() || "QR Động không tên";
  }
  if (typeof body?.targetUrl === "string") {
    const targetUrl = normalizeUrl(body.targetUrl);
    if (!targetUrl) {
      return NextResponse.json({ error: "Đích đến không được để trống." }, { status: 400 });
    }
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Đích đến không phải URL hợp lệ." }, { status: 400 });
    }
    updates.targetUrl = targetUrl;
  }

  const item = await updateDynamicQR(code, updates);
  if (!item) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const ok = await deleteDynamicQR(code);
  if (!ok) return NextResponse.json({ error: "Không tìm thấy." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
