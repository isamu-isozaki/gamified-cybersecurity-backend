/** @type { import("drizzle-kit").Config } */
export default {
	schema: './src/database/schema.js',
	driver: 'better-sqlite',
	out: './drizzle',
};