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
      SELECT id, guest_name, attendance, guest_count, message, created_at 
      FROM rsvps 
      ORDER BY created_at DESC
    `;
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
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

    // Sanitasi
    const guest_name = sanitize(rawData.guest_name);
    const phone = sanitize(rawData.phone);
    const message = sanitize(rawData.message);
    const attendance = rawData.attendance;
    const guest_count = rawData.guest_count;

    // Cek Data Lama
    const existingRows = await sql`
      SELECT id FROM rsvps WHERE guest_name = ${guest_name}
    `;
    const existingGuest = existingRows[0] as { id: number } | undefined;

    let actionType = "";
    let resultId = 0;

    if (existingGuest) {
      // UPDATE
      await sql`
        UPDATE rsvps 
        SET phone = ${phone}, 
            attendance = ${attendance}, 
            guest_count = ${guest_count}, 
            message = ${message || ""},
            created_at = NOW()
        WHERE id = ${existingGuest.id}
      `;
      actionType = "updated";
      resultId = existingGuest.id;
    } else {
      // INSERT
      const result = await sql`
        INSERT INTO rsvps (guest_name, phone, attendance, guest_count, message, created_at)
        VALUES (${guest_name}, ${phone}, ${attendance}, ${guest_count}, ${message || ""}, NOW())
        RETURNING id
      `;
      actionType = "created";
      resultId = result[0]?.id || 0;
    }

    // --- LOGIC NOTIFIKASI TELEGRAM ---

    // 1. Tentukan Judul Berdasarkan Aksi
    const title =
      actionType === "created"
        ? "💌 <b>RSVP BARU MASUK!</b>"
        : "♻️ <b>PEMBARUAN DATA RSVP!</b>";

    // 2. Tentukan Emoji Status
    const statusEmoji =
      attendance === "hadir" ? "✅" : attendance === "ragu" ? "🤔" : "❌";

    // 3. Susun Pesan
    const notifMsg = `
${title}

👤 <b>Nama:</b> ${guest_name}
${statusEmoji} <b>Status:</b> ${attendance.toUpperCase()}
👥 <b>Jml:</b> ${attendance === "hadir" ? guest_count + " Orang" : "-"}
📞 <b>Kontak:</b> ${phone || "-"}

💬 <b>Pesan:</b>
<i>"${message || "-"}"</i>
    `.trim();

    // 4. Kirim
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
