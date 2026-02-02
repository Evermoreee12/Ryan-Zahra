import * as React from "react";
import { useState, useEffect } from "react";
import { X, Smile } from "lucide-react";

// Pre-defined sticker images (stored in public/stickers/)
const STICKERS = [
    { id: "love-envelope", src: "/stickers/love-envelope.png", alt: "Love Envelope" },
    { id: "heart-sparkle", src: "/stickers/heart-sparkle.png", alt: "Heart Sparkle" },
    { id: "celebration", src: "/stickers/celebration.png", alt: "Celebration" },
    { id: "flowers", src: "/stickers/flowers.png", alt: "Flowers" },
    { id: "wedding-rings", src: "/stickers/wedding-rings.png", alt: "Wedding Rings" },
    { id: "confetti", src: "/stickers/confetti.png", alt: "Confetti" },
    { id: "love-birds", src: "/stickers/love-birds.png", alt: "Love Birds" },
    { id: "champagne", src: "/stickers/champagne.png", alt: "Champagne" },
];

interface StickerPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (sticker: { id: string; src: string } | null) => void;
    selectedSticker: string | null;
}

const StickerPicker: React.FC<StickerPickerProps> = ({
    isOpen,
    onClose,
    onSelect,
    selectedSticker,
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Small delay for animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            // Wait for animation to complete before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSelect = (sticker: (typeof STICKERS)[0]) => {
        onSelect({ id: sticker.id, src: sticker.src });
        onClose();
    };

    const handleClear = () => {
        onSelect(null);
        onClose();
    };

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? "opacity-100" : "opacity-0"
                }`}
            onClick={onClose}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Modal */}
            <div
                className={`relative max-h-[80vh] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 dark:bg-slate-800 ${isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <Smile className="text-accent h-5 w-5" />
                        <h3 className="font-serif text-lg text-slate-900 italic dark:text-white">
                            Pilih Stiker
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sticker Grid */}
                <div className="custom-scrollbar max-h-[50vh] overflow-y-auto p-4">
                    <div className="grid grid-cols-4 gap-3">
                        {STICKERS.map((sticker) => (
                            <button
                                key={sticker.id}
                                onClick={() => handleSelect(sticker)}
                                className={`group relative aspect-square overflow-hidden rounded-xl border-2 p-2 transition-all duration-200 hover:scale-105 hover:shadow-lg ${selectedSticker === sticker.id
                                    ? "border-accent bg-accent/10"
                                    : "border-transparent hover:border-slate-200 dark:hover:border-white/20"
                                    }`}
                            >
                                <img
                                    src={sticker.src}
                                    alt={sticker.alt}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                                {selectedSticker === sticker.id && (
                                    <div className="bg-accent absolute top-1 right-1 h-3 w-3 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-slate-100 p-4 dark:border-white/10">
                    <button
                        onClick={handleClear}
                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    >
                        Hapus Stiker
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-primary flex-1 rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StickerPicker;
