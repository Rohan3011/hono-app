import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 } from 'uuid';

export const todos = sqliteTable('todos', {
	id: text('id')
		.primaryKey()
		.$default(() => v4()),
	title: text('title'),
	description: text('description'),
	done: integer('done', { mode: 'boolean' }),
});
