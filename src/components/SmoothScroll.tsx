import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Native scroll progress tracking
  const { scrollY } = useScroll();

  // Fine-tuned highly luxurious damping curve that matches high-end GSAP ScrollSmoother perfectly
  const springConfig = { damping: 25, stiffness: 85, mass: 0.5, restDelta: 0.01 };
  const smoothY = useSpring(scrollY, springConfig);

  // Translate container upwards based on smoothed scroll coordinates
  const translateY = useTransform(smoothY, (value) => -value);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Initial resize triggering
    handleResize();

    // Use a high-end ResizeObserver to refresh height dynamically when elements/posters render
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    // Interval backup for safety/image loading
    const timer = setInterval(handleResize, 1000);

    // Initial loading offsets to secure correct dimensions
    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      clearInterval(timer);
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Ghost layout layer securing correct scrollbar bounds */}
      <div 
        style={{ height: contentHeight }} 
        className="w-full absolute top-0 left-0 pointer-events-none z-0" 
      />

      {/* Viewport content window clipping native movement */}
      <div 
        id="smooth-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <motion.div
          id="smooth-content"
          ref={contentRef}
          className="w-full relative"
          style={{ 
            y: translateY,
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
};
