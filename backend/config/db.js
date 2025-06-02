import { neon } from '@neondatabase/serverless';
import  "dotenv/config";

//DB connection with DBURL from .env file
export const sql = neon(process.env.DATABASE_URL);