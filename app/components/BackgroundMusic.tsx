
"use client";

import { useEffect, useRef } from "react";

export default function BackgroundMusic() {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.loop = true;
        audio.volume = 0.45;

        let started = false;
        let active = true;

        const removeStartListeners = () => {
            document.removeEventListener("pointerdown", startMusic);
            document.removeEventListener("keydown", startMusic);
            document.removeEventListener("touchstart", startMusic);
        };

        const startMusic = async () => {
            if (!active || started || !audio.paused) return;

            try {
                await audio.play();

                if (!active) {
                    audio.pause();
                    return;
                }

                started = true;
                removeStartListeners();
            } catch {
                // Browser mungkin memblokir autoplay.
                // Coba lagi setelah interaksi pengguna.
            }
        };

        document.addEventListener("pointerdown", startMusic);
        document.addEventListener("keydown", startMusic);
        document.addEventListener("touchstart", startMusic);

        void startMusic();

        return () => {
            active = false;
            removeStartListeners();
        };
    }, []);

    return (
        <audio
            ref={audioRef}
            src="/NextCAD Music Background.mp3"
            loop
            preload="auto"
            aria-hidden="true"
        />
    );
}