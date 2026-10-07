"use client";

import { useEffect } from "react";

export default function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Cài đặt offline là tiện ích thêm — bỏ qua nếu đăng ký thất bại.
    });
  }, []);

  return null;
}
