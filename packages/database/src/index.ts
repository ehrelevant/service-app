import { drizzle } from 'drizzle-orm/node-postgres';
import { parse, string } from 'valibot';
import { Pool } from 'pg';

import * as schema from './schema';

// Parses and asserts that DATABASE_URL is of type string
const connectionString = parse(string(), process.env.DATABASE_URL)

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema, casing: 'snake_case' });

export * from './schema';