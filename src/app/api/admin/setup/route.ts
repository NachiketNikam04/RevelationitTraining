// ==============================================================================
// IMPORTANT: THIS FILE IS A ONE-TIME SETUP SCRIPT.
// DELETE THIS FILE AFTER RUNNING ONCE IN PRODUCTION TO PREVENT UNAUTHORIZED RESETS.
// ==============================================================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool, initDbSchema } from "@/backend/config/db";

export async function GET() {
  try {
    // 1. Create the table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
      );
    `);

    // 2. Hash the password "123456"
    const hash = await bcrypt.hash('123456', 10);

    // 3. Insert the admin user (Using ON CONFLICT to avoid errors if you run it twice)
    await pool.query(`
      INSERT INTO admins (username, password_hash) 
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING;
    `, ['admin@RiT.com', hash]);

    return NextResponse.json({ message: "Success! Table created and admin@RiT.com added to NeonDB." });
  } catch (error) {
    console.error("Setup Error:", error);
    return NextResponse.json({ error: "Failed to setup database" }, { status: 500 });
  }
}