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
    const connectionString = process.env.DATABASE_URL as string;
    const pool = new Pool({ connectionString });
    this.db = drizzle(pool, { schema, casing: 'snake_case' });
  }
}
