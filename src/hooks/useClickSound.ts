
"use client";

import { useCallback, useEffect, useState } from 'react';

// IMPORTANT: You need to place your desired click sound file as 'click.mp3'
// in the 'public/sounds/' directory for this to work.
const CLICK_SOUND_SRC = '/sounds/click.mp3';

export function useClickSound() {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const clickAudio = new Audio(CLICK_SOUND_SRC);
    clickAudio.preload = 'auto';
    
    const handleCanPlayThrough = () => {
      setCanPlay(true);
    };

    const handleError = (e: Event) => {
      console.warn(`Error loading click sound: ${CLICK_SOUND_SRC}. Please ensure the file exists in public/sounds/ and is a valid audio file.`, e);
      setCanPlay(false); // Ensure we don't try to play a broken audio object
    };

    clickAudio.addEventListener('canplaythrough', handleCanPlayThrough);
    clickAudio.addEventListener('error', handleError);
    
    setAudio(clickAudio);

    return () => {
      clickAudio.removeEventListener('canplaythrough', handleCanPlayThrough);
      clickAudio.removeEventListener('error', handleError);
      if (clickAudio) {
        clickAudio.pause();
        // Setting src to empty string is a common way to release resources
        // but can sometimes cause issues or be unnecessary depending on browser.
        // For a small click sound, this might be overkill.
        // clickAudio.src = ''; 
      }
    };
  }, []);

  const playClickSound = useCallback(() => {
    if (audio && canPlay) {
      audio.currentTime = 0; // Rewind to start if already playing or played
      audio.play().catch(error => console.warn("Click sound play failed:", error));
    } else if (audio && !canPlay) {
      // Optionally, try to load again or log that sound is not ready
      // console.warn("Click sound not ready to play or failed to load.");
    }
  }, [audio, canPlay]);

  return playClickSound;
}
