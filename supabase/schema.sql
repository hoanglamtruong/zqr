-- ===================================================
-- zQR · SUPABASE DATABASE SCHEMA
-- Bảng lưu trữ mã QR, mã QR động và thống kê lượt quét
-- ===================================================

-- 1. BẢNG QR_CODES
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL DEFAULT 'Mã QR của tôi',
    type TEXT NOT NULL DEFAULT 'url', -- url, vietqr, wifi, vcard, text, email, phone
    is_dynamic BOOLEAN NOT NULL DEFAULT false,
    destination_url TEXT NOT NULL DEFAULT '',
    qr_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Toàn bộ style (màu, logo, kiểu hạt, v.v.)
    scan_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index cho tra cứu nhanh khi quét mã động
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON public.qr_codes (short_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON public.qr_codes (created_at DESC);

-- 2. BẢNG QR_SCANS (Thống kê lượt quét chi tiết)
CREATE TABLE IF NOT EXISTS public.qr_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    qr_id UUID REFERENCES public.qr_codes(id) ON DELETE CASCADE,
    short_code TEXT NOT NULL,
    device_type TEXT DEFAULT 'other', -- mobile, desktop, tablet
    user_agent TEXT,
    scanned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_id ON public.qr_scans (qr_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON public.qr_scans (scanned_at DESC);

-- 3. HÀM GHI NHẬN LƯỢT QUÉT ATOMIC
CREATE OR REPLACE FUNCTION public.record_qr_scan(
    p_short_code TEXT,
    p_device TEXT DEFAULT 'other',
    p_ua TEXT DEFAULT ''
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_qr_id UUID;
    v_dest TEXT;
BEGIN
    -- Tìm mã QR và tăng lượt quét
    UPDATE public.qr_codes
    SET scan_count = scan_count + 1,
        updated_at = now()
    WHERE short_code = p_short_code
    RETURNING id, destination_url INTO v_qr_id, v_dest;

    IF v_qr_id IS NOT NULL THEN
        -- Ghi log phân tích
        INSERT INTO public.qr_scans (qr_id, short_code, device_type, user_agent, scanned_at)
        VALUES (v_qr_id, p_short_code, p_device, p_ua, now());
        RETURN v_dest;
    END IF;

    RETURN NULL;
END;
$$;

-- 4. BẬT RLS (ROW LEVEL SECURITY)
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_scans ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc công khai
CREATE POLICY "Cho phép đọc mã QR công khai" 
    ON public.qr_codes FOR SELECT 
    USING (true);

-- Cho phép tạo mới mã QR
CREATE POLICY "Cho phép tạo mã QR" 
    ON public.qr_codes FOR INSERT 
    WITH CHECK (true);

-- Cho phép cập nhật mã QR (sửa link đích)
CREATE POLICY "Cho phép cập nhật mã QR" 
    ON public.qr_codes FOR UPDATE 
    USING (true);

-- Cho phép xoá mã QR
CREATE POLICY "Cho phép xoá mã QR" 
    ON public.qr_codes FOR DELETE 
    USING (true);

-- Cho phép đọc log quét
CREATE POLICY "Cho phép đọc lịch sử quét" 
    ON public.qr_scans FOR SELECT 
    USING (true);

-- Cho phép ghi log quét
CREATE POLICY "Cho phép ghi log quét" 
    ON public.qr_scans FOR INSERT 
    WITH CHECK (true);
