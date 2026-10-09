import React, { useRef, useState } from 'react';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  /** Enable subtle 3D tilt alongside the hover spotlight */
  enableTilt?: boolean;
}

/**
 * GlowCard: A luxury component featuring mouse-tracking radial spotlight glow,
 * high-fashion border-glares, and organic 3D tilt interactions.
 * 
 * Works seamlessly as a standalone component or can be synced inside a `<GlowCardsGroup>`.
 */
export const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  enableTilt = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set local variables for standalone usage (no group listener required)
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const width = rect.width;
    const height = rect.height;

    const ratioX = x / width;
    const ratioY = y / height;

    card.style.setProperty('--ratio-x', ratioX.toString());
    card.style.setProperty('--ratio-y', ratioY.toString());

    if (enableTilt) {
      // Elegant, high-fashion subtle rotation
      const rotateX = -((y - height / 2) / height) * 7; 
      const rotateY = ((x - width / 2) / width) * 7;
      setTilt({ x: rotateX, y: rotateY });
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`glow-card relative rounded-2xl select-none ${onClick ? 'cursor-pointer' : 'cursor-default'} border border-white/5 bg-[#11110E]/55 transition-all duration-300 ease-out ${className}`}
      style={{
        transform: isHovered && enableTilt
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
          : `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Content lies above the absolute spotlight layer and maintains true 3D depth */}
      <div className="relative z-10 w-full h-full flex flex-col" style={{ transform: 'translateZ(15px)' }}>
        {children}
      </div>
    </div>
  );
};
