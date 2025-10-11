import 'dotenv/config';
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { Pool } from "pg";
import * as schema from '@repo/database';
import { drizzle } from "drizzle-orm/node-postgres";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema, casing: 'snake_case' });

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    debugLogs: true,
  }),
  plugins: [expo()],
  trustedOrigins: [
    'provider-app://'
  ],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    fields: {
      name: 'firstName'
    },
    additionalFields: {
      phoneNumber: {
        type: 'string',
        required: true,
        input: true
      },
      middleName: {
        type: 'string',
        required: false,
        input: true
      },
      lastName: {
        type: 'string',
        required: true,
        input: true
      },
    }
  },
  advanced: {
    database: {
      generateId: false,
    }
  }
});