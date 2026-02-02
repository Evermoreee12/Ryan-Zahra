import type { APIRoute } from "astro";
import sql from "../../lib/db";

// GET - Fetch all settings
export const GET: APIRoute = async () => {
    try {
        const rows = await sql`
            SELECT setting_key, setting_value FROM settings
        `;

        // Convert array to object
        const settings: Record<string, string> = {};
        (rows as any[]).forEach((row) => {
            settings[row.setting_key] = row.setting_value;
        });

        return new Response(JSON.stringify(settings), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch settings" }), {
            status: 500,
        });
    }
};

// POST - Update settings (admin only)
export const POST: APIRoute = async ({ request, cookies }) => {
    const auth = cookies.get("wedding_admin_auth")?.value;
    if (auth !== "true") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    try {
        const settings = await request.json();

        // Upsert each setting using PostgreSQL ON CONFLICT
        for (const [key, value] of Object.entries(settings)) {
            await sql`
                INSERT INTO settings (setting_key, setting_value, updated_at) 
                VALUES (${key}, ${String(value)}, NOW())
                ON CONFLICT (setting_key) 
                DO UPDATE SET setting_value = ${String(value)}, updated_at = NOW()
            `;
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    } catch (error) {
        console.error("Failed to save settings:", error);
        return new Response(JSON.stringify({ error: "Failed to save settings" }), {
            status: 500,
        });
    }
};
