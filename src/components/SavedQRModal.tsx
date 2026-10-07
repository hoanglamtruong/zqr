"use client";

import React, { useState, useEffect } from "react";
import {
  SavedQRItem,
  fetchSavedQRCodes,
  updateDestinationUrl,
  deleteQRCodeFromCloud,
  getSupabaseCredentials,
  setCustomSupabaseCredentials,
} from "@/lib/supabase";
import { X, Cloud, RefreshCw, Trash2, Edit3, ExternalLink, Key, Check, BarChart3 } from "lucide-react";

interface SavedQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQR: (item: SavedQRItem) => void;
}

export default function SavedQRModal({ isOpen, onClose, onSelectQR }: SavedQRModalProps) {
  const [items, setItems] = useState<SavedQRItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Cấu hình credentials
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

  // Chỉnh sửa link đích
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");

  const loadCredentialsAndData = async () => {
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url);
    setSupabaseKey(creds.anonKey);

    if (creds.url && creds.anonKey) {
      setLoading(true);
      const data = await fetchSavedQRCodes();
      setItems(data);
      setLoading(false);
    } else {
      setIsConfiguring(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCredentialsAndData();
    }
  }, [isOpen]);

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) return;
    setCustomSupabaseCredentials(supabaseUrl.trim(), supabaseKey.trim());
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setIsConfiguring(false);
      loadCredentialsAndData();
    }, 800);
  };

  const handleUpdateUrl = async (id: string) => {
    if (!editUrl.trim()) return;
    const res = await updateDestinationUrl(id, editUrl.trim());
    if (res.success) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, destination_url: editUrl.trim() } : item
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá mã QR này?")) return;
    const res = await deleteQRCodeFromCloud(id);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#1B6B7B]">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Kho Mã QR & Thống Kê (Supabase)</h2>
              <p className="text-xs text-slate-500">Quản lý mã QR đã lưu, chỉnh sửa link động và xem lượt quét</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConfiguring(!isConfiguring)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 text-xs flex items-center gap-1 font-medium"
              title="Cấu hình Supabase API"
            >
              <Key className="w-4 h-4 text-[#1B6B7B]" />
              <span className="hidden sm:inline">Cấu hình API</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isConfiguring && (
            <form onSubmit={handleSaveCredentials} className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1B6B7B]">
                  Thiết Lập Kết Nối Supabase Project
                </span>
                {configSaved && (
                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Đã lưu cấu hình
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Nhập <strong>Project URL</strong> và <strong>Anon Key</strong> lấy từ Supabase Dashboard (Project Settings &rarr; API):
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Supabase URL</label>
                <input
                  type="url"
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsConfiguring(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-[#1B6B7B] hover:bg-[#145360] text-white font-bold rounded-lg shadow-xs"
                >
                  Lưu & Kết Nối
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#1B6B7B]" />
              <span className="text-xs">Đang tải danh sách từ Supabase...</span>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Cloud className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Chưa có mã QR nào được lưu</p>
              <p className="text-xs text-slate-400 mt-1">
                Tạo mã QR và bấm nút "Lưu lên Cloud" để quản lý và theo dõi lượt quét tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                      {item.is_dynamic ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Mã Động
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Mã Tĩnh
                        </span>
                      )}
                      <span className="text-[11px] uppercase font-semibold text-slate-400">
                        [{item.type}]
                      </span>
                    </div>

                    {item.is_dynamic && (
                      <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                        <span className="font-medium text-slate-400">Link đích:</span>
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="url"
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              className="px-2 py-1 text-xs border rounded border-[#1B6B7B] flex-1 max-w-xs"
                              placeholder="https://..."
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateUrl(item.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-800 truncate max-w-xs block">
                              {item.destination_url || "(chưa có link)"}
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(item.id);
                                setEditUrl(item.destination_url || "");
                              }}
                              className="text-[#1B6B7B] hover:text-[#145360] text-xs flex items-center gap-0.5 font-medium"
                              title="Sửa link đích"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Sửa
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Mã: <code className="bg-slate-100 px-1 py-0.5 rounded">{item.short_code}</code></span>
                      <span>Ngày tạo: {new Date(item.created_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  {/* Lượt quét & Tác vụ */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {item.scan_count}
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight">lượt quét</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectQR(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#1B6B7B] font-bold text-xs border border-teal-200 transition-colors"
                      title="Mở mã QR này lên bảng vẽ"
                    >
                      Mở lại
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Xóa mã"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
