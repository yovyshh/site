
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function AnimatedFace() {
  const [face, setFace] = useState('>_<');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFace(prevFace => (prevFace === '>_<' ? '0_0' : '>_<'));
    }, 1000); // Switch every second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div
      key={face} // Ensures animation remounts on face change for enter/exit
      initial={{ opacity: 0, scale: 0.8, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-8xl md:text-9xl font-mono text-accent text-center select-none"
    >
      {face}
    </motion.div>
  );
}
