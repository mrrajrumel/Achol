import React from 'react';
import { motion } from 'motion/react';

interface SmoothTextTransitionProps {
  children: string;
  className?: string;
  /**
   * Split the text by 'words' or 'characters' for the stagger entrance.
   * Defaults to 'words' for smoother reading, but 'characters' gives a high-end cinematic feel.
   */
  mode?: 'words' | 'characters';
  /**
   * Stagger delay between active elements in seconds
   */
  staggerDelay?: number;
  /**
   * Main transition duration for each segment in seconds
   */
  duration?: number;
}

/**
 * SmoothTextTransition: A premium, hardware-accelerated text transition wrapper.
 * Integrates blur-to-focus, gradual fade-in, and staggered entrance effects.
 * 
 * Performance Optimized: Uses 'will-change' to notify GPU engines and maintains
 * inline-block spacing to secure zero Cumulative Layout Shift (CLS).
 */
export const SmoothTextTransition: React.FC<SmoothTextTransitionProps> = ({
  children,
  className = '',
  mode = 'words',
  staggerDelay = 0.04,
  duration = 0.6,
}) => {
  // Split string into either words or single characters
  const segments = mode === 'words' 
    ? children.split(' ') 
    : children.split('');

  // Parent variant to control staggering sequence
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      filter: 'blur(8px)',
      transition: {
        duration: 0.25,
        ease: 'easeIn',
      },
    },
  };

  // Child variant for each beautiful word/character entrance
  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 12,
      filter: 'blur(6px)',
      scale: 0.98,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Ultra smooth cinematic ease-out curve
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ 
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
      }}
    >
      {segments.map((segment, idx) => (
        <motion.span
          key={idx}
          variants={childVariants}
          className="inline-block"
          style={{ 
            willChange: 'transform, opacity, filter',
            whiteSpace: 'pre', // Preserves exact spacing
          }}
        >
          {segment}
          {/* Add a space character back if we split on words */}
          {mode === 'words' && idx < segments.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
};
