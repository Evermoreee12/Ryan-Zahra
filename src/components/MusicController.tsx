import * as React from "react";
import { useState, useEffect } from "react";
import { Music, Pause, Play } from "lucide-react";

const MusicController: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a small delay to feel premium
        const timer = setTimeout(() => setIsVisible(true), 1500);

        const handleOpen = () => setIsPlaying(true);
        window.addEventListener("play-wedding-music", handleOpen);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("play-wedding-music", handleOpen);
        };
    }, []);

    const toggleMusic = () => {
        window.dispatchEvent(new CustomEvent("toggle-wedding-music"));
        setIsPlaying(!isPlaying);
    };

    return (
        <div
            className={`transition-all duration-1000 transform ${isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
        >
            <button
                onClick={toggleMusic}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 transition-all duration-500 hover:scale-110 hover:bg-white md:h-12 md:w-12 dark:bg-slate-900/80 dark:hover:bg-slate-900 frosted-glass shadow-xl border border-white/20`}
            >
                {/* Vinyl Disk Visual */}
                <div className={`absolute inset-1 rounded-full border-2 border-slate-200 dark:border-slate-700 ${isPlaying ? "animate-spin-slow" : ""}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent md:h-2 md:w-2"></div>
                </div>

                <div className="relative z-10 text-slate-700 dark:text-white">
                    {isPlaying ? (
                        <div className="relative">
                            <Music className="h-4 w-4 animate-pulse-soft md:h-5 md:w-5" />
                            <div className="absolute -top-1 -right-2 text-[6px] font-bold md:text-[8px]">ON</div>
                        </div>
                    ) : (
                        <Play className="h-4 w-4 ml-0.5 md:h-5 md:w-5" />
                    )}
                </div>

                {/* Progress Halo (Optional Visual) */}
                <div className={`absolute -inset-1 rounded-full border border-accent/20 ${isPlaying ? "scale-110 opacity-100" : "scale-100 opacity-0"} transition-all duration-1000`}></div>
            </button>

            <style>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-pulse-soft {
            animation: pulse-soft 2s ease-in-out infinite;
        }
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default MusicController;
