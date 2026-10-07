import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "zQR - Tạo Mã QR Chuyên Nghiệp | Tĩnh, VietQR, Đổi Màu & Logo",
  description: "Ứng dụng tạo mã QR đa năng: URL, VietQR thanh toán Napas, Wi-Fi, vCard, tùy biến màu gradient, hạt, mắt và chèn logo. Xuất file PNG, SVG chất lượng cao.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "zQR",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B6B7B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen flex flex-col bg-slate-100 text-slate-900">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
