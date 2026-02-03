import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  CalendarPlus,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Heart,
} from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";
import { generateGoogleCalendarUrl, downloadICS } from "../utils/calendarUtils";

const EventDetails: React.FC = () => {
  const { config, text } = useSettings();
  const [copiedEvent, setCopiedEvent] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [side, setSide] = useState<"pria" | "wanita" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "pria" || sideParam === "wanita") {
      setSide(sideParam);
    }
  }, []);

  // Filter events based on side
  const filteredEvents = useMemo(() => {
    if (!side) {
      // No side param: show all events
      return config.events;
    }
    // Filter: show events that match the side OR are for "both"
    return config.events.filter(ev => ev.side === side || ev.side === "both");
  }, [config.events, side]);

  // Determine couple name order based on side
  const firstName = side === "wanita" ? config.couple.bride.name : config.couple.groom.name;
  const secondName = side === "wanita" ? config.couple.groom.name : config.couple.bride.name;

  const copyToClipboard = (address: string, eventId: string) => {
    navigator.clipboard.writeText(address);
    setCopiedEvent(eventId);
    setTimeout(() => setCopiedEvent(null), 2000);
  };

  const handleCalendar = (
    type: "google" | "ics",
    ev: (typeof config.events)[number]
  ) => {
    const event = {
      title: `${ev.title} ${firstName} & ${secondName}`,
      description: `Menghadiri ${ev.title} pernikahan ${firstName} & ${secondName}.`,
      location: ev.venue.address,
      startTime: ev.startDateTime,
      endTime: ev.endDateTime,
    };
    if (type === "google") {
      window.open(generateGoogleCalendarUrl(event), "_blank");
    } else {
      downloadICS(event);
    }
    setActiveDropdown(null);
  };

  return (
    <section
      id="event"
      className="bg-secondary/30 dark:bg-darkBg px-4 py-20 transition-colors duration-1000 md:px-6 md:py-40"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center md:mb-24 md:space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12"></div>
            <Sparkles className="text-accentDark dark:text-accent h-5 w-5 animate-pulse md:h-6 md:w-6" />
            <div className="bg-accentDark/20 dark:bg-accent/20 h-[1px] w-8 md:w-12"></div>
          </div>

          <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-9xl dark:text-white">
            Waktu & Tempat
          </h2>
          <p className="mx-auto max-w-2xl px-4 text-base font-light text-balance text-slate-500 italic md:text-xl dark:text-slate-400">
            {text.invitation}
          </p>
        </div>

        <div className={`grid gap-8 md:gap-10 ${filteredEvents.length === 1 ? 'max-w-lg mx-auto' : 'md:grid-cols-2'}`}>
          {filteredEvents.map((ev, index) => {
            const mapUrl = ev.venue.mapsEmbedUrl;

            return (
              <div
                key={ev.id}
                className="editorial-card dark:bg-darkSurface group relative flex flex-col overflow-visible rounded-[2.5rem] bg-white md:rounded-[4rem]"
              >
                {/* Floating Icon */}
                <div className="bg-accentDark/10 dark:bg-accent/10 text-accentDark dark:text-accent animate-float absolute -top-3 -right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 backdrop-blur-md md:-top-6 md:-right-6 md:h-16 md:w-16 dark:border-white/5">
                  {index === 0 ? (
                    <Heart className="h-4 w-4 fill-current md:h-7 md:w-7" />
                  ) : (
                    <Sparkles className="h-4 w-4 md:h-7 md:w-7" />
                  )}
                </div>

                {/* Event Info Section */}
                <div className="space-y-6 p-6 text-center md:space-y-12 md:p-12">
                  <div className="space-y-1.5 md:space-y-4">
                    <span className="tracking-luxury text-accentDark dark:text-accent text-[8px] font-bold uppercase md:text-[10px]">
                      Our Sacred Day
                    </span>
                    <h3 className="font-serif text-2xl leading-tight text-slate-900 italic md:text-5xl dark:text-white">
                      {ev.title}
                    </h3>
                  </div>

                  <div className="w-full space-y-4 border-y border-slate-100 py-6 md:space-y-8 md:py-10 dark:border-white/5">
                    <div className="flex flex-col items-center justify-center gap-2 font-serif text-lg text-slate-700 italic md:text-2xl dark:text-slate-100">
                      <div className="flex items-center gap-2 md:gap-4">
                        <Calendar className="text-accentDark dark:text-accent h-4 w-4 md:h-6 md:w-6" />
                        <span>
                          {ev.day}, {ev.date}
                        </span>
                      </div>
                    </div>
                    <div className="tracking-editorial flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase md:gap-4 md:text-[12px] dark:text-slate-500">
                      <Clock className="text-accentDark dark:text-accent h-3.5 w-3.5 md:h-5 md:w-5" />
                      <span>
                        {ev.startTime} — {ev.endTime} WIB
                      </span>
                    </div>
                  </div>

                  {/* Save the Date Button */}
                  <div className="relative w-full">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === ev.id ? null : ev.id)
                      }
                      className="bg-primary dark:bg-accentDark tracking-editorial flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-[10px] font-bold text-white uppercase transition-all hover:shadow-2xl active:scale-95 md:gap-5 md:rounded-3xl md:py-5 md:text-[11px]"
                    >
                      <CalendarPlus className="h-4 w-4 md:h-5 md:w-5" />
                      Save The Date
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-500 md:h-4 md:w-4 ${activeDropdown === ev.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {activeDropdown === ev.id && (
                      <div className="frosted-glass animate-reveal absolute top-full right-0 left-0 z-[50] mt-3 overflow-hidden rounded-[1.5rem] border border-slate-200 p-2 shadow-2xl md:mt-4 md:rounded-[2rem] md:p-3 dark:border-white/10">
                        <button
                          onClick={() => handleCalendar("google", ev)}
                          className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left text-slate-800 transition-colors hover:bg-slate-50 md:gap-5 md:rounded-2xl md:px-8 md:py-5 dark:text-white dark:hover:bg-white/5"
                        >
                          <div className="bg-accentDark dark:bg-accent h-2 w-2 animate-pulse rounded-full md:h-3 md:w-3"></div>
                          <span className="tracking-luxury text-[10px] font-bold uppercase md:text-[11px]">
                            Google Calendar
                          </span>
                        </button>
                        <button
                          onClick={() => handleCalendar("ics", ev)}
                          className="flex w-full items-center gap-4 rounded-xl px-6 py-4 text-left text-slate-800 transition-colors hover:bg-slate-50 md:gap-5 md:rounded-2xl md:px-8 md:py-5 dark:text-white dark:hover:bg-white/5"
                        >
                          <div className="h-2 w-2 rounded-full bg-slate-300 md:h-3 md:w-3 dark:bg-slate-600"></div>
                          <span className="tracking-luxury text-[10px] font-bold uppercase md:text-[11px]">
                            Apple / Outlook
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Venue Section */}
                <div className="space-y-5 border-t border-slate-100 p-6 md:space-y-8 md:p-12 dark:border-white/5">
                  <div className="flex items-start gap-3 md:items-center md:gap-6">
                    <div className="text-accentDark dark:text-accent flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-lg md:h-14 md:w-14 dark:border-white/10 dark:bg-white/5">
                      <MapPin className="h-5 w-5 md:h-7 md:w-7" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <h4 className="font-serif text-lg leading-tight tracking-tight text-slate-900 italic md:text-2xl dark:text-white">
                        {ev.venue.name}
                      </h4>
                      <p className="text-xs leading-snug font-light text-slate-500 italic md:text-base dark:text-slate-400">
                        {ev.venue.address}
                      </p>
                    </div>
                  </div>

                  {/* Venue Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => copyToClipboard(ev.venue.address, ev.id)}
                      className="tracking-editorial flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-[9px] font-bold text-slate-700 uppercase transition-all hover:bg-slate-50 md:rounded-2xl md:py-4 md:text-[10px] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      {copiedEvent === ev.id ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="text-accentDark dark:text-accent h-4 w-4" />
                      )}
                      {copiedEvent === ev.id ? "Copied" : "Copy"}
                    </button>
                    <a
                      href={ev.venue.mapsEmbedUrl.replace('&output=embed', '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary dark:text-primary tracking-editorial flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[9px] font-bold text-white uppercase transition-all hover:shadow-2xl md:rounded-2xl md:py-4 md:text-[10px] dark:bg-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Maps
                    </a>
                  </div>

                  {/* Map Embed */}
                  <div className="relative h-[200px] overflow-hidden rounded-2xl border border-slate-100 shadow-lg md:h-[250px] md:rounded-3xl dark:border-white/10">
                    <iframe
                      src={mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      className="contrast-125 grayscale-[0.3] transition-all hover:grayscale-0 dark:opacity-80"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="dark:border-darkSurface/5 pointer-events-none absolute inset-0 border-[4px] border-white/5 md:border-[6px]"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
