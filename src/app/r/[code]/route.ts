import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase chưa được cấu hình trên server." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Phân tích thiết bị từ User-Agent
  const ua = request.headers.get("user-agent") || "";
  let deviceType = "desktop";
  if (/mobile/i.test(ua)) deviceType = "mobile";
  else if (/tablet|ipad/i.test(ua)) deviceType = "tablet";

  // Ghi nhận lượt quét qua stored procedure record_qr_scan
  const { data: destUrl, error } = await supabase.rpc("record_qr_scan", {
    p_short_code: code,
    p_device: deviceType,
    p_ua: ua.slice(0, 500),
  });

  if (error || !destUrl) {
    // Fallback nếu rpc chưa tạo: truy vấn trực tiếp bảng qr_codes
    const { data: qr } = await supabase
      .from("qr_codes")
      .select("id, destination_url, scan_count")
      .eq("short_code", code)
      .single();

    if (qr && qr.destination_url) {
      // Tăng scan_count thủ công
      await supabase
        .from("qr_codes")
        .update({ scan_count: (qr.scan_count || 0) + 1, updated_at: new Date().toISOString() })
        .eq("id", qr.id);

      const target = qr.destination_url.startsWith("http")
        ? qr.destination_url
        : `https://${qr.destination_url}`;
      return NextResponse.redirect(target, 307);
    }

    return new NextResponse(
      `<!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8"/>
        <title>Mã QR không tồn tại</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #0f172a; text-align: center; }
          .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid #e2e8f0; max-width: 400px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          h1 { font-size: 1.25rem; color: #e11d48; margin-bottom: 0.5rem; }
          p { font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem; }
          a { display: inline-block; background: #1B6B7B; color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Mã QR Không Tồn Tại</h1>
          <p>Mã QR động này có thể đã bị xoá hoặc chưa được cấu hình link đích.</p>
          <a href="/">Tạo mã QR mới với zQR</a>
        </div>
      </body>
      </html>`,
      { status: 404, headers: { "content-type": "text/html; charset=utf-8" } }
    );
  }

  const target = destUrl.startsWith("http") ? destUrl : `https://${destUrl}`;
  return NextResponse.redirect(target, 307);
}
