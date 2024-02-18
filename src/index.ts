import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { db } from './db';
import { todos } from './db/schemas/todo';
import { eq } from 'drizzle-orm';
import todoRouter from './routes/todo';
const app = new Hono();

app.use(logger());

app.get('/hello', (c) => c.json({ ok: true, message: 'Hello World' }));

app.route('/todo', todoRouter);

app.notFound((c) => {
	return c.text('Custom 404 Message', 404);
});

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});

// export default app;
