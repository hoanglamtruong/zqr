export interface Bank {
  bin: string;
  shortName: string;
  name: string;
  code: string;
}

export const VIETNAMESE_BANKS: Bank[] = [
  { bin: "970436", shortName: "Vietcombank", name: "Ngân hàng TMCP Ngoại thương Việt Nam", code: "VCB" },
  { bin: "970422", shortName: "MBBank", name: "Ngân hàng TMCP Quân đội", code: "MB" },
  { bin: "970407", shortName: "Techcombank", name: "Ngân hàng TMCP Kỹ thương Việt Nam", code: "TCB" },
  { bin: "970415", shortName: "VietinBank", name: "Ngân hàng TMCP Công thương Việt Nam", code: "CTG" },
  { bin: "970418", shortName: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", code: "BIDV" },
  { bin: "970405", shortName: "Agribank", name: "Ngân hàng Nông nghiệp & PT Nông thôn Việt Nam", code: "VBA" },
  { bin: "970432", shortName: "VPBank", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", code: "VPB" },
  { bin: "970416", shortName: "ACB", name: "Ngân hàng TMCP Á Châu", code: "ACB" },
  { bin: "970423", shortName: "TPBank", name: "Ngân hàng TMCP Tiên Phong", code: "TPB" },
  { bin: "970403", shortName: "Sacombank", name: "Ngân hàng TMCP Sài Gòn Thương Tín", code: "STB" },
  { bin: "970437", shortName: "HDBank", name: "Ngân hàng TMCP Phát triển TP.HCM", code: "HDB" },
  { bin: "970441", shortName: "VIB", name: "Ngân hàng TMCP Quốc tế Việt Nam", code: "VIB" },
  { bin: "970443", shortName: "SHB", name: "Ngân hàng TMCP Sài Gòn - Hà Nội", code: "SHB" },
  { bin: "970431", shortName: "Eximbank", name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", code: "EIB" },
  { bin: "970426", shortName: "MSB", name: "Ngân hàng TMCP Hàng Hải", code: "MSB" },
  { bin: "970440", shortName: "SeABank", name: "Ngân hàng TMCP Đông Nam Á", code: "SEAB" },
  { bin: "970448", shortName: "OCB", name: "Ngân hàng TMCP Phương Đông", code: "OCB" },
  { bin: "970449", shortName: "LPBank", name: "Ngân hàng TMCP Lộc Phát Việt Nam", code: "LPB" },
  { bin: "970428", shortName: "NamABank", name: "Ngân hàng TMCP Nam Á", code: "NAB" },
  { bin: "970454", shortName: "BVBank", name: "Ngân hàng TMCP Bản Việt", code: "BVB" },
  { bin: "970409", shortName: "BacABank", name: "Ngân hàng TMCP Bắc Á", code: "BAB" },
  { bin: "970438", shortName: "BaoVietBank", name: "Ngân hàng TMCP Bảo Việt", code: "BVB" },
  { bin: "970452", shortName: "Kienlongbank", name: "Ngân hàng TMCP Kiên Long", code: "KLB" },
  { bin: "970400", shortName: "Saigonbank", name: "Ngân hàng TMCP Sài Gòn Công Thương", code: "SGB" },
  { bin: "970430", shortName: "PGBank", name: "Ngân hàng TMCP Thịnh vượng và Phát triển", code: "PGB" },
  { bin: "970424", shortName: "ShinhanBank", name: "Ngân hàng TNHH MTV Shinhan Việt Nam", code: "SHBVN" },
  { bin: "970457", shortName: "WooriBank", name: "Ngân hàng TNHH MTV Woori Việt Nam", code: "WOO" },
  { bin: "546034", shortName: "Cake by VPBank", name: "Ngân hàng số Cake by VPBank", code: "CAKE" },
  { bin: "963388", shortName: "Timo by BVBank", name: "Ngân hàng số Timo by BVBank", code: "TIMO" },
  { bin: "971005", shortName: "ViettelMoney", name: "Tổng Công ty Dịch vụ Số Viettel", code: "VTLMONEY" },
  { bin: "971011", shortName: "VNPTMoney", name: "Tập đoàn Bưu chính Viễn thông Việt Nam", code: "VNPTMONEY" },
];

function formatTLV(tag: string, value: string): string {
  if (!value) return "";
  const len = value.length.toString().padStart(2, "0");
  return `${tag}${len}${value}`;
}

/**
 * Tính toán mã kiểm tra CRC16-CCITT (False) với đa thức 0x1021, init 0xFFFF
 */
function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Tạo chuỗi dữ liệu Napas 247 EMVCo chuẩn cho VietQR
 */
export function generateVietQREMVCo(
  bankBin: string,
  accountNumber: string,
  amount?: string,
  message?: string
): string {
  if (!bankBin || !accountNumber) return "";

  // Tag 38: Merchant Account Information
  // 38.00: GUID "A000000727"
  // 38.01: Beneficiary (00: Bank BIN, 01: Account Number)
  // 38.02: Service Code "QRIBFTTA" (Chuyển khoản đến tài khoản)
  const beneficiary = formatTLV("00", bankBin) + formatTLV("01", accountNumber.trim());
  const merchantInfo =
    formatTLV("00", "A000000727") +
    formatTLV("01", beneficiary) +
    formatTLV("02", "QRIBFTTA");

  // Tag 62: Additional Data (Message)
  let additionalData = "";
  if (message && message.trim().length > 0) {
    additionalData = formatTLV("62", formatTLV("08", message.trim()));
  }

  // Tag 54: Amount (nếu có số tiền hợp lệ > 0)
  let amountField = "";
  const cleanAmount = (amount || "").replace(/[^0-9]/g, "");
  if (cleanAmount && parseInt(cleanAmount, 10) > 0) {
    amountField = formatTLV("54", cleanAmount);
  }

  const pointOfInitiation = cleanAmount ? "12" : "11"; // 12 nếu có tiền (dynamic), 11 nếu ko có (static)

  const payloadWithoutCRC =
    formatTLV("00", "01") + // Payload Format Indicator
    formatTLV("01", pointOfInitiation) +
    formatTLV("38", merchantInfo) +
    formatTLV("53", "704") + // VND
    amountField +
    formatTLV("58", "VN") + // Country Code
    additionalData +
    "6304"; // Tag 63 with length 04

  const checksum = crc16(payloadWithoutCRC);
  return payloadWithoutCRC + checksum;
}
