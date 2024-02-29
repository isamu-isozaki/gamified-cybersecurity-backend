import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { flagsSchema } from './schema.js';

export function getLabDatabase(p) {
	const dbPath = path.join(p, 'progress.db');
	const sqlite = new Database(dbPath);
	const db = drizzle(sqlite, { schema:{ flags: flagsSchema }});

	migrate(db, { migrationsFolder: 'drizzle' });
	return db;
}