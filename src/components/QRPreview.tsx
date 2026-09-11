"use client";

import React, { useEffect, useRef, useState } from "react";
import { QRStyleOptions } from "@/types/qr";
import { Download, Copy, Check, Eye, RefreshCw, FileCode } from "lucide-react";

interface QRPreviewProps {
  content: string;
  styleOptions: QRStyleOptions;
  title?: string;
  subtitle?: string;
}

export default function QRPreview({
  content,
  styleOptions,
  title,
  subtitle,
}: QRPreviewProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeInstanceRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [downloadSize, setDownloadSize] = useState<number>(1024);
  const [isReady, setIsReady] = useState(false);

  // Khởi tạo và cập nhật QRCodeStyling khi content hoặc styleOptions thay đổi
  useEffect(() => {
    let isMounted = true;

    async function initOrUpdateQR() {
      if (typeof window === "undefined") return;

      const QRCodeStyling = (await import("qr-code-styling")).default;

      const gradientConfig =
        styleOptions.colorType === "gradient"
          ? {
              type: "linear" as const,
              rotation: (styleOptions.gradientRotation * Math.PI) / 180,
              colorStops: [
                { offset: 0, color: styleOptions.gradientColor1 },
                { offset: 1, color: styleOptions.gradientColor2 },
              ],
            }
          : undefined;

      const options = {
        width: 280,
        height: 280,
        type: "svg" as const,
        data: content || "https://zeebee.vn",
        image: styleOptions.logoUrl || undefined,
        margin: 8,
        qrOptions: {
          typeNumber: 0 as any,
          mode: "Byte" as any,
          errorCorrectionLevel: styleOptions.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: styleOptions.logoSize,
          margin: styleOptions.logoMargin,
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          type: styleOptions.dotType,
          color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
          gradient: gradientConfig,
        },
        backgroundOptions: {
          color: styleOptions.bgColor || "#ffffff",
        },
        cornersSquareOptions: {
          type: styleOptions.cornerSquareType,
          color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
          gradient: gradientConfig,
        },
        cornersDotOptions: {
          type: styleOptions.cornerDotType,
          color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
        },
      };

      if (!qrCodeInstanceRef.current) {
        qrCodeInstanceRef.current = new QRCodeStyling(options);
        if (qrRef.current && isMounted) {
          qrRef.current.innerHTML = "";
          qrCodeInstanceRef.current.append(qrRef.current);
          setIsReady(true);
        }
      } else {
        qrCodeInstanceRef.current.update(options);
      }
    }

    initOrUpdateQR();

    return () => {
      isMounted = false;
    };
  }, [content, styleOptions]);

  const handleDownload = async (extension: "png" | "svg" | "jpeg") => {
    if (!qrCodeInstanceRef.current) return;

    if (extension === "svg") {
      qrCodeInstanceRef.current.download({
        name: `zqr-${Date.now()}`,
        extension: "svg",
      });
      return;
    }

    // Tải ảnh raster độ nét cao dựa trên downloadSize đã chọn
    const QRCodeStyling = (await import("qr-code-styling")).default;

    const gradientConfig =
      styleOptions.colorType === "gradient"
        ? {
            type: "linear" as const,
            rotation: (styleOptions.gradientRotation * Math.PI) / 180,
            colorStops: [
              { offset: 0, color: styleOptions.gradientColor1 },
              { offset: 1, color: styleOptions.gradientColor2 },
            ],
          }
        : undefined;

    const highResQR = new QRCodeStyling({
      width: downloadSize,
      height: downloadSize,
      type: "canvas",
      data: content || "https://zeebee.vn",
      image: styleOptions.logoUrl || undefined,
      margin: Math.round(downloadSize * 0.03),
      qrOptions: {
        errorCorrectionLevel: styleOptions.errorCorrectionLevel,
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: styleOptions.logoSize,
        margin: styleOptions.logoMargin * (downloadSize / 280),
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        type: styleOptions.dotType,
        color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
        gradient: gradientConfig,
      },
      backgroundOptions: {
        color: styleOptions.bgColor || "#ffffff",
      },
      cornersSquareOptions: {
        type: styleOptions.cornerSquareType,
        color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
        gradient: gradientConfig,
      },
      cornersDotOptions: {
        type: styleOptions.cornerDotType,
        color: styleOptions.colorType === "single" ? styleOptions.singleColor : undefined,
      },
    });

    highResQR.download({
      name: `zqr-${downloadSize}px-${Date.now()}`,
      extension,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center sticky top-6">
      <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-[#1B6B7B]" /> Xem trước thời gian thực
        </span>
        <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Sẵn sàng
        </span>
      </div>

      {/* VÙNG CHỨA MÃ QR */}
      <div
        className="p-5 rounded-2xl border-2 border-slate-100 shadow-md flex items-center justify-center transition-all bg-white relative group min-w-[320px] min-h-[320px]"
        style={{ backgroundColor: styleOptions.bgColor || "#ffffff" }}
      >
        <div ref={qrRef} className="flex items-center justify-center" />
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 bg-white rounded-2xl">
            <RefreshCw className="w-6 h-6 animate-spin text-[#1B6B7B]" />
            <span className="text-xs">Đang sinh mã QR...</span>
          </div>
        )}
      </div>

      {/* THÔNG TIN NỘI DUNG MÃ */}
      <div className="w-full mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-slate-700">Dữ liệu mã hoá:</span>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-[#1B6B7B] hover:underline font-medium"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã chép
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Sao chép text
              </>
            )}
          </button>
        </div>
        <p className="text-xs font-mono text-slate-800 break-all line-clamp-2 bg-white p-1.5 rounded border border-slate-200">
          {content || "Trống"}
        </p>
      </div>

      {/* CẤU HÌNH ĐỘ PHÂN GIẢI XUẤT ẢNH */}
      <div className="w-full mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Kích thước tải PNG:</span>
          <span className="font-mono text-[#1B6B7B] font-bold">{downloadSize} x {downloadSize} px</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { size: 512, label: "512px (Web)" },
            { size: 1024, label: "1024px (HD)" },
            { size: 2048, label: "2048px (In ấn)" },
          ].map((item) => (
            <button
              key={item.size}
              type="button"
              onClick={() => setDownloadSize(item.size)}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                downloadSize === item.size
                  ? "bg-teal-50 border-[#1B6B7B] text-[#1B6B7B] font-bold"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* NÚT TẢI VỀ */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
        <button
          type="button"
          onClick={() => handleDownload("png")}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1B6B7B] hover:bg-[#145360] text-white font-bold text-sm shadow-sm transition-all hover:shadow cursor-pointer"
        >
          <Download className="w-4 h-4" /> Tải ảnh PNG
        </button>

        <button
          type="button"
          onClick={() => handleDownload("svg")}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#E8622A] hover:bg-[#cf5320] text-white font-bold text-sm shadow-sm transition-all hover:shadow cursor-pointer"
          title="File vector SVG phóng to không bao giờ vỡ nét, tối ưu cho nhà in"
        >
          <FileCode className="w-4 h-4" /> Tải file SVG
        </button>
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-3">
        Mẹo: Chọn SVG để in ấn kích thước lớn (bạt, bảng hiệu, menu) chất lượng vô hạn.
      </p>
    </div>
  );
}
