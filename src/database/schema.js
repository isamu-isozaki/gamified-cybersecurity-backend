import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const flagsSchema = sqliteTable('flags', {
	id: integer('id').notNull().primaryKey(),
	flagHash: text('flagHash').notNull(),
	completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
});