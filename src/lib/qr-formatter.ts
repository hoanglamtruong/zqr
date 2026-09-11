import { VietQRData, WifiData, VCardData, EmailData, PhoneData } from "@/types/qr";
import { generateVietQREMVCo } from "./vietqr";

export function formatQRContent(
  type: string,
  url: string,
  text: string,
  vietqr: VietQRData,
  wifi: WifiData,
  vcard: VCardData,
  email: EmailData,
  phone: PhoneData
): string {
  switch (type) {
    case "url":
      if (!url) return "https://zeebee.vn";
      return url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    case "vietqr":
      return (
        generateVietQREMVCo(
          vietqr.bankBin,
          vietqr.accountNumber,
          vietqr.amount,
          vietqr.message
        ) || "https://zeebee.vn"
      );

    case "wifi":
      const enc = wifi.encryption === "nopass" ? "nopass" : wifi.encryption;
      const pass = enc === "nopass" ? "" : wifi.password;
      const h = wifi.hidden ? "H:true;" : "";
      return `WIFI:S:${wifi.ssid};T:${enc};P:${pass};${h};`;

    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${vcard.lastName || ""};${vcard.firstName || ""};;;`,
        `FN:${(vcard.firstName + " " + vcard.lastName).trim() || "User"}`,
        vcard.organization ? `ORG:${vcard.organization}` : "",
        vcard.title ? `TITLE:${vcard.title}` : "",
        vcard.phone ? `TEL;TYPE=CELL:${vcard.phone}` : "",
        vcard.email ? `EMAIL:${vcard.email}` : "",
        vcard.website ? `URL:${vcard.website}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");

    case "email":
      if (!email.email) return "mailto:";
      const params = [];
      if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
      if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
      return `mailto:${email.email}${params.length > 0 ? "?" + params.join("&") : ""}`;

    case "phone":
      return `tel:${phone.phone || ""}`;

    case "text":
    default:
      return text || "Xin chào từ zQR";
  }
}
