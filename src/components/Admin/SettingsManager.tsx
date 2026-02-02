import * as React from "react";
import { useEffect, useState } from "react";
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    User,
    Users,
    MapPin,
    Heart,
    PartyPopper,
    Image,
    CreditCard,
    BookHeart,
    Images,
    Gem,
    Upload,
    X,
    Music,
} from "lucide-react";

interface SettingsManagerProps {
    initialSettings: Record<string, string>;
}

interface BankAccount {
    bank: string;
    number: string;
    name: string;
}

interface LoveStoryItem {
    date: string;
    title: string;
    desc: string;
}

interface EventItem {
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
    side: "pria" | "wanita" | "both";
}

interface SectionHeaderProps {
    title: string;
    section: string;
    icon: any;
    expanded: boolean;
    onToggle: () => void;
}

const SectionHeader = ({ title, section, icon: Icon, expanded, onToggle }: SectionHeaderProps) => (
    <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg bg-slate-100 px-4 py-3 text-left font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
    >
        <span className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
        </span>
        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
);

interface InputFieldProps {
    label: string;
    settingKey: string;
    type?: string;
    placeholder?: string;
    activeSide: string;
    value: string;
    onUpdate: (key: string, value: string) => void;
}

const InputField = ({ label, settingKey, type = "text", placeholder, activeSide, value, onUpdate }: InputFieldProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const handleBlur = () => {
        if (inputRef.current) {
            onUpdate(settingKey, inputRef.current.value);
        }
    };

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
            <input
                ref={inputRef}
                key={`${activeSide}_${settingKey}`}
                type={type}
                defaultValue={value}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
        </div>
    );
};

interface DateTimePickerProps {
    label: string;
    dateKey: string;
    timeStartKey: string;
    timeEndKey: string;
    isoStartKey: string;
    isoEndKey: string;
    dayKey: string;
    displayDateKey: string;
    settings: Record<string, string>;
    onUpdate: (key: string, value: string) => void;
}

const DateTimePicker = ({
    label,
    dateKey,
    timeStartKey,
    timeEndKey,
    isoStartKey,
    isoEndKey,
    dayKey,
    displayDateKey,
    settings,
    onUpdate,
}: DateTimePickerProps) => {
    const getDateValue = () => {
        const iso = settings[isoStartKey];
        return iso ? iso.split("T")[0] : "";
    };

    const getTimeValue = (key: string) => settings[key] || "";

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    const getDayName = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
        return days[date.getDay()];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateValue = e.target.value;
        if (!dateValue) return;
        onUpdate(displayDateKey, formatDisplayDate(dateValue));
        onUpdate(dayKey, getDayName(dateValue));
        const startTime = settings[timeStartKey] || "08:00";
        const endTime = settings[timeEndKey] || "10:00";
        onUpdate(isoStartKey, `${dateValue}T${startTime}:00+07:00`);
        onUpdate(isoEndKey, `${dateValue}T${endTime}:00+07:00`);
    };

    const handleTimeChange = (key: string, isoKey: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeValue = e.target.value;
        onUpdate(key, timeValue);
        const dateValue = getDateValue() || new Date().toISOString().split("T")[0];
        onUpdate(isoKey, `${dateValue}T${timeValue}:00+07:00`);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
            <div className="grid gap-3 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Tanggal</label>
                    <input
                        type="date"
                        defaultValue={getDateValue()}
                        onBlur={handleDateChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Waktu Mulai</label>
                    <input
                        type="time"
                        defaultValue={getTimeValue(timeStartKey)}
                        onBlur={handleTimeChange(timeStartKey, isoStartKey)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-xs text-slate-500">Waktu Selesai</label>
                    <input
                        type="time"
                        defaultValue={getTimeValue(timeEndKey)}
                        onBlur={handleTimeChange(timeEndKey, isoEndKey)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                    />
                </div>
            </div>
        </div>
    );
};

interface ImageUploadProps {
    label: string;
    settingKey: string;
    value: string;
    onUpdate: (key: string, value: string) => void;
}

const ImageUpload = ({ label, settingKey, value, onUpdate }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) onUpdate(settingKey, data.url);
            else alert(data.error || "Upload gagal");
        } catch (error) {
            alert("Upload gagal");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
            <div className="flex gap-3 items-start">
                {value && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=Error";
                            }}
                        />
                        <button
                            onClick={() => onUpdate(settingKey, "")}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                )}
                <div className="flex-1">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500 dark:border-slate-600 dark:text-slate-400 w-full justify-center"
                    >
                        {uploading ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengupload...</> : <><Upload className="h-4 w-4" /> Pilih Gambar</>}
                    </button>
                    {value && <p className="mt-1 text-xs text-slate-400 truncate">{value}</p>}
                </div>
            </div>
        </div>
    );
};

const AudioUpload = ({ label, settingKey, value, onUpdate }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) onUpdate(settingKey, data.url);
            else alert(data.error || "Upload gagal");
        } catch (error) {
            alert("Upload gagal");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
            <div className="flex flex-col gap-3">
                {value && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">Selesai diupload:</p>
                            <p className="text-xs text-slate-900 dark:text-white truncate">{value}</p>
                            <audio src={value} controls className="h-8 mt-2 w-full" />
                        </div>
                        <button
                            onClick={() => onUpdate(settingKey, "")}
                            className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
                <div className="flex-1">
                    <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleUpload} className="hidden" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-4 text-sm text-slate-500 hover:border-blue-500 hover:text-blue-500 dark:border-slate-600 dark:text-slate-400 w-full justify-center bg-white dark:bg-slate-800 transition-colors"
                    >
                        {uploading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Mengupload Musik...</>
                        ) : (
                            <><Music className="h-4 w-4" /> {value ? "Ganti Musik (MP3)" : "Upload Musik (MP3)"}</>
                        )}
                    </button>
                    <p className="mt-2 text-[10px] text-slate-400 italic">Format: MP3/WAV, Max: 10MB. Musik akan terputar otomatis saat undangan dibuka.</p>
                </div>
            </div>
        </div>
    );
};

const SettingsManager: React.FC<SettingsManagerProps> = ({ initialSettings }: SettingsManagerProps) => {
    const [settings, setSettings] = useState(initialSettings);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Persist active side in localStorage
    const [activeSide, setActiveSide] = useState<"pria" | "wanita">(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("admin_active_side");
            return (saved === "wanita" ? "wanita" : "pria") as "pria" | "wanita";
        }
        return "pria";
    });

    useEffect(() => {
        localStorage.setItem("admin_active_side", activeSide);
    }, [activeSide]);

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        bride: true,
        groom: false,
        venue: false,
        acara: false,
        hero: false,
        bank: false,
        story: false,
        gallery: false,
    });

    const isEventKey = (key: string) =>
        key === "events_data" ||
        key.startsWith("akad_") ||
        key.startsWith("resepsi_");

    const getKey = (key: string) => {
        // Shared settings always use "pria" as the master prefix in the database
        // Only events are truly separate for each side
        if (activeSide === "wanita" && !isEventKey(key)) {
            return `pria_${key}`;
        }
        return `${activeSide}_${key}`;
    };

    const getSetting = (key: string): string => settings[getKey(key)] ?? settings[key] ?? "";

    const updateSetting = (key: string, value: string) => {
        const prefixedKey = getKey(key);
        setSettings((prev: Record<string, string>) => {
            const newSettings = { ...prev, [prefixedKey]: value };

            // Auto-sync hero_date if it's the first time setting an event date 
            // OR if hero_date is currently the default 11 Oktober 2025
            if (key === "events_data") {
                try {
                    const events = JSON.parse(value);
                    if (events.length > 0 && events[0].isoStart) {
                        const dateOnly = events[0].isoStart.split("T")[0];
                        const heroKey = activeSide === "wanita" ? "pria_hero_date" : "pria_hero_date";
                        const currentHeroDate = prev[heroKey] || prev["hero_date"];

                        // Only sync if hero date is empty or looks like the default
                        if (!currentHeroDate || currentHeroDate === "2025-10-11") {
                            newSettings[heroKey] = dateOnly;
                        }
                    }
                } catch (e) { }
            }

            return newSettings;
        });
    };
    const toggleSection = (section: string) => {
        setExpandedSections((prev: Record<string, boolean>) => ({ ...prev, [section]: !prev[section] }));
    };

    // Manual save function
    const saveSettings = async () => {
        setSaveStatus("saving");
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            setSaveStatus("error");
        }
    };

    // Bank accounts helpers
    const getBankAccounts = (): BankAccount[] => {
        try {
            return JSON.parse(getSetting("bank_accounts") || "[]");
        } catch {
            return [];
        }
    };

    const updateBankAccounts = (accounts: BankAccount[]) => {
        updateSetting("bank_accounts", JSON.stringify(accounts));
    };

    // Love story helpers
    const getLoveStory = (): LoveStoryItem[] => {
        try {
            return JSON.parse(getSetting("love_story") || "[]");
        } catch {
            return [];
        }
    };

    const updateLoveStory = (items: LoveStoryItem[]) => {
        updateSetting("love_story", JSON.stringify(items));
    };

    // Gallery helpers
    const getGalleryImages = (): string[] => {
        try {
            return JSON.parse(getSetting("gallery_images") || "[]");
        } catch {
            return [];
        }
    };

    const updateGalleryImages = (images: string[]) => {
        updateSetting("gallery_images", JSON.stringify(images));
    };

    // Events helpers
    const getEvents = (): EventItem[] => {
        try {
            const eventsJson = getSetting("events_data");
            if (eventsJson) {
                return JSON.parse(eventsJson);
            }
            // Fallback: convert legacy akad/resepsi to array
            const legacyEvents: EventItem[] = [];
            if (settings.akad_title || settings.akad_date) {
                legacyEvents.push({
                    id: "akad",
                    title: settings.akad_title || "Akad Nikah",
                    day: settings.akad_day || "",
                    date: settings.akad_date || "",
                    startTime: settings.akad_start || "08:00",
                    endTime: settings.akad_end || "10:00",
                    isoStart: settings.akad_iso_start || "",
                    isoEnd: settings.akad_iso_end || "",
                    venueName: settings.akad_venue_name || "",
                    venueAddress: settings.akad_venue_address || "",
                    venueMaps: settings.akad_venue_maps || "",
                    side: "both",
                });
            }
            if (settings.resepsi_title || settings.resepsi_date) {
                legacyEvents.push({
                    id: "resepsi",
                    title: settings.resepsi_title || "Resepsi Pernikahan",
                    day: settings.resepsi_day || "",
                    date: settings.resepsi_date || "",
                    startTime: settings.resepsi_start || "11:00",
                    endTime: settings.resepsi_end || "14:00",
                    isoStart: settings.resepsi_iso_start || "",
                    isoEnd: settings.resepsi_iso_end || "",
                    venueName: settings.resepsi_venue_name || "",
                    venueAddress: settings.resepsi_venue_address || "",
                    venueMaps: settings.resepsi_venue_maps || "",
                    side: "both",
                });
            }
            return legacyEvents.length > 0 ? legacyEvents : [];
        } catch {
            return [];
        }
    };

    const updateEvents = (events: EventItem[]) => {
        updateSetting("events_data", JSON.stringify(events));
    };

    const addEvent = () => {
        const events = getEvents();
        const newEvent: EventItem = {
            id: `event_${Date.now()}`,
            title: "Acara Baru",
            day: "",
            date: "",
            startTime: "08:00",
            endTime: "10:00",
            isoStart: "",
            isoEnd: "",
            venueName: "",
            venueAddress: "",
            venueMaps: "",
            side: "both",
        };
        updateEvents([...events, newEvent]);
    };

    const deleteEvent = (eventId: string) => {
        const events = getEvents();
        updateEvents(events.filter(e => e.id !== eventId));
    };

    const updateEvent = (eventId: string, field: keyof EventItem, value: string) => {
        const events = getEvents();
        updateEvents(events.map(e => e.id === eventId ? { ...e, [field]: value } : e));
    };

    return (
        <div className="space-y-4">
            {/* Autosave Status Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg bg-white p-4 shadow dark:bg-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengaturan Undangan</h2>
                <div className="flex items-center gap-4">
                    {saveStatus === "saving" && (
                        <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Menyimpan...
                        </span>
                    )}
                    {saveStatus === "saved" && (
                        <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <Save className="h-4 w-4" />
                            Tersimpan
                        </span>
                    )}
                    {saveStatus === "error" && (
                        <span className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <Trash2 className="h-4 w-4" />
                            Gagal menyimpan
                        </span>
                    )}
                    <button
                        onClick={saveSettings}
                        disabled={saveStatus === "saving"}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        Simpan
                    </button>
                </div>
            </div>

            {/* Side Tabs */}
            <div className="flex gap-2 rounded-lg bg-white p-2 shadow dark:bg-slate-800">
                <button
                    onClick={() => setActiveSide("pria")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeSide === "pria"
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        }`}
                >
                    <User className="h-4 w-4" />
                    Tamu Pria
                </button>
                <button
                    onClick={() => setActiveSide("wanita")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${activeSide === "wanita"
                        ? "bg-pink-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Tamu Wanita
                </button>
            </div>

            {/* Mempelai Wanita */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Mempelai Wanita" section="bride" icon={User} expanded={expandedSections.bride} onToggle={() => toggleSection("bride")} />
                {expandedSections.bride && (
                    <div className="grid gap-4 bg-white p-4 dark:bg-slate-800 md:grid-cols-2">
                        <InputField label="Nama Panggilan" settingKey="bride_nickname" placeholder="Fey" activeSide={activeSide} value={getSetting("bride_nickname")} onUpdate={updateSetting} />
                        <InputField label="Nama Lengkap" settingKey="bride_fullname" placeholder="Fera Oktapia" activeSide={activeSide} value={getSetting("bride_fullname")} onUpdate={updateSetting} />
                        <InputField label="Info Orang Tua" settingKey="bride_parents" placeholder="Putri dari Bpk. ... & Ibu ..." activeSide={activeSide} value={getSetting("bride_parents")} onUpdate={updateSetting} />
                        <div className="md:col-span-2">
                            <ImageUpload label="Foto Mempelai Wanita" settingKey="bride_image" value={getSetting("bride_image")} onUpdate={updateSetting} />
                        </div>
                    </div>
                )}
            </div>

            {/* Mempelai Pria */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Mempelai Pria" section="groom" icon={Users} expanded={expandedSections.groom} onToggle={() => toggleSection("groom")} />
                {expandedSections.groom && (
                    <div className="grid gap-4 bg-white p-4 dark:bg-slate-800 md:grid-cols-2">
                        <InputField label="Nama Panggilan" settingKey="groom_nickname" placeholder="Yaya" activeSide={activeSide} value={getSetting("groom_nickname")} onUpdate={updateSetting} />
                        <InputField label="Nama Lengkap" settingKey="groom_fullname" placeholder="Yahya Zulfikri" activeSide={activeSide} value={getSetting("groom_fullname")} onUpdate={updateSetting} />
                        <InputField label="Info Orang Tua" settingKey="groom_parents" placeholder="Putra dari Bpk. ... & Ibu ..." activeSide={activeSide} value={getSetting("groom_parents")} onUpdate={updateSetting} />
                        <div className="md:col-span-2">
                            <ImageUpload label="Foto Mempelai Pria" settingKey="groom_image" value={getSetting("groom_image")} onUpdate={updateSetting} />
                        </div>
                    </div>
                )}
            </div>

            {/* Acara (Dynamic Events) */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Acara Pernikahan" section="acara" icon={PartyPopper} expanded={expandedSections.acara} onToggle={() => toggleSection("acara")} />
                {expandedSections.acara && (
                    <div className="space-y-4 bg-white p-4 dark:bg-slate-800">
                        {/* Add Event Button */}
                        <button
                            type="button"
                            onClick={addEvent}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Acara
                        </button>

                        {/* Events List */}
                        {getEvents().map((event, index) => (
                            <div key={event.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-700">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PartyPopper className="h-5 w-5 text-slate-500" />
                                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                                            Acara {index + 1}
                                        </h4>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm("Hapus acara ini?")) {
                                                deleteEvent(event.id);
                                            }
                                        }}
                                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Hapus
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Judul Acara</label>
                                            <input
                                                type="text"
                                                defaultValue={event.title}
                                                onBlur={(e) => updateEvent(event.id, "title", e.target.value)}
                                                placeholder="Akad Nikah"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Tampilkan Untuk</label>
                                            <select
                                                value={event.side || "both"}
                                                onChange={(e) => updateEvent(event.id, "side", e.target.value)}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            >
                                                <option value="both">Semua Tamu</option>
                                                <option value="pria">Tamu Pria Saja</option>
                                                <option value="wanita">Tamu Wanita Saja</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Tanggal</label>
                                            <input
                                                type="date"
                                                defaultValue={event.isoStart ? event.isoStart.split("T")[0] : ""}
                                                onBlur={(e) => {
                                                    const dateValue = e.target.value;
                                                    if (!dateValue) return;
                                                    const dateObj = new Date(dateValue);
                                                    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                                                    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
                                                    const displayDate = dateObj.toLocaleDateString("id-ID", options);
                                                    updateEvent(event.id, "day", days[dateObj.getDay()]);
                                                    updateEvent(event.id, "date", displayDate);
                                                    updateEvent(event.id, "isoStart", `${dateValue}T${event.startTime || "08:00"}:00+07:00`);
                                                    updateEvent(event.id, "isoEnd", `${dateValue}T${event.endTime || "10:00"}:00+07:00`);
                                                }}
                                                min="2020-01-01"
                                                max="2099-12-31"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Waktu Mulai</label>
                                            <input
                                                type="time"
                                                defaultValue={event.startTime}
                                                onBlur={(e) => {
                                                    updateEvent(event.id, "startTime", e.target.value);
                                                    if (event.isoStart) {
                                                        const dateValue = event.isoStart.split("T")[0];
                                                        updateEvent(event.id, "isoStart", `${dateValue}T${e.target.value}:00+07:00`);
                                                    }
                                                }}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Waktu Selesai</label>
                                            <input
                                                type="time"
                                                defaultValue={event.endTime}
                                                onBlur={(e) => {
                                                    updateEvent(event.id, "endTime", e.target.value);
                                                    if (event.isoEnd) {
                                                        const dateValue = event.isoEnd.split("T")[0];
                                                        updateEvent(event.id, "isoEnd", `${dateValue}T${e.target.value}:00+07:00`);
                                                    }
                                                }}
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    {event.date && (
                                        <p className="text-xs text-slate-400">
                                            {event.day}, {event.date} | {event.startTime} - {event.endTime}
                                        </p>
                                    )}
                                    <div className="border-t border-slate-100 pt-3 dark:border-slate-700">
                                        <p className="mb-2 text-xs font-medium text-slate-500">📍 Lokasi</p>
                                        <div className="grid gap-2 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Nama Venue</label>
                                                <input
                                                    type="text"
                                                    defaultValue={event.venueName}
                                                    onBlur={(e) => updateEvent(event.id, "venueName", e.target.value)}
                                                    placeholder="Masjid / Gedung ..."
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">Alamat</label>
                                                <input
                                                    type="text"
                                                    defaultValue={event.venueAddress}
                                                    onBlur={(e) => updateEvent(event.id, "venueAddress", e.target.value)}
                                                    placeholder="Jl. ..."
                                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-400">URL Embed Maps</label>
                                            <input
                                                type="text"
                                                defaultValue={event.venueMaps}
                                                onBlur={(e) => updateEvent(event.id, "venueMaps", e.target.value)}
                                                placeholder="https://maps.google.com/maps?q=..."
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                                            />
                                            <p className="mt-1 text-[10px] text-slate-400">Paste URL embed dari Google Maps</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {getEvents().length === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                                <PartyPopper className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600" />
                                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Belum ada acara. Klik tombol di atas untuk menambahkan.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hero & Misc */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Hero & Lainnya" section="hero" icon={Image} expanded={expandedSections.hero} onToggle={() => toggleSection("hero")} />
                {expandedSections.hero && (
                    <div className="grid gap-4 bg-white p-4 dark:bg-slate-800 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <ImageUpload label="Gambar Hero" settingKey="hero_image" value={getSetting("hero_image")} onUpdate={updateSetting} />
                        </div>
                        <InputField label="Kota / Lokasi" settingKey="hero_city" placeholder="Kab. Pandeglang, Banten" activeSide={activeSide} value={getSetting("hero_city")} onUpdate={updateSetting} />
                        <InputField label="Tanggal Tampilan Hero" settingKey="hero_date" type="date" activeSide={activeSide} value={getSetting("hero_date")} onUpdate={updateSetting} />
                        <InputField label="Max Guests per RSVP" settingKey="max_guests" type="number" placeholder="20" activeSide={activeSide} value={getSetting("max_guests")} onUpdate={updateSetting} />
                        <div className="md:col-span-2">
                            <AudioUpload label="Background Music (MP3)" settingKey="music_url" value={getSetting("music_url")} onUpdate={updateSetting} />
                        </div>
                        <div className="md:col-span-2">
                            <InputField label="Alamat Kirim Kado Fisik" settingKey="gift_address" placeholder="Jl. ..." activeSide={activeSide} value={getSetting("gift_address")} onUpdate={updateSetting} />
                        </div>
                        <div className="md:col-span-2">
                            <InputField label="Tanda Tangan Keluarga (Footer)" settingKey="closing_family" placeholder="Kel. Bpk ... & Kel. Bpk ..." activeSide={activeSide} value={getSetting("closing_family")} onUpdate={updateSetting} />
                        </div>
                    </div>
                )}
            </div>

            {/* Bank Accounts */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Rekening Bank" section="bank" icon={CreditCard} expanded={expandedSections.bank} onToggle={() => toggleSection("bank")} />
                {expandedSections.bank && (
                    <div className="space-y-4 bg-white p-4 dark:bg-slate-800">
                        {getBankAccounts().map((account, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <div className="flex-1 grid gap-2 md:grid-cols-3">
                                    <input
                                        type="text"
                                        value={account.bank}
                                        onChange={(e) => {
                                            const accounts = getBankAccounts();
                                            accounts[idx].bank = e.target.value;
                                            updateBankAccounts(accounts);
                                        }}
                                        placeholder="Nama Bank"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={account.number}
                                        onChange={(e) => {
                                            const accounts = getBankAccounts();
                                            accounts[idx].number = e.target.value;
                                            updateBankAccounts(accounts);
                                        }}
                                        placeholder="No. Rekening"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={account.name}
                                        onChange={(e) => {
                                            const accounts = getBankAccounts();
                                            accounts[idx].name = e.target.value;
                                            updateBankAccounts(accounts);
                                        }}
                                        placeholder="Atas Nama"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const accounts = getBankAccounts().filter((_, i) => i !== idx);
                                        updateBankAccounts(accounts);
                                    }}
                                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const accounts = getBankAccounts();
                                accounts.push({ bank: "", number: "", name: "" });
                                updateBankAccounts(accounts);
                            }}
                            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        >
                            <Plus className="h-4 w-4" /> Tambah Rekening
                        </button>
                    </div>
                )}
            </div>

            {/* Love Story */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Love Story Timeline" section="story" icon={BookHeart} expanded={expandedSections.story} onToggle={() => toggleSection("story")} />
                {expandedSections.story && (
                    <div className="space-y-4 bg-white p-4 dark:bg-slate-800">
                        {getLoveStory().map((item, idx) => (
                            <div key={idx} className="flex gap-2 items-start">
                                <div className="flex-1 grid gap-2 md:grid-cols-3">
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={(e) => {
                                            const items = getLoveStory();
                                            items[idx].date = e.target.value;
                                            updateLoveStory(items);
                                        }}
                                        placeholder="Tahun/Tanggal"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={(e) => {
                                            const items = getLoveStory();
                                            items[idx].title = e.target.value;
                                            updateLoveStory(items);
                                        }}
                                        placeholder="Judul"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                    <input
                                        type="text"
                                        value={item.desc}
                                        onChange={(e) => {
                                            const items = getLoveStory();
                                            items[idx].desc = e.target.value;
                                            updateLoveStory(items);
                                        }}
                                        placeholder="Deskripsi"
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        const items = getLoveStory().filter((_, i) => i !== idx);
                                        updateLoveStory(items);
                                    }}
                                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const items = getLoveStory();
                                items.push({ date: "", title: "", desc: "" });
                                updateLoveStory(items);
                            }}
                            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300"
                        >
                            <Plus className="h-4 w-4" /> Tambah Timeline
                        </button>
                    </div>
                )}
            </div>

            {/* Gallery Images */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <SectionHeader title="Galeri Foto" section="gallery" icon={Images} expanded={expandedSections.gallery} onToggle={() => toggleSection("gallery")} />
                {expandedSections.gallery && (
                    <div className="space-y-4 bg-white p-4 dark:bg-slate-800">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {getGalleryImages().slice(0, 2).map((url, idx) => (
                                <GalleryItem
                                    key={idx}
                                    url={url}
                                    onRemove={() => {
                                        const images = getGalleryImages().filter((_, i) => i !== idx);
                                        updateGalleryImages(images);
                                    }}
                                    onUpdate={(newUrl) => {
                                        const images = getGalleryImages();
                                        images[idx] = newUrl;
                                        updateGalleryImages(images);
                                    }}
                                />
                            ))}
                            {/* Add new image button - only show if less than 2 images */}
                            {getGalleryImages().length < 2 && (
                                <GalleryAddButton
                                    onUpload={(url) => {
                                        const images = getGalleryImages();
                                        if (images.length < 2) {
                                            images.push(url);
                                            updateGalleryImages(images);
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Gallery Item Component
const GalleryItem = ({ url, onRemove, onUpdate }: { url: string; onRemove: () => void; onUpdate: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                onUpdate(data.url);
            }
        } catch (error) {
            alert("Upload gagal");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 group">
            {url ? (
                <img src={url} alt="Gallery" className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Images className="h-8 w-8" />
                </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleReplace} className="hidden" />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="p-2 rounded-full bg-white/90 text-slate-700 hover:bg-white"
                    title="Ganti"
                >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </button>
                <button
                    onClick={onRemove}
                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
                    title="Hapus"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

// Gallery Add Button Component
const GalleryAddButton = ({ onUpload }: { onUpload: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                onUpload(data.url);
            }
        } catch (error) {
            alert("Upload gagal");
        } finally {
            setUploading(false);
        }
    };

    return (
        <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-500 transition-colors dark:border-slate-600"
        >
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Plus className="h-6 w-6" />}
            <span className="text-xs">Tambah Foto</span>
        </button>
    );
};

export default SettingsManager;
