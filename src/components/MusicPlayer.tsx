import * as React from "react";
import { useEffect, useRef } from "react";
import { useSettings } from "../contexts/SettingsContext";

const MusicPlayer: React.FC = () => {
  const { config } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fadeDuration = 3000; // 3 seconds
    const fadeInterval = 50; // ms
    let interval: any = null;

    const fade = (audio: HTMLAudioElement, targetVolume: number) => {
      clearInterval(interval);
      const step = (fadeInterval / fadeDuration) * (targetVolume === 1 ? 1 : -1);

      interval = setInterval(() => {
        const nextVolume = audio.volume + step;
        if (targetVolume === 1) {
          if (nextVolume < 1) {
            audio.volume = nextVolume;
          } else {
            audio.volume = 1;
            clearInterval(interval);
            interval = null;
          }
        } else {
          if (nextVolume > 0) {
            audio.volume = nextVolume;
          } else {
            audio.volume = 0;
            clearInterval(interval);
            interval = null;
          }
        }
      }, fadeInterval);
    };

    const handlePlay = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => fade(audioRef.current!, 1))
          .catch((err) => console.warn("Autoplay prevented", err));
      }
    };

    const handlePause = () => {
      if (audioRef.current) {
        fade(audioRef.current!, 0);
        setTimeout(() => {
          if (audioRef.current) audioRef.current.pause();
        }, 3000);
      }
    };

    const handleToggle = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          handlePlay();
        } else {
          handlePause();
        }
      }
    };

    // To handle smooth looping with fade, we listen for 'timeupdate' for the end
    const monitorLoop = () => {
      const audio = audioRef.current;
      if (audio && audio.duration && audio.currentTime > audio.duration - 3 && interval === null && audio.volume > 0.9) {
        fade(audio, 0);
      }
    };

    const handleEnded = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => fade(audioRef.current!, 1));
      }
    };

    window.addEventListener("play-wedding-music", handlePlay);
    window.addEventListener("pause-wedding-music", handlePause);
    window.addEventListener("toggle-wedding-music", handleToggle);

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', monitorLoop);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      window.removeEventListener("play-wedding-music", handlePlay);
      window.removeEventListener("pause-wedding-music", handlePause);
      window.removeEventListener("toggle-wedding-music", handleToggle);
      if (audio) {
        audio.removeEventListener('timeupdate', monitorLoop);
        audio.removeEventListener('ended', handleEnded);
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={config.musicUrl}
      preload="auto"
      className="hidden"
    />
  );
};

export default MusicPlayer;
