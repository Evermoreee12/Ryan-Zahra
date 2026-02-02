import type { APIRoute } from "astro";
import fs from "fs";
import path from "path";

// Max file size: 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // Up to 10MB for audio
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "audio/mp3", "audio/wav"];
const UPLOAD_DIR = "public/uploads";

export const POST: APIRoute = async ({ request, cookies }) => {
    // Check admin auth
    const auth = cookies.get("wedding_admin_auth")?.value;
    if (auth !== "true") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400,
            });
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return new Response(
                JSON.stringify({ error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" }),
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return new Response(
                JSON.stringify({ error: "File too large. Max 5MB allowed" }),
                { status: 400 }
            );
        }

        // --- CLOUDINARY LOGIC ---
        const CLOUD_NAME = (import.meta as any).env?.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
        const UPLOAD_PRESET = (import.meta as any).env?.CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

        if (CLOUD_NAME && UPLOAD_PRESET) {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append("file", file);
            cloudinaryFormData.append("upload_preset", UPLOAD_PRESET);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
                {
                    method: "POST",
                    body: cloudinaryFormData,
                }
            );

            const data = await response.json();
            if (data.secure_url) {
                return new Response(JSON.stringify({ success: true, url: data.secure_url }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } else {
                throw new Error(data.error?.message || "Cloudinary upload failed");
            }
        }
        // --- END CLOUDINARY LOGIC ---

        // Vercel check: fail early if trying to write on Vercel without Cloudinary
        if (process.env.VERCEL) {
            return new Response(JSON.stringify({
                error: "Cannot upload to local disk on Vercel. Please configure CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET."
            }), {
                status: 500,
            });
        }

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const filename = `${timestamp}-${randomStr}.${ext}`;

        // Ensure upload directory exists
        const uploadPath = path.join(process.cwd(), UPLOAD_DIR);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Save file
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(uploadPath, filename);
        fs.writeFileSync(filePath, buffer);

        // Return the URL path
        const url = `/uploads/${filename}`;

        return new Response(JSON.stringify({ success: true, url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return new Response(JSON.stringify({ error: error.message || "Upload failed" }), {
            status: 500,
        });
    }
};
