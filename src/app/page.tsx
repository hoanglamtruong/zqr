"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import FormTabs from "@/components/FormTabs";
import StyleCustomizer from "@/components/StyleCustomizer";
import { QRType, VietQRData, WifiData, VCardData, EmailData, PhoneData, QRStyleOptions } from "@/types/qr";
import { formatQRContent } from "@/lib/qr-formatter";
import { QrCode, Sparkles, ShieldCheck, Network } from "lucide-react";

const QRPreview = dynamic(() => import("@/components/QRPreview"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[420px] sticky top-6">
      <div className="text-slate-400 text-sm animate-pulse">Đang tải trình xem mã QR...</div>
    </div>
  ),
});

export default function Home() {
  const [activeType, setActiveType] = useState<QRType>("url");
  const [url, setUrl] = useState("https://zeebee.vn");
  const [text, setText] = useState("Chào mừng bạn đến với hệ sinh thái ZOS!");
  const [vietqr, setVietqr] = useState<VietQRData>({
    bankBin: "970436", // Vietcombank
    accountNumber: "0011001234567",
    accountName: "NGUYEN VAN A",
    amount: "50000",
    message: "Thanh toan don hang",
  });
  const [wifi, setWifi] = useState<WifiData>({
    ssid: "Zteam_Office_5G",
    password: "matkhaukhongchia",
    encryption: "WPA",
    hidden: false,
  });
  const [vcard, setVcard] = useState<VCardData>({
    firstName: "Trần Văn",
    lastName: "An",
    phone: "0912345678",
    email: "an.tran@zeebee.vn",
    organization: "Zteam Technology",
    title: "Trưởng phòng Kỹ thuật",
    website: "https://zeebee.vn",
  });
  const [email, setEmail] = useState<EmailData>({
    email: "contact@zeebee.vn",
    subject: "Tư vấn giải pháp chuyển đổi số",
    body: "Xin chào Zteam, tôi muốn tìm hiểu giải pháp...",
  });
  const [phone, setPhone] = useState<PhoneData>({
    phone: "0912345678",
  });

  const [styleOptions, setStyleOptions] = useState<QRStyleOptions>({
    dotType: "rounded",
    cornerSquareType: "extra-rounded",
    cornerDotType: "dot",
    colorType: "single",
    singleColor: "#1B6B7B", // ZWSP Teal
    gradientColor1: "#1B6B7B",
    gradientColor2: "#E8622A",
    gradientRotation: 45,
    bgColor: "#ffffff",
    logoUrl: "",
    logoSize: 0.28,
    logoMargin: 6,
    errorCorrectionLevel: "M",
  });

  const qrContent = useMemo(() => {
    return formatQRContent(
      activeType,
      url,
      text,
      vietqr,
      wifi,
      vcard,
      email,
      phone
    );
  }, [activeType, url, text, vietqr, wifi, vcard, email, phone]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#1B6B7B] to-[#E8622A] flex items-center justify-center text-white shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  z<span className="text-[#1B6B7B]">QR</span>
                </span>
                <span className="bg-teal-50 text-[#1B6B7B] text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-200">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Bộ công cụ tạo mã QR đa năng & tùy biến cao cấp cho ZOS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-700 font-mono">
              <Network className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tailscale: 100.82.135.18:8122</span>
            </div>
            <a
              href="https://github.com/hoanglamtruong/zqr"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: NHẬP DỮ LIỆU & TÙY BIẾN GIAO DIỆN (7 CỘT) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Trình Tạo Mã QR Tĩnh & VietQR
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Tùy biến hạt, màu gradient, chèn logo doanh nghiệp và xuất file SVG in ấn siêu nét.
              </p>
            </div>

            {/* BỘ FORM NHẬP DỮ LIỆU */}
            <FormTabs
              activeType={activeType}
              onChangeType={setActiveType}
              url={url}
              onChangeUrl={setUrl}
              text={text}
              onChangeText={setText}
              vietqr={vietqr}
              onChangeVietqr={setVietqr}
              wifi={wifi}
              onChangeWifi={setWifi}
              vcard={vcard}
              onChangeVcard={setVcard}
              email={email}
              onChangeEmail={setEmail}
              phone={phone}
              onChangePhone={setPhone}
            />

            {/* BỘ TÙY BIẾN THẨM MỸ */}
            <StyleCustomizer
              styleOptions={styleOptions}
              onChangeStyle={setStyleOptions}
            />
          </div>

          {/* CỘT PHẢI: XEM TRƯỚC & TẢI VỀ (5 CỘT) */}
          <div className="lg:col-span-5">
            <QRPreview
              content={qrContent}
              styleOptions={styleOptions}
              title="Mã QR Của Bạn"
              subtitle="Quét trực tiếp bằng camera hoặc app ngân hàng"
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">zQR Generator</span>
            <span>•</span>
            <span>Hệ sinh thái ZOS · Dell OptiPlex 9010</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side Secure (100% bảo mật dữ liệu)</span>
            <span>•</span>
            <span>Chuẩn Napas247 EMVCo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
