import { boolean, check, pgSchema, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const app = pgSchema('app');

export const user = app.table(
  'user',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    email: text('email').unique().notNull(),
    firstName: text('first_name').notNull().default(''),
    middleName: text('middle_name').notNull().default(''),
    lastName: text('last_name').notNull().default(''),
    phoneNumber: text('phone_number').unique().notNull(),
    avatarUrl: text('avatar_url'),
    emailVerified: boolean('email_verified').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ email, phoneNumber }) => [
    check('user_email_non_empty', sql`${email} <> ''`),
    check('user_phone_number_non_empty', sql`${phoneNumber} <> ''`),
  ],
);
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const role = app.table('role', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull().unique(),
});
export type Role = typeof role.$inferSelect;
export type NewRole = typeof role.$inferInsert;

export const userRole = app.table(
  'user_role',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => role.id, { onUpdate: 'cascade' }),
    assigned_at: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
  },
  ({ userId, roleId }) => [primaryKey({ columns: [userId, roleId] })],
);
export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = typeof userRole.$inferInsert;
