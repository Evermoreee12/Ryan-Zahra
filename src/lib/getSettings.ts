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
    // Akad (Legacy)
    akad_title?: string;
    akad_day?: string;
    akad_date?: string;
    akad_start?: string;
    akad_end?: string;
    akad_iso_start?: string;
    akad_iso_end?: string;
    // Resepsi (Legacy)
    resepsi_title?: string;
    resepsi_day?: string;
    resepsi_date?: string;
    resepsi_start?: string;
    resepsi_end?: string;
    resepsi_iso_start?: string;
    resepsi_iso_end?: string;
    // Hero
    hero_image: string;
    hero_city: string;
    hero_date: string;
    // Misc
    music_url: string;
    max_guests: string;
    gift_address: string;
    // JSON fields
    bank_accounts: string;
    love_story: string;
    gallery_images: string;
    events_data: string;
    // Closing text
    closing_family: string;
    // Legacy fields (optional)
    [key: string]: string | undefined;
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
    hero_image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    hero_city: "Kab. Pandeglang, Banten",
    hero_date: "",
    music_url: "https://www.bensound.com/bensound-music/bensound-forever.mp3",
    max_guests: "20",
    gift_address: "",
    bank_accounts: "[]",
    love_story: "[]",
    gallery_images: "[]",
    events_data: "",
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
        // Preference order: 
        // 1. Current side specific keys (pria_*, wanita_*) - handled by consumer usually
        // 2. Global keys in DB
        // 3. Defaults
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
                title: settings.akad_title || "Akad Nikah",
                day: settings.akad_day || "Minggu",
                date: settings.akad_date || "11 Oktober 2025",
                startTime: settings.akad_start || "08:00",
                endTime: settings.akad_end || "10:00",
                startDateTime: new Date(settings.akad_iso_start || "2025-10-11T08:00:00+07:00"),
                endDateTime: new Date(settings.akad_iso_end || "2025-10-11T10:00:00+07:00"),
            },
            resepsi: {
                title: settings.resepsi_title || "Resepsi Pernikahan",
                day: settings.resepsi_day || "Minggu",
                date: settings.resepsi_date || "11 Oktober 2025",
                startTime: settings.resepsi_start || "11:00",
                endTime: settings.resepsi_end || "14:00",
                startDateTime: new Date(settings.resepsi_iso_start || "2025-10-11T11:00:00+07:00"),
                endDateTime: new Date(settings.resepsi_iso_end || "2025-10-11T14:00:00+07:00"),
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
