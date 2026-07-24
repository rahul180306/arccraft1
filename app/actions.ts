"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
    // Requires DATABASE_URL to be set in the environment
    const sql = neon(process.env.DATABASE_URL!);
    // Placeholder query
    const data = await sql`SELECT 1 as connected`;
    return data;
}
