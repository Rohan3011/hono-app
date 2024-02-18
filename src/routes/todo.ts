import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { todos } from '../db/schemas/todo';
import { db } from '../db';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const todoRouter = new Hono();

const todoSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	done: z.boolean().default(false),
});

todoRouter.get('/', async (ctx) => {
	const data = db.select().from(todos).all();
	return ctx.json({ ok: true, todos: data });
});

todoRouter.get('/:id', async (ctx) => {
	const id = ctx.req.param('id');

	const todo = db.select().from(todos).where(eq(todos.id, id)).get();
	if (!todo)
		return ctx.json({
			ok: false,
			message: `No todo with ${id} exists`,
		});

	return ctx.json({ ok: true, data: todo });
});

todoRouter.post('/', zValidator('json', todoSchema), async (ctx) => {
	const body = ctx.req.valid('json');
	const todo = await db.insert(todos).values(body).returning();
	return ctx.json({ ok: true, data: todo });
});

todoRouter.put('/:id', zValidator('json', todoSchema.partial()), async (ctx) => {
	const id = ctx.req.param('id');

	const body = ctx.req.valid('json');
	const todo = await db.update(todos).set(body).where(eq(todos.id, id)).returning();
	if (!todo.length)
		return ctx.json({
			ok: false,
			message: `No todo with ${id} exists`,
		});

	return ctx.json({ ok: true, data: todo });
});

todoRouter.delete('/:id', async (ctx) => {
	const id = ctx.req.param('id');

	const todo = await db.delete(todos).where(eq(todos.id, id)).returning();
	if (!todo.length)
		return ctx.json({
			ok: false,
			message: `No todo with ${id} exists`,
		});

	return ctx.json({ ok: true, data: todo });
});

export default todoRouter;
