"use client";

import React, { useRef } from "react";
import { QRStyleOptions, DotType, CornerSquareType, CornerDotType } from "@/types/qr";
import { Palette, Sparkles, Image as ImageIcon, ShieldAlert, X } from "lucide-react";

interface StyleCustomizerProps {
  styleOptions: QRStyleOptions;
  onChangeStyle: (opts: QRStyleOptions) => void;
}

const DOT_STYLES: { id: DotType; label: string }[] = [
  { id: "rounded", label: "Bo tròn mềm" },
  { id: "dots", label: "Chấm tròn (Dots)" },
  { id: "classy", label: "Cổ điển (Classy)" },
  { id: "classy-rounded", label: "Cổ điển bo góc" },
  { id: "extra-rounded", label: "Tròn mềm đậm" },
  { id: "square", label: "Vuông chuẩn" },
];

const CORNER_SQUARE_STYLES: { id: CornerSquareType; label: string }[] = [
  { id: "extra-rounded", label: "Bo góc tròn" },
  { id: "square", label: "Vuông cổ điển" },
  { id: "dot", label: "Vòng tròn" },
];

const CORNER_DOT_STYLES: { id: CornerDotType; label: string }[] = [
  { id: "dot", label: "Chấm tròn" },
  { id: "square", label: "Chấm vuông" },
];

const COLOR_PRESETS = [
  { name: "Teal ZWSP", color: "#1B6B7B" },
  { name: "Cam Brand", color: "#E8622A" },
  { name: "Xanh Navy", color: "#0F2942" },
  { name: "Xanh Lá", color: "#059669" },
  { name: "Tím Đậm", color: "#6366F1" },
  { name: "Đen Chuẩn", color: "#000000" },
];

export default function StyleCustomizer({ styleOptions, onChangeStyle }: StyleCustomizerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChangeStyle({
        ...styleOptions,
        logoUrl: dataUrl,
        errorCorrectionLevel: "H", // Tự động nâng mức sửa lỗi lên H khi có logo
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    onChangeStyle({ ...styleOptions, logoUrl: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Palette className="w-5 h-5 text-[#1B6B7B]" />
        <h2 className="font-bold text-slate-800 text-lg">Tùy Biến Thẩm Mỹ Mã QR</h2>
      </div>

      {/* 1. MÀU SẮC & GRADIENT */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
          <span>Chế độ màu</span>
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => onChangeStyle({ ...styleOptions, colorType: "single" })}
              className={`px-3 py-1 rounded-md transition-colors ${
                styleOptions.colorType === "single"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Đơn sắc
            </button>
            <button
              type="button"
              onClick={() => onChangeStyle({ ...styleOptions, colorType: "gradient" })}
              className={`px-3 py-1 rounded-md transition-colors ${
                styleOptions.colorType === "gradient"
                  ? "bg-white text-slate-900 font-bold shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Gradient 2 màu
            </button>
          </div>
        </label>

        {styleOptions.colorType === "single" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={styleOptions.singleColor}
                onChange={(e) => onChangeStyle({ ...styleOptions, singleColor: e.target.value })}
                className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300"
              />
              <input
                type="text"
                value={styleOptions.singleColor}
                onChange={(e) => onChangeStyle({ ...styleOptions, singleColor: e.target.value })}
                className="w-32 px-3 py-2 text-sm font-mono uppercase border border-slate-300 rounded-lg"
              />
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_PRESETS.map((p) => (
                  <button
                    key={p.color}
                    type="button"
                    onClick={() => onChangeStyle({ ...styleOptions, singleColor: p.color })}
                    style={{ backgroundColor: p.color }}
                    className="w-7 h-7 rounded-full border border-white shadow-sm hover:scale-110 transition-transform"
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Màu bắt đầu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleOptions.gradientColor1}
                    onChange={(e) =>
                      onChangeStyle({ ...styleOptions, gradientColor1: e.target.value })
                    }
                    className="w-10 h-9 rounded cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={styleOptions.gradientColor1}
                    onChange={(e) =>
                      onChangeStyle({ ...styleOptions, gradientColor1: e.target.value })
                    }
                    className="w-24 px-2 py-1.5 text-xs font-mono uppercase border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Màu kết thúc</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleOptions.gradientColor2}
                    onChange={(e) =>
                      onChangeStyle({ ...styleOptions, gradientColor2: e.target.value })
                    }
                    className="w-10 h-9 rounded cursor-pointer border border-slate-300"
                  />
                  <input
                    type="text"
                    value={styleOptions.gradientColor2}
                    onChange={(e) =>
                      onChangeStyle({ ...styleOptions, gradientColor2: e.target.value })
                    }
                    className="w-24 px-2 py-1.5 text-xs font-mono uppercase border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1">
                <span>Góc xoay Gradient</span>
                <span className="font-mono">{styleOptions.gradientRotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={styleOptions.gradientRotation}
                onChange={(e) =>
                  onChangeStyle({ ...styleOptions, gradientRotation: parseInt(e.target.value, 10) })
                }
                className="w-full accent-[#1B6B7B]"
              />
            </div>
          </div>
        )}

        {/* Background Color */}
        <div className="pt-2 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Màu nền mã QR</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={styleOptions.bgColor}
              onChange={(e) => onChangeStyle({ ...styleOptions, bgColor: e.target.value })}
              className="w-9 h-8 rounded cursor-pointer border border-slate-300"
            />
            <input
              type="text"
              value={styleOptions.bgColor}
              onChange={(e) => onChangeStyle({ ...styleOptions, bgColor: e.target.value })}
              className="w-24 px-2 py-1 text-xs font-mono uppercase border border-slate-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* 2. KIỂU HẠT (DOTS PATTERNS) */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Kiểu dáng hạt bên trong</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DOT_STYLES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onChangeStyle({ ...styleOptions, dotType: d.id })}
              className={`p-2 rounded-xl text-xs font-medium border text-center transition-all ${
                styleOptions.dotType === d.id
                  ? "bg-teal-50 border-[#1B6B7B] text-[#1B6B7B] font-bold shadow-sm"
                  : "border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. KIỂU MẮT ĐỊNH VỊ (CORNER EYES) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">Khung mắt định vị</label>
          <div className="grid grid-cols-3 gap-1.5">
            {CORNER_SQUARE_STYLES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChangeStyle({ ...styleOptions, cornerSquareType: c.id })}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  styleOptions.cornerSquareType === c.id
                    ? "bg-teal-50 border-[#1B6B7B] text-[#1B6B7B] font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-2">Tâm mắt định vị</label>
          <div className="grid grid-cols-2 gap-1.5">
            {CORNER_DOT_STYLES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChangeStyle({ ...styleOptions, cornerDotType: c.id })}
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                  styleOptions.cornerDotType === c.id
                    ? "bg-teal-50 border-[#1B6B7B] text-[#1B6B7B] font-bold"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. CHÈN LOGO VÀO CHÍNH GIỮA */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            <span>Chèn Logo Thương Hiệu</span>
          </span>
          {styleOptions.logoUrl && (
            <button
              type="button"
              onClick={removeLogo}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Xóa logo
            </button>
          )}
        </label>

        {styleOptions.logoUrl ? (
          <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={styleOptions.logoUrl}
                alt="Logo preview"
                className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-slate-200 shadow-sm"
              />
              <div className="text-xs text-slate-600 flex-1">
                <span className="font-semibold block text-emerald-700">Logo đã được chèn</span>
                Đã tự động nâng mức chống vỡ hạt (Level H - 30%) để quét ổn định.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Kích thước logo</span>
                  <span>{Math.round(styleOptions.logoSize * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.15"
                  max="0.4"
                  step="0.02"
                  value={styleOptions.logoSize}
                  onChange={(e) =>
                    onChangeStyle({ ...styleOptions, logoSize: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#1B6B7B]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Khoảng lề trắng</span>
                  <span>{styleOptions.logoMargin}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={styleOptions.logoMargin}
                  onChange={(e) =>
                    onChangeStyle({ ...styleOptions, logoMargin: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#1B6B7B]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-[#1B6B7B] rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/20"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <p className="text-xs font-semibold text-slate-700">
              Nhấp để tải logo từ máy tính (PNG, SVG, JPG)
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Khuyến khích ảnh vuông hoặc nền trong suốt (transparent)
            </p>
          </div>
        )}
      </div>

      {/* 5. CẤP ĐỘ SỬA LỖI (ERROR CORRECTION LEVEL) */}
      <div className="space-y-2 border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>Khả năng sửa lỗi (Error Correction)</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {styleOptions.errorCorrectionLevel === "H"
              ? "Cực cao 30% (khuyên dùng khi có logo)"
              : styleOptions.errorCorrectionLevel === "Q"
              ? "Cao 25%"
              : styleOptions.errorCorrectionLevel === "M"
              ? "Trung bình 15%"
              : "Thấp 7%"}
          </span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(["L", "M", "Q", "H"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChangeStyle({ ...styleOptions, errorCorrectionLevel: lvl })}
              className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                styleOptions.errorCorrectionLevel === lvl
                  ? "bg-teal-50 border-[#1B6B7B] text-[#1B6B7B]"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Mức {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
