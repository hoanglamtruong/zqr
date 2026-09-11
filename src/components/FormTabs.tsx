"use client";

import React, { useState } from "react";
import { VIETNAMESE_BANKS } from "@/lib/vietqr";
import { VietQRData, WifiData, VCardData, EmailData, PhoneData, QRType } from "@/types/qr";
import { Link2, CreditCard, Wifi, UserSquare2, FileText, Mail, Phone, Search } from "lucide-react";

interface FormTabsProps {
  activeType: QRType;
  onChangeType: (type: QRType) => void;
  url: string;
  onChangeUrl: (v: string) => void;
  text: string;
  onChangeText: (v: string) => void;
  vietqr: VietQRData;
  onChangeVietqr: (data: VietQRData) => void;
  wifi: WifiData;
  onChangeWifi: (data: WifiData) => void;
  vcard: VCardData;
  onChangeVcard: (data: VCardData) => void;
  email: EmailData;
  onChangeEmail: (data: EmailData) => void;
  phone: PhoneData;
  onChangePhone: (data: PhoneData) => void;
}

export default function FormTabs({
  activeType,
  onChangeType,
  url,
  onChangeUrl,
  text,
  onChangeText,
  vietqr,
  onChangeVietqr,
  wifi,
  onChangeWifi,
  vcard,
  onChangeVcard,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
}: FormTabsProps) {
  const [bankSearch, setBankSearch] = useState("");
  const [isBankOpen, setIsBankOpen] = useState(false);

  const filteredBanks = VIETNAMESE_BANKS.filter(
    (b) =>
      b.shortName.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.code.toLowerCase().includes(bankSearch.toLowerCase()) ||
      b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const selectedBank = VIETNAMESE_BANKS.find((b) => b.bin === vietqr.bankBin) || VIETNAMESE_BANKS[0];

  const tabs: { id: QRType; label: string; icon: React.ReactNode }[] = [
    { id: "url", label: "Trang Web (URL)", icon: <Link2 className="w-4 h-4" /> },
    { id: "vietqr", label: "VietQR Ngân Hàng", icon: <CreditCard className="w-4 h-4 text-emerald-600" /> },
    { id: "wifi", label: "Mạng Wi-Fi", icon: <Wifi className="w-4 h-4" /> },
    { id: "vcard", label: "Danh Thiếp", icon: <UserSquare2 className="w-4 h-4" /> },
    { id: "text", label: "Văn Bản", icon: <FileText className="w-4 h-4" /> },
    { id: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
    { id: "phone", label: "Gọi Điện", icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 scrollbar-thin">
        {tabs.map((tab) => {
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeType(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-[#1B6B7B] shadow-sm border border-slate-200/80 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeType === "url" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Đường dẫn liên kết (URL)
              </label>
              <input
                type="url"
                placeholder="https://zeebee.vn hoặc tên miền..."
                value={url}
                onChange={(e) => onChangeUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B6B7B] focus:border-transparent text-slate-900 bg-white shadow-inner"
              />
              <p className="text-xs text-slate-500 mt-2">
                Ví dụ: trang web công ty, trang mạng xã hội Facebook/Zalo, menu điện tử.
              </p>
            </div>
          </div>
        )}

        {activeType === "vietqr" && (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
              <span>Chuẩn Napas 247: Quét bằng app ngân hàng tự động điền STK & Số tiền</span>
              <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                Napas247
              </span>
            </div>

            {/* Bank Selector */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Chọn Ngân Hàng Thụ Hưởng
              </label>
              <button
                type="button"
                onClick={() => setIsBankOpen(!isBankOpen)}
                className="w-full px-4 py-3 text-left rounded-xl border border-slate-300 bg-white flex items-center justify-between shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1B6B7B]"
              >
                <div>
                  <span className="font-bold text-[#1B6B7B] mr-2">[{selectedBank.code}]</span>
                  <span className="font-medium text-slate-800">{selectedBank.shortName}</span>
                  <span className="text-xs text-slate-400 block truncate">{selectedBank.name}</span>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Đổi</span>
              </button>

              {isBankOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 max-h-64 overflow-y-auto">
                  <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Tìm tên ngân hàng, mã (VCB, MB, TCB...)"
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-sm border rounded-lg border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1B6B7B]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="p-1">
                    {filteredBanks.map((b) => (
                      <button
                        key={b.bin}
                        type="button"
                        onClick={() => {
                          onChangeVietqr({ ...vietqr, bankBin: b.bin });
                          setIsBankOpen(false);
                          setBankSearch("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                          b.bin === vietqr.bankBin
                            ? "bg-teal-50 text-[#1B6B7B] font-semibold"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-bold mr-1.5">[{b.code}]</span> {b.shortName}
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{b.name}</p>
                        </div>
                        <span className="text-xs text-slate-400">BIN: {b.bin}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account & Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Số tài khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0123456789"
                  value={vietqr.accountNumber}
                  onChange={(e) => onChangeVietqr({ ...vietqr, accountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900 font-mono font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Tên chủ tài khoản (không dấu)
                </label>
                <input
                  type="text"
                  placeholder="NGUYEN VAN A"
                  value={vietqr.accountName}
                  onChange={(e) =>
                    onChangeVietqr({ ...vietqr, accountName: e.target.value.toUpperCase() })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900 uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Số tiền (VNĐ - tùy chọn)
                </label>
                <input
                  type="number"
                  placeholder="Nhập số tiền chuyển"
                  value={vietqr.amount}
                  onChange={(e) => onChangeVietqr({ ...vietqr, amount: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nội dung chuyển khoản
                </label>
                <input
                  type="text"
                  placeholder="Thanh toan don hang #102..."
                  value={vietqr.message}
                  onChange={(e) => onChangeVietqr({ ...vietqr, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {activeType === "wifi" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Tên mạng Wi-Fi (SSID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Tên Wi-Fi nhà bạn hoặc văn phòng"
                value={wifi.ssid}
                onChange={(e) => onChangeWifi({ ...wifi, ssid: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Mật khẩu
                </label>
                <input
                  type="text"
                  placeholder="Mật khẩu Wi-Fi"
                  value={wifi.password}
                  onChange={(e) => onChangeWifi({ ...wifi, password: e.target.value })}
                  disabled={wifi.encryption === "nopass"}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Chuẩn bảo mật
                </label>
                <select
                  value={wifi.encryption}
                  onChange={(e) =>
                    onChangeWifi({ ...wifi, encryption: e.target.value as "WPA" | "WEP" | "nopass" })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900 bg-white"
                >
                  <option value="WPA">WPA/WPA2/WPA3 (Phổ biến)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Không có mật khẩu (Mạng mở)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="hiddenWifi"
                checked={wifi.hidden}
                onChange={(e) => onChangeWifi({ ...wifi, hidden: e.target.checked })}
                className="w-4 h-4 text-[#1B6B7B] rounded focus:ring-[#1B6B7B]"
              />
              <label htmlFor="hiddenWifi" className="text-sm text-slate-700 font-medium">
                Mạng Wi-Fi này bị ẩn (Hidden SSID)
              </label>
            </div>
          </div>
        )}

        {activeType === "vcard" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ & Tên đệm</label>
                <input
                  type="text"
                  placeholder="Trần Văn"
                  value={vcard.lastName}
                  onChange={(e) => onChangeVcard({ ...vcard, lastName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên</label>
                <input
                  type="text"
                  placeholder="An"
                  value={vcard.firstName}
                  onChange={(e) => onChangeVcard({ ...vcard, firstName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại</label>
                <input
                  type="tel"
                  placeholder="0912 345 678"
                  value={vcard.phone}
                  onChange={(e) => onChangeVcard({ ...vcard, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="an.tran@example.com"
                  value={vcard.email}
                  onChange={(e) => onChangeVcard({ ...vcard, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tổ chức / Công ty</label>
                <input
                  type="text"
                  placeholder="Zeebee Corporation"
                  value={vcard.organization}
                  onChange={(e) => onChangeVcard({ ...vcard, organization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chức vụ</label>
                <input
                  type="text"
                  placeholder="Giám đốc điều hành (CEO)"
                  value={vcard.title}
                  onChange={(e) => onChangeVcard({ ...vcard, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trang web</label>
              <input
                type="url"
                placeholder="https://zeebee.vn"
                value={vcard.website}
                onChange={(e) => onChangeVcard({ ...vcard, website: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
              />
            </div>
          </div>
        )}

        {activeType === "text" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung văn bản</label>
              <textarea
                rows={4}
                placeholder="Nhập bất kỳ đoạn văn bản, mã khuyến mãi, ghi chú bí mật..."
                value={text}
                onChange={(e) => onChangeText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] text-slate-900"
              />
            </div>
          </div>
        )}

        {activeType === "email" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ Email</label>
              <input
                type="email"
                placeholder="contact@company.com"
                value={email.email}
                onChange={(e) => onChangeEmail({ ...email, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tiêu đề thư</label>
              <input
                type="text"
                placeholder="Liên hệ hợp tác..."
                value={email.subject}
                onChange={(e) => onChangeEmail({ ...email, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung thư mẫu</label>
              <textarea
                rows={3}
                placeholder="Tôi muốn tìm hiểu thêm về dịch vụ..."
                value={email.body}
                onChange={(e) => onChangeEmail({ ...email, body: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B]"
              />
            </div>
          </div>
        )}

        {activeType === "phone" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số điện thoại</label>
              <input
                type="tel"
                placeholder="0912345678"
                value={phone.phone}
                onChange={(e) => onChangePhone({ ...phone, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1B6B7B] font-mono text-lg"
              />
              <p className="text-xs text-slate-500 mt-2">
                Khi quét mã QR này trên điện thoại, máy sẽ tự động bật ứng dụng gọi điện thoại.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
