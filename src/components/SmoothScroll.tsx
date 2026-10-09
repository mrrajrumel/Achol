import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile/touch devices or users preferring reduced motion
    const checkTouch = () => {
      const isTouch = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        window.innerWidth < 1024
      );
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch, { passive: true });
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Native scroll progress tracking
  const { scrollY } = useScroll();

  // Fine-tuned highly responsive silky damping curve for desktop
  const springConfig = { damping: 28, stiffness: 95, mass: 0.25, restDelta: 0.001 };
  const smoothY = useSpring(scrollY, springConfig);

  // Translate container upwards based on smoothed scroll coordinates
  const translateY = useTransform(smoothY, (value) => -value);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('load', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return (
      <div id="smooth-content" className="w-full relative">
        {children}
      </div>
    );
  }

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
