import 'dotenv/config';
import * as schema from '@repo/database';

import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  db: NodePgDatabase<typeof schema>;
  schema: typeof schema = schema;

  constructor() {
    const connectionString = process.env.DATABASE_URL!;
    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    });
    this.db = drizzle(pool, { schema, casing: 'snake_case' });
  }
}
