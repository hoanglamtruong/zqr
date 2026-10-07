"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DynamicQRRecord } from "@/types/qr";
import {
  Link2,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  BarChart3,
  Copy,
  ExternalLink,
} from "lucide-react";

interface DynamicQRManagerProps {
  onActiveUrlChange: (url: string) => void;
}

export default function DynamicQRManager({ onActiveUrlChange }: DynamicQRManagerProps) {
  const [items, setItems] = useState<DynamicQRRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dynamic");
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (activeCode && baseUrl) {
      onActiveUrlChange(`${baseUrl}/r/${activeCode}`);
    }
  }, [activeCode, baseUrl, onActiveUrlChange]);

  const handleCreate = async () => {
    setError("");
    if (!targetUrl.trim()) {
      setError("Vui lòng nhập đích đến.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/dynamic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể tạo QR động.");
        return;
      }
      setItems((prev) => [data.item, ...prev]);
      setActiveCode(data.item.code);
      setTitle("");
      setTargetUrl("");
    } catch {
      setError("Lỗi kết nối máy chủ.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: DynamicQRRecord) => {
    setEditingCode(item.code);
    setEditTitle(item.title);
    setEditUrl(item.targetUrl);
  };

  const cancelEdit = () => setEditingCode(null);

  const saveEdit = async (code: string) => {
    const res = await fetch(`/api/dynamic/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, targetUrl: editUrl }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it.code === code ? data.item : it)));
      setEditingCode(null);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm("Xoá mã QR động này? Mã QR đã in sẽ không còn hoạt động.")) return;
    const res = await fetch(`/api/dynamic/${code}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it.code !== code));
      if (activeCode === code) setActiveCode(null);
    }
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(`${baseUrl}/r/${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="space-y-4">
      {/* FORM TẠO MỚI */}
      <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1B6B7B]">
            Tạo mã QR động mới
          </span>
          <span className="text-[10px] bg-[#1B6B7B] text-white px-2 py-0.5 rounded-full font-bold">
            Sửa được mọi lúc
          </span>
        </div>
        <p className="text-xs text-slate-600">
          QR động mã hoá 1 liên kết chuyển hướng cố định. Bạn có thể đổi đích đến bất cứ lúc nào
          mà không cần in lại mã.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên gợi nhớ
            </label>
            <input
              type="text"
              placeholder="VD: Menu nhà hàng, Landing page sale..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-[#1B6B7B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Đích đến (URL)
            </label>
            <input
              type="text"
              placeholder="https://zeebee.vn/khuyen-mai"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-[#1B6B7B] focus:outline-none"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1B6B7B] hover:bg-[#145360] text-white text-sm font-bold disabled:opacity-60 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {creating ? "Đang tạo..." : "Tạo mã QR động"}
        </button>
      </div>

      {/* DANH SÁCH QR ĐỘNG */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            QR động đã tạo ({items.length})
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-400">Đang tải...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Chưa có mã QR động nào. Tạo mã đầu tiên ở trên.
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => {
              const isActive = activeCode === item.code;
              const isEditing = editingCode === item.code;
              return (
                <div
                  key={item.code}
                  className={`p-3 rounded-xl border transition-all ${
                    isActive
                      ? "border-[#1B6B7B] bg-teal-50/40 shadow-sm"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm"
                        placeholder="Tên gợi nhớ"
                      />
                      <input
                        type="text"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-sm font-mono"
                        placeholder="Đích đến (URL)"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveEdit(item.code)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Lưu
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveCode(item.code)}
                          className="text-left flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5 text-[#1B6B7B] shrink-0" />
                            <span className="text-sm font-bold text-slate-800 truncate">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.targetUrl}
                          </p>
                        </button>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyLink(item.code)}
                            title="Sao chép liên kết QR"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            {copiedCode === item.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            title="Sửa đích đến"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.code)}
                            title="Xoá"
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> /r/{item.code}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-semibold">
                          <BarChart3 className="w-3 h-3 text-[#E8622A]" />
                          {item.scanCount} lượt quét
                          {item.lastScannedAt && (
                            <span className="text-slate-400 font-normal">
                              · gần nhất {new Date(item.lastScannedAt).toLocaleString("vi-VN")}
                            </span>
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
