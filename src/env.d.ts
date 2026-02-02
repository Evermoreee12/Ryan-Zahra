/// <reference types="astro/client" />

interface ImportMetaEnv {
    // Bride
    readonly PUBLIC_BRIDE_NICKNAME: string;
    readonly PUBLIC_BRIDE_FULLNAME: string;
    readonly PUBLIC_BRIDE_PARENTS: string;
    readonly PUBLIC_BRIDE_INSTAGRAM: string;
    readonly PUBLIC_BRIDE_IMAGE: string;

    // Groom
    readonly PUBLIC_GROOM_NICKNAME: string;
    readonly PUBLIC_GROOM_FULLNAME: string;
    readonly PUBLIC_GROOM_PARENTS: string;
    readonly PUBLIC_GROOM_INSTAGRAM: string;
    readonly PUBLIC_GROOM_IMAGE: string;

    // Akad
    readonly PUBLIC_AKAD_TITLE: string;
    readonly PUBLIC_AKAD_DAY: string;
    readonly PUBLIC_AKAD_DATE: string;
    readonly PUBLIC_AKAD_START: string;
    readonly PUBLIC_AKAD_END: string;
    readonly PUBLIC_AKAD_ISO_START: string;
    readonly PUBLIC_AKAD_ISO_END: string;
    readonly PUBLIC_AKAD_VENUE_NAME: string;
    readonly PUBLIC_AKAD_VENUE_ADDRESS: string;
    readonly PUBLIC_AKAD_VENUE_LAT: string;
    readonly PUBLIC_AKAD_VENUE_LNG: string;

    // Resepsi
    readonly PUBLIC_RESEPSI_TITLE: string;
    readonly PUBLIC_RESEPSI_DAY: string;
    readonly PUBLIC_RESEPSI_DATE: string;
    readonly PUBLIC_RESEPSI_START: string;
    readonly PUBLIC_RESEPSI_END: string;
    readonly PUBLIC_RESEPSI_ISO_START: string;
    readonly PUBLIC_RESEPSI_ISO_END: string;
    readonly PUBLIC_RESEPSI_VENUE_NAME: string;
    readonly PUBLIC_RESEPSI_VENUE_ADDRESS: string;
    readonly PUBLIC_RESEPSI_VENUE_LAT: string;
    readonly PUBLIC_RESEPSI_VENUE_LNG: string;

    // Hero
    readonly PUBLIC_HERO_IMAGE: string;
    readonly PUBLIC_HERO_CITY: string;

    // Other
    readonly PUBLIC_MUSIC_URL: string;
    readonly PUBLIC_RSVP_MAX_GUESTS: string;
    readonly PUBLIC_LOVE_STORY: string;
    readonly PUBLIC_BANK_ACCOUNTS: string;
    readonly PUBLIC_GALLERY_IMAGES: string;

    // Database
    readonly DATABASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
