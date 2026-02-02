import sql from "./db";

export interface WeddingSettings {
    // Bride
    bride_nickname: string;
    bride_fullname: string;
    bride_parents: string;
    bride_instagram: string;
    bride_image: string;
    // Groom
    groom_nickname: string;
    groom_fullname: string;
    groom_parents: string;
    groom_instagram: string;
    groom_image: string;
    // Venue
    venue_name: string;
    venue_address: string;
    venue_lat: string;
    venue_lng: string;
    // Akad
    akad_title: string;
    akad_day: string;
    akad_date: string;
    akad_start: string;
    akad_end: string;
    akad_iso_start: string;
    akad_iso_end: string;
    // Resepsi
    resepsi_title: string;
    resepsi_day: string;
    resepsi_date: string;
    resepsi_start: string;
    resepsi_end: string;
    resepsi_iso_start: string;
    resepsi_iso_end: string;
    // Hero
    hero_image: string;
    hero_city: string;
    // Misc
    music_url: string;
    max_guests: string;
    // JSON fields
    bank_accounts: string;
    love_story: string;
    gallery_images: string;
    // Closing text
    closing_family: string;
}

// Default settings (from .env values)
export const defaultSettings: WeddingSettings = {
    bride_nickname: "Fey",
    bride_fullname: "Fera Oktapia",
    bride_parents: "Putri tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
    bride_instagram: "feraoktapia___",
    bride_image: "https://placehold.co/600x800?text=Fey+Portrait",
    groom_nickname: "Yaya",
    groom_fullname: "Yahya Zulfikri",
    groom_parents: "Putra tercinta dari Bpk. [Nama Ayah] & Ibu [Nama Ibu]",
    groom_instagram: "zulfikriyahya_",
    groom_image: "https://placehold.co/600x800?text=Yaya+Portrait",
    venue_name: "The Royal Azure Ballroom",
    venue_address: "Jl. Taman Makam Pahlawan No.1, Kab. Pandeglang, Banten",
    venue_lat: "-6.2088",
    venue_lng: "106.8456",
    akad_title: "Akad Nikah",
    akad_day: "Minggu",
    akad_date: "11 Oktober 2025",
    akad_start: "08:00",
    akad_end: "10:00",
    akad_iso_start: "2025-10-11T08:00:00+07:00",
    akad_iso_end: "2025-10-11T10:00:00+07:00",
    resepsi_title: "Resepsi Pernikahan",
    resepsi_day: "Minggu",
    resepsi_date: "11 Oktober 2025",
    resepsi_start: "11:00",
    resepsi_end: "14:00",
    resepsi_iso_start: "2025-10-11T11:00:00+07:00",
    resepsi_iso_end: "2025-10-11T14:00:00+07:00",
    hero_image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    hero_city: "Kab. Pandeglang, Banten",
    music_url: "https://www.bensound.com/bensound-music/bensound-forever.mp3",
    max_guests: "20",
    bank_accounts: JSON.stringify([
        { bank: "Bank BCA", number: "1234567890", name: "Fera Oktapia" },
        { bank: "Bank Mandiri", number: "0987654321", name: "Yahya Zulfikri" },
    ]),
    love_story: JSON.stringify([
        { date: "2020", title: "Awal Pertemuan", desc: "Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna." },
        { date: "2022", title: "Menjalin Harapan", desc: "Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya." },
        { date: "2025", title: "Ikatan Suci", desc: "Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan." },
    ]),
    gallery_images: JSON.stringify([
        "https://placehold.co/800x1200?text=Moment+1",
        "https://placehold.co/1200x800?text=Moment+2",
        "https://placehold.co/800x800?text=Moment+3",
        "https://placehold.co/800x1200?text=Moment+4",
        "https://placehold.co/1200x800?text=Moment+5",
        "https://placehold.co/800x1200?text=Moment+6",
    ]),
    closing_family: "Kel. Bpk [Ayah Pria] & Kel. Bpk [Ayah Wanita]",
};

// Get settings from database, fallback to defaults
export async function getSettings(): Promise<WeddingSettings> {
    try {
        const rows = await sql`
            SELECT setting_key, setting_value FROM settings
        `;

        const dbSettings: Record<string, string> = {};
        (rows as any[]).forEach((row) => {
            dbSettings[row.setting_key] = row.setting_value;
        });

        // Merge with defaults
        return {
            ...defaultSettings,
            ...dbSettings,
        } as WeddingSettings;
    } catch (error) {
        console.error("Failed to fetch settings from DB:", error);
        return defaultSettings;
    }
}

// Convert settings to WeddingConfig format (for compatibility)
export function settingsToConfig(settings: WeddingSettings) {
    const parseJson = <T,>(jsonString: string, defaultValue: T): T => {
        try {
            return JSON.parse(jsonString) as T;
        } catch (e) {
            return defaultValue;
        }
    };

    return {
        couple: {
            bride: {
                name: settings.bride_nickname,
                fullName: settings.bride_fullname,
                parents: settings.bride_parents,
                instagram: settings.bride_instagram,
                image: settings.bride_image,
            },
            groom: {
                name: settings.groom_nickname,
                fullName: settings.groom_fullname,
                parents: settings.groom_parents,
                instagram: settings.groom_instagram,
                image: settings.groom_image,
            },
        },
        venue: {
            name: settings.venue_name,
            address: settings.venue_address,
            latitude: parseFloat(settings.venue_lat),
            longitude: parseFloat(settings.venue_lng),
        },
        events: {
            akad: {
                title: settings.akad_title,
                day: settings.akad_day,
                date: settings.akad_date,
                startTime: settings.akad_start,
                endTime: settings.akad_end,
                startDateTime: new Date(settings.akad_iso_start),
                endDateTime: new Date(settings.akad_iso_end),
            },
            resepsi: {
                title: settings.resepsi_title,
                day: settings.resepsi_day,
                date: settings.resepsi_date,
                startTime: settings.resepsi_start,
                endTime: settings.resepsi_end,
                startDateTime: new Date(settings.resepsi_iso_start),
                endDateTime: new Date(settings.resepsi_iso_end),
            },
        },
        hero: {
            image: settings.hero_image,
            city: settings.hero_city,
        },
        musicUrl: settings.music_url,
        maxGuests: parseInt(settings.max_guests, 10),
        bankAccounts: parseJson(settings.bank_accounts, []),
        loveStory: parseJson(settings.love_story, []),
        galleryImages: parseJson(settings.gallery_images, []),
        closingFamily: settings.closing_family,
    };
}
