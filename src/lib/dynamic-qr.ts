import { DynamicQRRecord } from "@/types/qr";
import { generateShortCode } from "./short-code";
import { createClient } from "@supabase/supabase-js";

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Fallback SQLite dynamic import khi chạy local không có Supabase
async function getSqliteDb() {
  return await import("./db");
}

export async function listDynamicQRs(): Promise<DynamicQRRecord[]> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("is_dynamic", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((r: any) => ({
        code: r.short_code,
        title: r.title,
        targetUrl: r.destination_url,
        scanCount: r.scan_count || 0,
        lastScannedAt: r.updated_at,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
  }

  // Fallback SQLite
  try {
    const sqlite = await getSqliteDb();
    return sqlite.listDynamicQRs();
  } catch {
    return [];
  }
}

export async function createDynamicQR(title: string, targetUrl: string): Promise<DynamicQRRecord> {
  const supabase = getSupabaseServerClient();
  const code = generateShortCode();

  if (supabase) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("qr_codes")
      .insert([
        {
          short_code: code,
          title: title || "QR Động",
          type: "dynamic",
          is_dynamic: true,
          destination_url: targetUrl,
          scan_count: 0,
          created_at: now,
          updated_at: now,
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return {
        code: data.short_code,
        title: data.title,
        targetUrl: data.destination_url,
        scanCount: 0,
        lastScannedAt: null,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  }

  // Fallback SQLite
  const sqlite = await getSqliteDb();
  return sqlite.createDynamicQR(title, targetUrl);
}

export async function getDynamicQR(code: string): Promise<DynamicQRRecord | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("short_code", code)
      .single();

    if (!error && data) {
      return {
        code: data.short_code,
        title: data.title,
        targetUrl: data.destination_url,
        scanCount: data.scan_count || 0,
        lastScannedAt: data.updated_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  }

  try {
    const sqlite = await getSqliteDb();
    return sqlite.getDynamicQR(code);
  } catch {
    return null;
  }
}

export async function updateDynamicQR(
  code: string,
  updates: { title?: string; targetUrl?: string }
): Promise<DynamicQRRecord | null> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const patch: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.targetUrl !== undefined) patch.destination_url = updates.targetUrl;

    const { data, error } = await supabase
      .from("qr_codes")
      .update(patch)
      .eq("short_code", code)
      .select()
      .single();

    if (!error && data) {
      return {
        code: data.short_code,
        title: data.title,
        targetUrl: data.destination_url,
        scanCount: data.scan_count || 0,
        lastScannedAt: data.updated_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  }

  const sqlite = await getSqliteDb();
  return sqlite.updateDynamicQR(code, updates);
}

export async function deleteDynamicQR(code: string): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (supabase) {
    const { error } = await supabase.from("qr_codes").delete().eq("short_code", code);
    if (!error) return true;
  }

  const sqlite = await getSqliteDb();
  return sqlite.deleteDynamicQR(code);
}
