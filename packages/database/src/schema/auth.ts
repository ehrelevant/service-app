import { pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './app';

export const auth = pgSchema('auth');

export const session = auth.table('session', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  token: text().notNull().unique(),
  expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  createdAt: timestamp({ mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date', withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export const account = auth.table('account', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  userId: uuid()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  accountId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  accessTokenExpiresAt: timestamp({ mode: 'date', withTimezone: true }),
  refreshTokenExpiresAt: timestamp({ mode: 'date', withTimezone: true }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date', withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export const verification = auth.table('verification', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp({ mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ mode: 'date', withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;