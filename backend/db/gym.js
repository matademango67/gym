import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DB_CONNECTIONSTRING,
});

export async function connectDB() {
  try {
    const client = await pool.connect();

    console.log('✅ PostgreSQL connected');

    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
  }
}