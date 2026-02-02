import type { APIRoute } from "astro";
import sql from "../../lib/db";

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = cookies.get("wedding_admin_auth")?.value;
  if (auth !== "true") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    const { action, id, ids, data } = body;

    const targetIds = ids || (id ? [id] : []);
    if (targetIds.length === 0 && !data) {
      return new Response(JSON.stringify({ error: "No valid ID provided" }), {
        status: 400,
      });
    }

    // PostgreSQL uses $1, $2, etc. for parameters in some drivers, 
    // but the Neon driver's sql tagged template literal handles it automatically for us
    // if we pass variables. However, for "WHERE id IN (...)", 
    // we need to be careful with the neon driver since it doesn't support 
    // passing an array directly into an IN clause with the tagged template.

    // --- RSVP ACTIONS ---
    if (action === "update_rsvp") {
      const { guest_name, attendance, guest_count, message } = data;
      await sql`
        UPDATE rsvps 
        SET guest_name = ${guest_name}, 
            attendance = ${attendance}, 
            guest_count = ${guest_count}, 
            message = ${message},
            created_at = NOW()
        WHERE id = ${id}
      `;
      return new Response(JSON.stringify({ success: true }));
    }

    if (action === "delete_rsvp") {
      // In Neon, for multiple IDs, we can't easily use the tagged template for "IN (...)"
      // but we can loop or use a trick.
      for (const targetId of targetIds) {
        await sql`DELETE FROM rsvps WHERE id = ${targetId}`;
      }
      return new Response(JSON.stringify({ success: true }));
    }

    // --- WISHES ACTIONS ---
    if (action === "update_wish") {
      const { name, message } = data;
      await sql`
        UPDATE wishes 
        SET name = ${name}, 
            message = ${message},
            created_at = NOW()
        WHERE id = ${id}
      `;
      return new Response(JSON.stringify({ success: true }));
    }

    if (action === "delete_wish") {
      for (const targetId of targetIds) {
        await sql`DELETE FROM wishes WHERE id = ${targetId}`;
      }
      return new Response(JSON.stringify({ success: true }));
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
    });
  } catch (error: any) {
    console.error("Admin API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server Error" }),
      { status: 500 }
    );
  }
};
