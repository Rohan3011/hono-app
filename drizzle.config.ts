import type { Config } from 'drizzle-kit';
export default {
	schema: './src/db/schemas/*.ts',
	out: './drizzle',
	driver: 'better-sqlite',
	dbCredentials: {
		url: './sqlite.db',
	},
} satisfies Config;
