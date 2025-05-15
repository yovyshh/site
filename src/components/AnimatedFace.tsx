
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const ALL_FACES = ['>_<', '0_0', '-_0', '-_-', '?_?'];
const BLINK_SEQUENCE_CLICK = ['0_0', '>_<']; // Face to show on click, then after a short delay

export function AnimatedFace() {
  const [currentFace, setCurrentFace] = useState(ALL_FACES[0]); // Start with the first face
  const [isVisible, setIsVisible] = useState(false);
  const [isClickAnimating, setIsClickAnimating] = useState(false);

  // Initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100); // Short delay for transition
    return () => clearTimeout(timer);
  }, []);

  // Random face change logic
  useEffect(() => {
    if (!isVisible || isClickAnimating) return; // Pause random changes during click animation

    let faceChangeTimeout: NodeJS.Timeout;

    const scheduleNextFace = () => {
      // Random delay between 0.5s and 2s
      const randomDelay = Math.floor(Math.random() * 1500) + 500; 
      faceChangeTimeout = setTimeout(() => {
        setCurrentFace(prevFace => {
          let nextFace;
          // Try to pick a different face from the current one, if possible
          if (ALL_FACES.length > 1) {
            do {
              nextFace = ALL_FACES[Math.floor(Math.random() * ALL_FACES.length)];
            } while (nextFace === prevFace);
          } else {
            nextFace = ALL_FACES[0];
          }
          return nextFace;
        });
        scheduleNextFace(); // Reschedule for the next change
      }, randomDelay);
    };

    scheduleNextFace(); // Start the cycle

    return () => clearTimeout(faceChangeTimeout); // Cleanup on unmount or when dependencies change
  }, [isVisible, isClickAnimating]);

  const handleFaceClick = useCallback(() => {
    if (isClickAnimating) return; // Prevent re-triggering if already animating

    setIsClickAnimating(true);
    setCurrentFace(BLINK_SEQUENCE_CLICK[0]); // e.g., 0_0

    setTimeout(() => {
      setCurrentFace(BLINK_SEQUENCE_CLICK[1]); // e.g., >_<
      // After the click blink sequence, allow random animation to resume
      setTimeout(() => {
        setIsClickAnimating(false);
        // Optionally, force an immediate random face to avoid waiting for the next scheduled change
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
      }, 200); // Duration of the second part of click blink
    }, 150); // Duration of the first part of click blink
  }, [isClickAnimating]);

  const faceVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  // Using currentFace as key for motion.div to re-trigger animation on face character change
  const textMotionKey = currentFace; 

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[1]" // z-index 1 to be above bg, below windows
      onClick={handleFaceClick}
      style={{ cursor: 'pointer', pointerEvents: isVisible ? 'auto' : 'none' }}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={faceVariants}
      // Prevent this div from capturing focus if it's not meant to be interactive beyond click
      tabIndex={-1} 
    >
      <motion.div
        key={textMotionKey} // Re-animate when face changes
        initial={{ opacity: 0.8, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "linear" }} // Quick transition for face character change
        className="text-8xl md:text-9xl font-mono text-accent text-center select-none"
      >
        {currentFace}
      </motion.div>
    </motion.div>
  );
}
