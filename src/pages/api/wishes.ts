import type { APIRoute } from "astro";
import sql from "../../lib/db";
import { checkRateLimit } from "../../lib/rateLimit";
import { sendTelegramNotification } from "../../utils/telegram";

const sanitize = (str: string) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const GET: APIRoute = async () => {
  try {
    const rows = await sql`
      SELECT * FROM wishes ORDER BY created_at DESC
    `;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || "unknown";

  if (!checkRateLimit(ip, 5, 60000)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429 }
    );
  }

  try {
    const rawData = await request.json();
    const name = sanitize(rawData.name);
    const message = sanitize(rawData.message);

    const existingRows = await sql`
      SELECT id FROM wishes WHERE name = ${name}
    `;
    const existingWish = existingRows[0] as { id: number } | undefined;

    let actionType = "";
    let resultId = 0;

    if (existingWish) {
      // UPDATE
      await sql`
        UPDATE wishes 
        SET message = ${message}, created_at = NOW()
        WHERE id = ${existingWish.id}
      `;
      actionType = "updated";
      resultId = existingWish.id;
    } else {
      // INSERT
      const result = await sql`
        INSERT INTO wishes (name, message, created_at) 
        VALUES (${name}, ${message}, NOW())
        RETURNING id
      `;
      actionType = "created";
      resultId = result[0]?.id || 0;
    }

    // --- LOGIC NOTIFIKASI TELEGRAM ---

    // 1. Tentukan Judul
    const title =
      actionType === "created"
        ? "✨ <b>UCAPAN & DOA BARU!</b>"
        : "📝 <b>UCAPAN DIPERBARUI!</b>";

    // 2. Susun Pesan
    const notifMsg = `
${title}

👤 <b>Dari:</b> ${name}

<i>"${message}"</i>
    `.trim();

    // 3. Kirim
    sendTelegramNotification(notifMsg);

    return new Response(
      JSON.stringify({
        success: true,
        id: resultId,
        action: actionType,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
};
