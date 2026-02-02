import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { WEDDING_CONFIG, WEDDING_TEXT, BANK_ACCOUNTS, LOVE_STORY, GALLERY_IMAGES, MUSIC_URL, MAX_GUESTS } from "../constants";

// Settings fetched from database
export interface DynamicSettings {
    // Hero
    hero_image: string;
    hero_city: string;
    hero_date: string;
    gift_address: string;
    // Bride
    bride_nickname: string;
    bride_fullname: string;
    bride_image: string;
    bride_parents: string;
    bride_instagram: string;
    // Groom
    groom_nickname: string;
    groom_fullname: string;
    groom_image: string;
    groom_parents: string;
    groom_instagram: string;
    // Akad
    akad_title: string;
    akad_day: string;
    akad_date: string;
    akad_start: string;
    akad_end: string;
    akad_iso_start: string;
    akad_iso_end: string;
    akad_venue_name: string;
    akad_venue_address: string;
    akad_venue_maps: string;
    // Resepsi
    resepsi_title: string;
    resepsi_day: string;
    resepsi_date: string;
    resepsi_start: string;
    resepsi_end: string;
    resepsi_iso_start: string;
    resepsi_iso_end: string;
    resepsi_venue_name: string;
    resepsi_venue_address: string;
    resepsi_venue_maps: string;
    // Others
    music_url: string;
    max_guests: string;
    bank_accounts: string;
    love_story: string;
    gallery_images: string;
    closing_family: string;
    events_data: string;
}

// Merged config type that components use
export interface AppConfig {
    couple: {
        bride: {
            name: string;
            fullName: string;
            image: string;
            parents: string;
            instagram: string;
        };
        groom: {
            name: string;
            fullName: string;
            image: string;
            parents: string;
            instagram: string;
        };
    };
    events: Array<{
        id: string;
        title: string;
        day: string;
        date: string;
        startTime: string;
        endTime: string;
        startDateTime: Date;
        endDateTime: Date;
        side: "pria" | "wanita" | "both";
        venue: {
            name: string;
            address: string;
            mapsEmbedUrl: string;
        };
    }>;
    hero: {
        image: string;
        city: string;
        date: string;
    };
    musicUrl: string;
    maxGuests: number;
    giftAddress: string;
    bankAccounts: Array<{ bank: string; number: string; name: string }>;
    loveStory: Array<{ date: string; title: string; desc: string }>;
    galleryImages: string[];
    closingFamily: string;
}

interface SettingsContextType {
    config: AppConfig;
    isLoading: boolean;
    text: typeof WEDDING_TEXT;
}

// Default config from constants.tsx (fallback)
const defaultConfig: AppConfig = {
    couple: WEDDING_CONFIG.couple,
    events: [
        {
            id: "akad",
            title: WEDDING_CONFIG.events.akad.title,
            day: WEDDING_CONFIG.events.akad.day,
            date: WEDDING_CONFIG.events.akad.date,
            startTime: WEDDING_CONFIG.events.akad.startTime,
            endTime: WEDDING_CONFIG.events.akad.endTime,
            startDateTime: WEDDING_CONFIG.events.akad.startDateTime,
            endDateTime: WEDDING_CONFIG.events.akad.endDateTime,
            side: "both",
            venue: WEDDING_CONFIG.events.akad.venue,
        },
        {
            id: "resepsi",
            title: WEDDING_CONFIG.events.resepsi.title,
            day: WEDDING_CONFIG.events.resepsi.day,
            date: WEDDING_CONFIG.events.resepsi.date,
            startTime: WEDDING_CONFIG.events.resepsi.startTime,
            endTime: WEDDING_CONFIG.events.resepsi.endTime,
            startDateTime: WEDDING_CONFIG.events.resepsi.startDateTime,
            endDateTime: WEDDING_CONFIG.events.resepsi.endDateTime,
            side: "both",
            venue: WEDDING_CONFIG.events.resepsi.venue,
        },
    ],
    hero: {
        ...WEDDING_CONFIG.hero,
        date: WEDDING_CONFIG.events.akad.date,
    },
    musicUrl: MUSIC_URL,
    maxGuests: MAX_GUESTS,
    giftAddress: "",
    bankAccounts: BANK_ACCOUNTS,
    loveStory: LOVE_STORY,
    galleryImages: GALLERY_IMAGES,
    closingFamily: WEDDING_TEXT.closing.family,
};

const SettingsContext = createContext<SettingsContextType>({
    config: defaultConfig,
    isLoading: true,
    text: WEDDING_TEXT,
});

export const useSettings = () => useContext(SettingsContext);

// Helper to parse JSON safely
const parseJson = <T,>(jsonString: string | undefined, defaultValue: T): T => {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString) as T;
    } catch (e) {
        return defaultValue;
    }
};

// Format date from YYYY-MM-DD to Indonesian format "8 Februari 2026"
const formatHeroDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr; // Return as-is if invalid
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
        return dateStr;
    }
};

// Parse events_data JSON with legacy fallback
type EventItemRaw = {
    id: string;
    title: string;
    day: string;
    date: string;
    startTime: string;
    endTime: string;
    isoStart: string;
    isoEnd: string;
    venueName: string;
    venueAddress: string;
    venueMaps: string;
    side?: "pria" | "wanita" | "both";
};

const parseEventsData = (settings: Partial<DynamicSettings>): AppConfig["events"] => {
    const heroDate = settings.hero_date; // Expected YYYY-MM-DD

    // Helper to sync a Date object with a YYYY-MM-DD string
    const syncWithHeroDate = (dateObj: Date, heroDateStr: string | undefined): Date => {
        if (!heroDateStr) return dateObj;
        try {
            const [y, m, d] = heroDateStr.split("-").map(Number);
            const result = new Date(dateObj);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                result.setFullYear(y, m - 1, d);
            }
            return result;
        } catch {
            return dateObj;
        }
    };

    let events: AppConfig["events"] = [];

    // 1. Try to parse events_data JSON first
    if (settings.events_data) {
        try {
            const rawEvents: EventItemRaw[] = JSON.parse(settings.events_data);
            events = rawEvents.map(e => ({
                id: e.id,
                title: e.title,
                day: e.day,
                date: e.date,
                startTime: e.startTime,
                endTime: e.endTime,
                startDateTime: syncWithHeroDate(e.isoStart ? new Date(e.isoStart) : new Date(), heroDate),
                endDateTime: syncWithHeroDate(e.isoEnd ? new Date(e.isoEnd) : new Date(), heroDate),
                side: (e.side as "pria" | "wanita" | "both") || "both",
                venue: {
                    name: e.venueName,
                    address: e.venueAddress,
                    mapsEmbedUrl: e.venueMaps,
                },
            }));
        } catch {
            // Fall through
        }
    }

    // 2. If no JSON events, try legacy akad/resepsi
    if (events.length === 0) {
        if (settings.akad_title || settings.akad_date || heroDate) {
            events.push({
                id: "akad",
                title: settings.akad_title || WEDDING_CONFIG.events.akad.title,
                day: settings.akad_day || (heroDate ? "" : WEDDING_CONFIG.events.akad.day),
                date: settings.akad_date || (heroDate ? formatHeroDate(heroDate) : WEDDING_CONFIG.events.akad.date),
                startTime: settings.akad_start || WEDDING_CONFIG.events.akad.startTime,
                endTime: settings.akad_end || WEDDING_CONFIG.events.akad.endTime,
                startDateTime: syncWithHeroDate(settings.akad_iso_start ? new Date(settings.akad_iso_start) : WEDDING_CONFIG.events.akad.startDateTime, heroDate),
                endDateTime: syncWithHeroDate(settings.akad_iso_end ? new Date(settings.akad_iso_end) : WEDDING_CONFIG.events.akad.endDateTime, heroDate),
                side: "both",
                venue: {
                    name: settings.akad_venue_name || WEDDING_CONFIG.events.akad.venue.name,
                    address: settings.akad_venue_address || WEDDING_CONFIG.events.akad.venue.address,
                    mapsEmbedUrl: settings.akad_venue_maps || WEDDING_CONFIG.events.akad.venue.mapsEmbedUrl,
                },
            });
        }

        if (settings.resepsi_title || settings.resepsi_date) {
            events.push({
                id: "resepsi",
                title: settings.resepsi_title || WEDDING_CONFIG.events.resepsi.title,
                day: settings.resepsi_day || WEDDING_CONFIG.events.resepsi.day,
                date: settings.resepsi_date || WEDDING_CONFIG.events.resepsi.date,
                startTime: settings.resepsi_start || WEDDING_CONFIG.events.resepsi.startTime,
                endTime: settings.resepsi_end || WEDDING_CONFIG.events.resepsi.endTime,
                startDateTime: syncWithHeroDate(settings.resepsi_iso_start ? new Date(settings.resepsi_iso_start) : WEDDING_CONFIG.events.resepsi.startDateTime, heroDate),
                endDateTime: syncWithHeroDate(settings.resepsi_iso_end ? new Date(settings.resepsi_iso_end) : WEDDING_CONFIG.events.resepsi.endDateTime, heroDate),
                side: "both",
                venue: {
                    name: settings.resepsi_venue_name || WEDDING_CONFIG.events.resepsi.venue.name,
                    address: settings.resepsi_venue_address || WEDDING_CONFIG.events.resepsi.venue.address,
                    mapsEmbedUrl: settings.resepsi_venue_maps || WEDDING_CONFIG.events.resepsi.venue.mapsEmbedUrl,
                },
            });
        }
    }

    // 3. Final default fallback
    if (events.length === 0) {
        return defaultConfig.events.map(e => ({
            ...e,
            startDateTime: syncWithHeroDate(e.startDateTime, heroDate),
            endDateTime: syncWithHeroDate(e.endDateTime, heroDate),
            date: heroDate ? formatHeroDate(heroDate) : e.date
        }));
    }

    return events;
};

// Convert database settings to AppConfig
const settingsToConfig = (settings: Partial<DynamicSettings>): AppConfig => {
    return {
        couple: {
            bride: {
                name: settings.bride_nickname || WEDDING_CONFIG.couple.bride.name,
                fullName: settings.bride_fullname || WEDDING_CONFIG.couple.bride.fullName,
                image: settings.bride_image || WEDDING_CONFIG.couple.bride.image,
                parents: settings.bride_parents || WEDDING_CONFIG.couple.bride.parents,
                instagram: settings.bride_instagram || WEDDING_CONFIG.couple.bride.instagram,
            },
            groom: {
                name: settings.groom_nickname || WEDDING_CONFIG.couple.groom.name,
                fullName: settings.groom_fullname || WEDDING_CONFIG.couple.groom.fullName,
                image: settings.groom_image || WEDDING_CONFIG.couple.groom.image,
                parents: settings.groom_parents || WEDDING_CONFIG.couple.groom.parents,
                instagram: settings.groom_instagram || WEDDING_CONFIG.couple.groom.instagram,
            },
        },
        events: parseEventsData(settings),
        hero: {
            image: settings.hero_image || WEDDING_CONFIG.hero.image,
            city: settings.hero_city || WEDDING_CONFIG.hero.city,
            date: formatHeroDate(settings.hero_date) || WEDDING_CONFIG.events.akad.date,
        },
        musicUrl: settings.music_url || MUSIC_URL,
        maxGuests: parseInt(settings.max_guests || String(MAX_GUESTS), 10),
        giftAddress: settings.gift_address || "",
        bankAccounts: parseJson(settings.bank_accounts, BANK_ACCOUNTS),
        loveStory: parseJson(settings.love_story, LOVE_STORY),
        galleryImages: parseJson(settings.gallery_images, GALLERY_IMAGES),
        closingFamily: settings.closing_family || WEDDING_TEXT.closing.family,
    };
};

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [config, setConfig] = useState<AppConfig>(defaultConfig);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Detect side from URL
                const params = new URLSearchParams(window.location.search);
                const side = params.get("side") === "wanita" ? "wanita" : "pria";

                const res = await fetch("/api/settings");
                if (res.ok) {
                    const allSettings = await res.json();

                    const isEventKey = (key: string) =>
                        key === "events_data" ||
                        key.startsWith("akad_") ||
                        key.startsWith("resepsi_");

                    // Shared settings (Bride, Groom, Hero, etc.) always come from "pria" side
                    // Event settings come from the requested side
                    const getSetting = (key: string): string => {
                        if (side === "wanita" && !isEventKey(key)) {
                            // Use "pria" prefix for shared info even if looking at "wanita" side
                            return allSettings[`pria_${key}`] ?? allSettings[key] ?? "";
                        }
                        // For "pria" side or event keys, use the requested side prefix
                        return allSettings[`${side}_${key}`] ?? allSettings[key] ?? "";
                    };

                    const sideSettings: Partial<DynamicSettings> = {
                        hero_image: getSetting("hero_image"),
                        hero_city: getSetting("hero_city"),
                        hero_date: getSetting("hero_date"),
                        gift_address: getSetting("gift_address"),
                        bride_nickname: getSetting("bride_nickname"),
                        bride_fullname: getSetting("bride_fullname"),
                        bride_image: getSetting("bride_image"),
                        bride_parents: getSetting("bride_parents"),
                        bride_instagram: getSetting("bride_instagram"),
                        groom_nickname: getSetting("groom_nickname"),
                        groom_fullname: getSetting("groom_fullname"),
                        groom_image: getSetting("groom_image"),
                        groom_parents: getSetting("groom_parents"),
                        groom_instagram: getSetting("groom_instagram"),
                        music_url: getSetting("music_url"),
                        max_guests: getSetting("max_guests"),
                        bank_accounts: getSetting("bank_accounts"),
                        love_story: getSetting("love_story"),
                        gallery_images: getSetting("gallery_images"),
                        closing_family: getSetting("closing_family"),
                        events_data: getSetting("events_data"),
                    };

                    setConfig(settingsToConfig(sideSettings));
                }
            } catch (e) {
                console.error("Failed to fetch settings:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ config, isLoading, text: WEDDING_TEXT }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
