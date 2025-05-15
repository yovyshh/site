
"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export function AnimatedFace() {
  const [currentFace, setCurrentFace] = useState('>_<');
  const [isFollowing, setIsFollowing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isManuallyBlinking, setIsManuallyBlinking] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Start invisible for initial mount animation

  // Initial mount animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100); // Short delay for transition
    return () => clearTimeout(timer);
  }, []);

  // Periodic blinking
  useEffect(() => {
    if (isManuallyBlinking || !isVisible) return;

    const intervalId = setInterval(() => {
      setCurrentFace(prevFace => (prevFace === '>_<' ? '0_0' : '>_<'));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isManuallyBlinking, isVisible]);

  // Mouse following logic
  useEffect(() => {
    if (!isFollowing || !isVisible) return;

    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFollowing, isVisible]);

  const handleFaceClick = useCallback(() => {
    if (!isFollowing) {
      setIsFollowing(true);
      
      setIsManuallyBlinking(true);
      setCurrentFace('0_0'); // Start blink
      setTimeout(() => {
        setCurrentFace('>_<'); // Blink
        setTimeout(() => {
          setIsManuallyBlinking(false); // Resume periodic blinking
        }, 200);
      }, 150);
    }
  }, [isFollowing]);

  const faceVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  const textMotionKey = currentFace + (isFollowing ? 'follow' : 'initial');

  if (!isFollowing) {
    return (
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[1]" // z-index 1 to be above bg, below windows
        onClick={handleFaceClick}
        style={{ cursor: 'pointer', pointerEvents: isVisible ? 'auto' : 'none' }}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={faceVariants}
      >
        <motion.div
          key={textMotionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="text-8xl md:text-9xl font-mono text-accent text-center select-none"
        >
          {currentFace}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="text-5xl font-mono text-accent select-none fixed z-[45]" // z-index below taskbar(50) but above most windows
      style={{
        left: position.x,
        top: position.y,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none', // Crucial for not interfering
        opacity: isVisible ? 1: 0, // ensure visibility ties to isVisible
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }} // Smooth following
    >
       <motion.div
          key={textMotionKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
      {currentFace}
      </motion.div>
    </motion.div>
  );
}
