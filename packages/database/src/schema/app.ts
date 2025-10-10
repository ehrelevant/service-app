import { boolean, check, date, pgSchema, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const app = pgSchema('app');

export const user = app.table(
  'user',
  {
    id: uuid().primaryKey().notNull().defaultRandom(),
    email: text().unique().notNull(),
    firstName: text().notNull().default(''),
    middleName: text().notNull().default(''),
    lastName: text().notNull().default(''),
    password: text().notNull(),
    phoneNumber: text().unique().notNull(),
    birthDate: date({ mode: 'date' }).notNull(),
    avatarUrl: text(),
    isVerified: boolean().notNull().default(false),
    createdAt: timestamp({ mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ mode: 'date', withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp({ mode: 'date', withTimezone: true }),
  },
  ({ email, phoneNumber }) => [
    check('user_email_non_empty', sql`${email} <> ''`),
    check('user_phone_number_non_empty', sql`${phoneNumber} <> ''`),
  ],
);
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const role = app.table('role', {
  id: uuid().primaryKey().notNull().defaultRandom(),
  name: text().notNull().unique(),
});
export type Role = typeof role.$inferSelect;
export type NewRole = typeof role.$inferInsert;

export const userRole = app.table(
  'user_role',
  {
    userId: uuid()
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade' }),
    roleId: uuid()
      .notNull()
      .references(() => role.id, { onUpdate: 'cascade' }),
    assigned_at: timestamp({ mode: 'date', withTimezone: true }).defaultNow(),
  },
  ({ userId, roleId }) => [primaryKey({ columns: [userId, roleId] })],
);
export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = typeof userRole.$inferInsert;
