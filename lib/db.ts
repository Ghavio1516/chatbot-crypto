import { Pool } from "pg";

const hasDatabaseUrl = !!process.env.DATABASE_URL;

export const pool = new Pool(
  hasDatabaseUrl
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        // ssl: { rejectUnauthorized: false }, // aktifkan bila perlu
      }
);

export async function query<T = any>(text: string, params?: any[]) {
  return pool.query<T>(text, params);
}
