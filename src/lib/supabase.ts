import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Khởi tạo Supabase client hỗ trợ cả env vars và localStorage cấu hình động
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey };
  }

  if (typeof window !== "undefined") {
    const localUrl = localStorage.getItem("zqr_supabase_url") || "";
    const localKey = localStorage.getItem("zqr_supabase_key") || "";
    if (localUrl && localKey) {
      return { url: localUrl, anonKey: localKey };
    }
  }

  return { url: "", anonKey: "" };
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;

  if (!supabaseInstance) {
    supabaseInstance = createClient(url, anonKey);
  }
  return supabaseInstance;
}

export function setCustomSupabaseCredentials(url: string, key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("zqr_supabase_url", url);
    localStorage.setItem("zqr_supabase_key", key);
    supabaseInstance = createClient(url, key);
  }
}

export interface SavedQRItem {
  id: string;
  short_code: string;
  title: string;
  type: string;
  is_dynamic: boolean;
  destination_url: string;
  qr_data: any;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export async function saveQRCodeToCloud(item: {
  title: string;
  type: string;
  is_dynamic: boolean;
  destination_url: string;
  qr_data: any;
}): Promise<{ data: SavedQRItem | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: "Chưa cấu hình Supabase URL & Anon Key" };
  }

  // Sinh short_code 6 ký tự ngẫu nhiên
  const shortCode = Math.random().toString(36).substring(2, 8);

  const { data, error } = await supabase
    .from("qr_codes")
    .insert([
      {
        short_code: shortCode,
        title: item.title || "Mã QR mới",
        type: item.type,
        is_dynamic: item.is_dynamic,
        destination_url: item.destination_url,
        qr_data: item.qr_data,
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function fetchSavedQRCodes(): Promise<SavedQRItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function updateDestinationUrl(
  id: string,
  newUrl: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Chưa kết nối Supabase" };

  const { error } = await supabase
    .from("qr_codes")
    .update({ destination_url: newUrl, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}

export async function deleteQRCodeFromCloud(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: false, error: "Chưa kết nối Supabase" };

  const { error } = await supabase.from("qr_codes").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
