// Client-side settings service
// Fetches settings from API and provides them to React components

export interface AppSettings {
    hero_image: string;
    hero_city: string;
    bride_nickname: string;
    bride_fullname: string;
    bride_image: string;
    bride_parents: string;
    bride_instagram: string;
    groom_nickname: string;
    groom_fullname: string;
    groom_image: string;
    groom_parents: string;
    groom_instagram: string;
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
    music_url: string;
    max_guests: string;
    bank_accounts: string;
    love_story: string;
    gallery_images: string;
    closing_family: string;
}

type SettingsListener = () => void;

class SettingsService {
    private settings: AppSettings | null = null;
    private listeners: SettingsListener[] = [];
    private loading = false;
    private loaded = false;

    async fetch(): Promise<AppSettings> {
        if (this.settings) return this.settings;
        if (this.loading) {
            // Wait for existing fetch to complete
            return new Promise((resolve) => {
                const check = () => {
                    if (this.settings) {
                        resolve(this.settings);
                    } else {
                        setTimeout(check, 50);
                    }
                };
                check();
            });
        }

        this.loading = true;
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                this.settings = await res.json();
                this.loaded = true;
                this.notifyListeners();
            }
        } catch (e) {
            console.error('Failed to fetch settings:', e);
        } finally {
            this.loading = false;
        }

        return this.settings!;
    }

    get(): AppSettings | null {
        return this.settings;
    }

    isLoaded(): boolean {
        return this.loaded;
    }

    subscribe(listener: SettingsListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach((l) => l());
    }
}

export const settingsService = new SettingsService();
