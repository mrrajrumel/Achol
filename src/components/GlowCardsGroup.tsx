import React, { useRef } from 'react';

interface GlowCardsGroupProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * GlowCardsGroup: A parent context layout to coordinate mouse movements
 * across multiple adjacent GlowCards simultaneously. This makes it possible for nearby 
 * card borders to illuminate beautifully as the pointer is moved close to them.
 */
export const GlowCardsGroup: React.FC<GlowCardsGroupProps> = ({ 
  children, 
  className = '',
  id = 'cards'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.getElementsByClassName('glow-card');

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLDivElement;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const ratioX = x / rect.width;
      const ratioY = y / rect.height;

      card.style.setProperty('--ratio-x', ratioX.toString());
      card.style.setProperty('--ratio-y', ratioY.toString());

      // Compute geometric distance from Center (as requested by user)
      const fromCenterVal = Math.min(
        Math.max(
          0,
          Math.sqrt((ratioY - 0.5) * (ratioY - 0.5) + (ratioX - 0.5) * (ratioX - 0.5)) / 0.5
        ),
        1
      );
      card.style.setProperty('--from-center', fromCenterVal.toString());
    }
  };

  return (
    <div
      id={id}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={className}
    >
      {children}
    </div>
  );
};
