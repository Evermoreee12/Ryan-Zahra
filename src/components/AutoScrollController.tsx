import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MousePointer2, StopCircle } from "lucide-react";

interface AutoScrollControllerProps {
    isOpened: boolean;
}

const AutoScrollController: React.FC<AutoScrollControllerProps> = ({ isOpened }) => {
    const [isActive, setIsActive] = useState(false);
    const scrollRef = useRef<number | null>(null);

    const startAutoScroll = () => {
        const scroll = () => {
            window.scrollBy({ top: 1, behavior: "auto" });
            scrollRef.current = requestAnimationFrame(scroll);
        };
        scrollRef.current = requestAnimationFrame(scroll);
    };

    const stopAutoScroll = () => {
        if (scrollRef.current) {
            cancelAnimationFrame(scrollRef.current);
            scrollRef.current = null;
        }
    };

    useEffect(() => {
        if (isActive) {
            startAutoScroll();
        } else {
            stopAutoScroll();
        }
        return () => stopAutoScroll();
    }, [isActive]);

    const toggleScroll = () => {
        setIsActive(!isActive);
    };

    if (!isOpened) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <button
                onClick={toggleScroll}
                className={`group flex items-center gap-3 rounded-full px-5 py-3 text-[11px] font-bold tracking-[0.15em] uppercase shadow-2xl transition-all duration-500 hover:scale-105 frosted-glass border border-white/20 ${isActive
                        ? "bg-accent text-white"
                        : "bg-white/80 text-slate-700 hover:bg-white dark:bg-slate-900/80 dark:text-white"
                    }`}
            >
                {isActive ? (
                    <>
                        <StopCircle className="h-4 w-4 animate-pulse" />
                        <span>Stop Auto Scroll</span>
                    </>
                ) : (
                    <>
                        <MousePointer2 className="h-4 w-4 group-hover:animate-bounce" />
                        <span>Auto Scroll</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default AutoScrollController;
