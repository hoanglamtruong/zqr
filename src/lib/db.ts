import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import { DynamicQRRecord } from "@/types/qr";
import { generateShortCode } from "./short-code";

const DB_PATH = process.env.ZQR_DB_PATH || path.join(process.cwd(), "data", "zqr.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __zqrDb: DatabaseSync | undefined;
}

const db = global.__zqrDb ?? new DatabaseSync(DB_PATH);
if (process.env.NODE_ENV !== "production") {
  global.__zqrDb = db;
}

db.exec("PRAGMA busy_timeout = 5000;");
db.exec("PRAGMA journal_mode = WAL;");

db.exec(`
  CREATE TABLE IF NOT EXISTS dynamic_qr (
    code TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    target_url TEXT NOT NULL,
    scan_count INTEGER NOT NULL DEFAULT 0,
    last_scanned_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

interface DynamicQRRow {
  code: string;
  title: string;
  target_url: string;
  scan_count: number;
  last_scanned_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToRecord(row: DynamicQRRow): DynamicQRRecord {
  return {
    code: row.code,
    title: row.title,
    targetUrl: row.target_url,
    scanCount: row.scan_count,
    lastScannedAt: row.last_scanned_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createDynamicQR(title: string, targetUrl: string): DynamicQRRecord {
  const existsStmt = db.prepare("SELECT 1 FROM dynamic_qr WHERE code = ?");
  let code = generateShortCode();
  while (existsStmt.get(code)) {
    code = generateShortCode();
  }

  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO dynamic_qr (code, title, target_url, scan_count, last_scanned_at, created_at, updated_at)
     VALUES (?, ?, ?, 0, NULL, ?, ?)`
  ).run(code, title, targetUrl, now, now);

  return getDynamicQR(code)!;
}

export function listDynamicQRs(): DynamicQRRecord[] {
  const rows = db
    .prepare("SELECT * FROM dynamic_qr ORDER BY created_at DESC")
    .all() as unknown as DynamicQRRow[];
  return rows.map(rowToRecord);
}

export function getDynamicQR(code: string): DynamicQRRecord | null {
  const row = db.prepare("SELECT * FROM dynamic_qr WHERE code = ?").get(code) as unknown as
    | DynamicQRRow
    | undefined;
  return row ? rowToRecord(row) : null;
}

export function updateDynamicQR(
  code: string,
  updates: { title?: string; targetUrl?: string }
): DynamicQRRecord | null {
  const existing = getDynamicQR(code);
  if (!existing) return null;

  const title = updates.title ?? existing.title;
  const targetUrl = updates.targetUrl ?? existing.targetUrl;
  const now = new Date().toISOString();

  db.prepare("UPDATE dynamic_qr SET title = ?, target_url = ?, updated_at = ? WHERE code = ?").run(
    title,
    targetUrl,
    now,
    code
  );

  return getDynamicQR(code);
}

export function deleteDynamicQR(code: string): boolean {
  const result = db.prepare("DELETE FROM dynamic_qr WHERE code = ?").run(code);
  return result.changes > 0;
}

export function recordScan(code: string): string | null {
  const existing = getDynamicQR(code);
  if (!existing) return null;

  const now = new Date().toISOString();
  db.prepare(
    "UPDATE dynamic_qr SET scan_count = scan_count + 1, last_scanned_at = ? WHERE code = ?"
  ).run(now, code);

  return existing.targetUrl;
}

export default db;
