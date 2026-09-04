import fs from 'fs';
import path from 'path';
import initSqlJs, { Database } from 'sql.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'capynews.sqlite');

let dbInstance: Database | null = null;

export async function getSqliteDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    try {
      const fileBuffer = fs.readFileSync(DB_PATH);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (e) {
      console.warn('[SQLite] Could not load existing sqlite file, creating fresh database:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Ensure tables exist
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      original_title TEXT,
      source TEXT NOT NULL,
      region TEXT NOT NULL,
      topic TEXT NOT NULL,
      country TEXT,
      language TEXT,
      source_url TEXT,
      published_at TEXT NOT NULL,
      source_timezone TEXT,
      summary TEXT,
      bias_score REAL,
      bias_direction TEXT,
      ahead_da_hora INTEGER,
      has_inconsistency_stamp INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      role TEXT,
      tier TEXT,
      verified INTEGER,
      status TEXT,
      location TEXT,
      device TEXT,
      read_count INTEGER,
      joined_at TEXT
    );

    CREATE TABLE IF NOT EXISTS user_telemetry (
      id TEXT PRIMARY KEY,
      country TEXT,
      region TEXT,
      timezone TEXT,
      gender TEXT,
      device TEXT,
      browser TEXT,
      preferred_topics TEXT,
      articles_read INTEGER,
      last_visit TEXT
    );
  `);

  persistSqliteDb();
  return dbInstance;
}

export function persistSqliteDb() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('[SQLite] Error persisting sqlite database to disk:', err);
  }
}

export async function syncJsonToSqlite(articles: any[], users: any[]) {
  const db = await getSqliteDb();
  
  // Sync articles
  const insertArticle = db.prepare(`
    INSERT OR REPLACE INTO articles (
      id, title, original_title, source, region, topic, country, language,
      source_url, published_at, source_timezone, summary, bias_score, bias_direction,
      ahead_da_hora, has_inconsistency_stamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const art of articles) {
    insertArticle.run([
      art.id,
      art.title,
      art.originalTitle || art.title,
      art.source,
      art.region,
      art.topic,
      art.country || 'GLOBAL',
      art.language || 'EN',
      art.sourceUrl || '',
      art.publishedAt,
      art.sourceTimezone || 'UTC',
      art.summary || '',
      art.biasScore || 0,
      art.biasDirection || 'center_factual',
      art.aheadDaHora ? 1 : 0,
      art.hasInconsistencyStamp ? 1 : 0
    ]);
  }
  insertArticle.free();

  // Sync users
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (
      id, username, name, email, role, tier, verified, status, location, device, read_count, joined_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of users) {
    insertUser.run([
      u.id,
      u.username,
      u.name,
      u.email,
      u.role,
      u.tier,
      u.verified ? 1 : 0,
      u.status,
      JSON.stringify(u.location || {}),
      u.device || 'desktop',
      u.readCount || 0,
      u.joinedAt || new Date().toISOString()
    ]);
  }
  insertUser.free();

  persistSqliteDb();
  console.log('[SQLite] Synced articles and users to /data/capynews.sqlite');
}
