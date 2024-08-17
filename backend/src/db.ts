import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { chats, messages, users } from './models';

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const db = drizzle(pool, {
  schema: {
    users,
    messages,
    chats,
  },
});