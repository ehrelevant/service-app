import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './app';

export const auth = pgSchema('auth');

export const session = auth.table('session', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export const account = auth.table('account', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export const verification = auth.table('verification', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;