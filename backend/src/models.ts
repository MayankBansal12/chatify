import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Messages Table - For each message
export const messages = pgTable('messages', {
  messageId: uuid('message_id').primaryKey().defaultRandom(),
  chatId: uuid('chat_id').references(() => chats.chatId).notNull(),
  content: text('content').notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  attachment: text('attachment').default(""),
  timestamp: timestamp('timestamp').defaultNow(),
  isDeleted: boolean('is_deleted').default(false),
});

// Chats Table - b/w two participants
export const chats = pgTable('chats', {
  chatId: uuid('chat_id').primaryKey().notNull(),
  participants: uuid('participant').array().notNull(),
  archived: uuid('archived_by').array(),
  blocked: uuid('blocked_by').array(),
  timestamp: timestamp('timestamp').defaultNow(),
});
