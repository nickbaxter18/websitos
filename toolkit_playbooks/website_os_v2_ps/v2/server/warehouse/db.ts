import Database from "better-sqlite3";

const db = new Database(process.env.WAREHOUSE_DB || "warehouse.db");
db.pragma("journal_mode = WAL");

// core events table
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    type TEXT,
    ts INTEGER,
    payload TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_events_uid ON events(uid);
  CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
`);

// idempotency table for webhooks
db.exec(`
  CREATE TABLE IF NOT EXISTS processed_events (
    event_id TEXT PRIMARY KEY,
    ts INTEGER
  );
`);

export function insertEvent(e: { uid: string; type: string; ts: number; payload: any }) {
  db.prepare("INSERT INTO events(uid,type,ts,payload) VALUES (?,?,?,?)").run(
    e.uid,
    e.type,
    e.ts,
    JSON.stringify(e.payload || {})
  );
}

export function hasProcessed(eventId: string) {
  return !!db.prepare("SELECT 1 FROM processed_events WHERE event_id=?").get(eventId);
}

export function markProcessed(eventId: string) {
  db.prepare("INSERT OR IGNORE INTO processed_events(event_id,ts) VALUES (?,?)").run(
    eventId,
    Date.now()
  );
}

export default db;
