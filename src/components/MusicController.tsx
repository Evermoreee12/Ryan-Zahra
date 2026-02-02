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
            className={`fixed bottom-6 left-6 z-[1000] transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
        >
            <button
                onClick={toggleMusic}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-full bg-white/80 transition-all duration-500 hover:scale-110 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 frosted-glass shadow-xl border border-white/20`}
            >
                {/* Vinyl Disk Visual */}
                <div className={`absolute inset-1 rounded-full border-2 border-slate-200 dark:border-slate-700 ${isPlaying ? "animate-spin-slow" : ""}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent"></div>
                </div>

                <div className="relative z-10 text-slate-700 dark:text-white">
                    {isPlaying ? (
                        <div className="relative">
                            <Music className="h-5 w-5 animate-pulse-soft" />
                            <div className="absolute -top-1 -right-2 text-[8px] font-bold">ON</div>
                        </div>
                    ) : (
                        <Play className="h-5 w-5 ml-0.5" />
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
