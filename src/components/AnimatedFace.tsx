
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ALL_FACES = ['>_<', '0_0', '-_0', '-_-', '?_?'];

export function AnimatedFace() {
  const [currentFace, setCurrentFace] = useState(ALL_FACES[0]);

  useEffect(() => {
    let faceChangeTimeout: NodeJS.Timeout;

    const scheduleNextFace = () => {
      const randomDelay = Math.floor(Math.random() * 1500) + 500; // Random delay between 0.5s and 2s
      faceChangeTimeout = setTimeout(() => {
        setCurrentFace(prevFace => {
          let nextFace;
          if (ALL_FACES.length > 1) {
            do {
              nextFace = ALL_FACES[Math.floor(Math.random() * ALL_FACES.length)];
            } while (nextFace === prevFace);
          } else {
            nextFace = ALL_FACES[0];
          }
          return nextFace;
        });
        scheduleNextFace();
      }, randomDelay);
    };

    scheduleNextFace();

    return () => clearTimeout(faceChangeTimeout);
  }, []);

  const textMotionKey = currentFace;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background pointer-events-none"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <motion.div
        key={textMotionKey}
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "linear" }}
        className="text-8xl md:text-9xl font-mono text-accent text-center select-none"
      >
        {currentFace}
      </motion.div>
    </div>
  );
}
