import { neon } from "@neondatabase/serverless";

// Priority list for environment variables in different runtimes
const getDbUrl = () => {
  // 1. Try Astro standard env (server-side)
  try {
    const url = (import.meta as any).env?.DATABASE_URL;
    if (url) return url;
  } catch (e) { }

  // 2. Try Node.js standard env (Vercel/Node runtime)
  try {
    const url = process.env.DATABASE_URL;
    if (url) return url;
  } catch (e) { }

  return "";
};

let DATABASE_URL = getDbUrl();

// Robustness: clean the URL string
if (DATABASE_URL) {
  DATABASE_URL = DATABASE_URL
    .replace(/^DATABASE_URL=/, "") // Strip accidental key
    .replace(/^['"]|['"]$/g, "")   // Strip accidental quotes
    .trim();
}

// Create the connection function
// Note: We don't call neon() if DATABASE_URL is empty to avoid early throw
const sql = DATABASE_URL ? neon(DATABASE_URL) : ((...args: any[]) => {
  console.error("❌ DATABASE_URL is missing! Queries will fail.");
  throw new Error("DATABASE_URL is not configured.");
}) as any;

// Initialize tables
async function initializeTables() {
  if (!DATABASE_URL) {
    console.error("⚠️ [DB] Cannot initialize tables: DATABASE_URL is empty.");
    return;
  }

  try {
    console.log("🚀 [DB] Initializing tables...");

    // Create rsvps table
    await sql`
            CREATE TABLE IF NOT EXISTS rsvps (
                id SERIAL PRIMARY KEY,
                guest_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                attendance VARCHAR(50),
                guest_count INT,
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Create wishes table
    await sql`
            CREATE TABLE IF NOT EXISTS wishes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    // Create settings table
    await sql`
            CREATE TABLE IF NOT EXISTS settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

    console.log("✅ [DB] Database tables ready.");
  } catch (error) {
    console.error("❌ [DB] Table initialization failed:", error);
  }
}

// Startup
if (DATABASE_URL) {
  initializeTables().catch(console.error);
}

export default sql;
