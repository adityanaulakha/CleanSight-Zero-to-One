import React from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = ({ count = 20, className = "" }) => {
  const particles = Array.from({ length: count });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((_, index) => {
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 2;
        const randomDuration = Math.random() * 3 + 2;
        
        return (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              y: [0, -50, -100],
              x: [0, Math.random() * 50 - 25, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              delay: randomDelay,
              ease: "easeInOut",
            }}
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingParticles;
