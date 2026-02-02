import * as React from "react";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

const CoupleProfile: React.FC = () => {
  const { config, text } = useSettings();
  const { bride, groom } = config.couple;

  // Detect side parameter from URL
  const [side, setSide] = useState<"pria" | "wanita">("pria");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sideParam = params.get("side");
    if (sideParam === "wanita") {
      setSide("wanita");
    }
  }, []);

  // Determine display order based on side
  const firstPerson = side === "wanita" ? bride : groom;
  const secondPerson = side === "wanita" ? groom : bride;

  return (
    <section
      id="couple"
      className="dark:bg-darkBg relative bg-white py-24 transition-colors duration-1000 md:py-40"
    >
      <div className="relative z-10 container mx-auto max-w-6xl px-6">
        <div className="mb-24 space-y-6 text-center md:mb-32">
          <Heart className="text-accentDark/30 dark:text-accent/20 mx-auto mb-6 h-6 w-6 animate-pulse" />
          <span className="text-accentDark dark:text-accent font-serif text-lg italic">
            {text.opening.salam}
          </span>

          <h2 className="font-serif text-4xl tracking-tight text-slate-900 italic md:text-7xl dark:text-white">
            Bismillahirrahmanirrahim
          </h2>
          <div className="bg-accent/30 mx-auto h-[1px] w-20"></div>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed font-light text-balance text-slate-600 italic md:text-xl dark:text-slate-300">
            {text.quote.ar_rum}
          </p>

          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            {text.quote.source}
          </p>
        </div>
        <div className="grid items-start gap-20 md:grid-cols-2 md:gap-24">
          <div className="group flex flex-col items-center space-y-10 text-center md:items-end md:text-right">
            <div className="relative">
              <div className="border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
              <img
                src={firstPerson.image}
                className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]"
                alt={firstPerson.name}
              />
            </div>
            <div className="space-y-6">
              <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white">
                {firstPerson.fullName}
              </h3>
              <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400">
                {firstPerson.parents}
              </p>
            </div>
          </div>
          <div className="group flex flex-col items-center space-y-10 text-center md:items-start md:text-left">
            <div className="relative">
              <div className="border-accent/20 dark:border-accent/10 absolute -inset-4 scale-105 rounded-full border transition-transform duration-1000 group-hover:scale-100 md:-inset-6"></div>
              <img
                src={secondPerson.image}
                className="dark:border-darkSurface relative h-56 w-56 rounded-full border-4 border-slate-50 object-cover shadow-2xl transition-all duration-1000 group-hover:brightness-110 md:h-[24rem] md:w-[24rem]"
                alt={secondPerson.name}
              />
            </div>
            <div className="space-y-6">
              <h3 className="font-serif text-3xl font-medium tracking-tight text-slate-900 md:text-6xl dark:text-white">
                {secondPerson.fullName}
              </h3>
              <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase whitespace-nowrap md:text-[12px] dark:text-slate-400">
                {secondPerson.parents}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CoupleProfile;
