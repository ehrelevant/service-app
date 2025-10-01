import { pgSchema, serial, varchar } from "drizzle-orm/pg-core";

export const app = pgSchema('app');

export const user = app.table("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 256 })
});