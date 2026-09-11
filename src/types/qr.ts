export type QRType = 'url' | 'vietqr' | 'wifi' | 'text' | 'vcard' | 'email' | 'phone';

export interface VietQRData {
  bankBin: string;
  accountNumber: string;
  accountName: string;
  amount: string;
  message: string;
}

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  title: string;
  website: string;
}

export interface EmailData {
  email: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export type DotType = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
export type CornerDotType = 'square' | 'dot';

export interface QRStyleOptions {
  dotType: DotType;
  cornerSquareType: CornerSquareType;
  cornerDotType: CornerDotType;
  colorType: 'single' | 'gradient';
  singleColor: string;
  gradientColor1: string;
  gradientColor2: string;
  gradientRotation: number;
  bgColor: string;
  logoUrl: string;
  logoSize: number;
  logoMargin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
}
