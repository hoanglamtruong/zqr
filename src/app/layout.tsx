import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "zQR - Tạo Mã QR Chuyên Nghiệp | Tĩnh, VietQR, Đổi Màu & Logo",
  description: "Ứng dụng tạo mã QR đa năng: URL, VietQR thanh toán Napas, Wi-Fi, vCard, tùy biến màu gradient, hạt, mắt và chèn logo. Xuất file PNG, SVG chất lượng cao.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
