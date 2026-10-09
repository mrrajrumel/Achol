import React, { useEffect, useRef, useState } from 'react';
import { filmographyProjects } from '../data';

interface InfinityPosterWallProps {
  className?: string;
}

export const InfinityPosterWall: React.FC<InfinityPosterWallProps> = ({ 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Use the rich movie list from the official dataset to render beautiful poster images
  const posterImages = filmographyProjects.map(p => p.imageUrl);

  // Generate a matrix of columns to create a truly layered "Infinity Poster Wall"
  const columnsCount = 6;
  const columnPosters = Array.from({ length: columnsCount }).map((_, colIndex) => {
    // Shuffling/shifting posters so each column has a different, beautiful visual layout
    const shifted = [...posterImages];
    for (let i = 0; i < colIndex * 2; i++) {
      const first = shifted.shift();
      if (first) shifted.push(first);
    }
    // Quadruple the column list to create a completely seamless infinite loop
    return [...shifted, ...shifted, ...shifted, ...shifted];
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Standardize mouse coordinates as ratios (-0.5 to 0.5) from center
    const tiltX = (y / rect.height - 0.5) * -18; // Subtle tilting rotation
    const tiltY = (x / rect.width - 0.5) * 18;

    setMouse({ x: tiltY, y: tiltX });
  };

  const handlePointerEnter = () => setIsHovered(true);
  const handlePointerLeave = () => {
    setIsHovered(false);
    setMouse({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-[550px] sm:h-[650px] md:h-[750px] bg-black overflow-hidden flex items-center justify-center border-y border-white/5 ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* 1. COMPUTE-BASED TILT CANVAS container */}
      <div 
        className="absolute inset-0 w-full h-full flex justify-between gap-4 md:gap-6 px-4 md:px-8 select-none pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: isHovered 
            ? `rotateX(${mouse.y}deg) rotateY(${mouse.x}deg) scale(1.05)`
            : `rotateX(0deg) rotateY(0deg) scale(1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {columnPosters.map((posters, colIdx) => {
          // Alternative columns scroll up or down using GPU accelerated animations
          const isEven = colIdx % 2 === 0;
          const animationClass = isEven ? 'animate-scroll-vertical' : 'animate-scroll-vertical-reverse';
          
          return (
            <div 
              key={colIdx}
              className="flex-1 min-w-[120px] sm:min-w-[150px] md:min-w-[180px] h-full overflow-hidden relative"
              style={{
                transform: `translateZ(${colIdx % 3 === 1 ? '10px' : colIdx % 3 === 2 ? '-10px' : '0px'})`,
              }}
            >
              <div className={`flex flex-col gap-4 md:gap-6 w-full ${animationClass}`}>
                {posters.map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    className="aspect-[2/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#111] border border-white/5 shadow-2xl transition-all duration-300 relative group"
                  >
                    <img 
                      src={imgUrl} 
                      alt="Film Poster"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-65 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. PREMIUM BLACK GRADIENT FADES to secure zero layout shift and blend into the app page */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />

      {/* 3. CENTERED LOGO BRAND OVERLAY (User-Provided High Contrast SVG) */}
      <div className="relative z-25 flex flex-col items-center justify-center p-8 text-center pointer-events-auto select-none max-w-lg md:max-w-2xl px-4">
        {/* Soft, beautiful multi-color backdrop halo reacting subtly */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] bg-gradient-to-tr from-[#C8A261]/20 via-[#EF1541]/10 to-[#6E55DC]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-pulse" />
        
        <div className="w-full h-auto transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]">
          {/* Requested Logo Component with customizable fill and dimensions */}
          <svg className="w-[180px] sm:w-[320px] md:w-[450px] h-auto" viewBox="0 0 650 186" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <title>Achol Cinematic Universe</title>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="achol-tv-logo" fillRule="nonzero">
                {/* Clean, high-fashion typography spelling ACHOL */}
                <text x="15" y="132" fill="#FFFFFF" fontFamily="'Playfair Display', system-ui, -apple-system, sans-serif" fontSize="110" fontWeight="900" letterSpacing="16">ACHOL</text>
                
                <path d="M589.9,122.1 C587.7,122.1 585.5,122.7 583.7,123.9 C581.9,125.1 580.4,126.8 579.6,128.9 C578.8,131 578.5,133.1 579,135.3 C579.5,137.5 580.5,139.4 582,141 C583.5,142.6 585.5,143.5 587.7,144 C589.9,144.5 592.1,144.2 594.1,143.4 C596.2,142.6 597.9,141.1 599.1,139.3 C600.3,137.5 600.9,135.3 600.9,133.1 C600.9,130.2 599.7,127.4 597.6,125.2 C595.7,123.2 592.9,122.1 589.9,122.1" fill="#069DE0"></path>
                <path d="M589.9,91.7 C587.7,91.7 585.5,92.3 583.7,93.5 C581.9,94.7 580.4,96.4 579.6,98.5 C578.8,100.6 578.5,102.7 579,104.9 C579.5,107.1 580.5,109 582,110.6 C583.5,112.2 585.5,113.1 587.7,113.6 C589.9,114.1 592.1,113.8 594.1,113 C596.2,112.2 597.9,110.7 599.1,108.9 C600.3,107.1 600.9,104.9 600.9,102.7 C600.9,99.8 599.7,97 597.6,94.8 C595.7,92.9 592.9,91.7 589.9,91.7" fill="#6E55DC"></path>
                <path d="M589.9,152.3 C587.7,152.3 585.5,152.9 583.7,154.1 C581.9,155.3 580.4,157 579.6,159.1 C578.8,161.2 578.5,163.3 579,165.5 C579.5,167.7 580.5,169.6 582,171.2 C583.5,172.8 585.5,173.7 587.7,174.2 C589.9,174.7 592.1,174.4 594.1,173.6 C596.2,172.8 597.9,171.3 599.1,169.5 C600.3,167.7 600.9,163.3 600.9,163.3 C600.9,161.8 600.7,160.4 600.1,159.1 C599.5,157.8 598.8,156.6 597.7,155.5 C596.7,154.5 595.4,153.7 594.1,153.1 C592.8,152.6 591.3,152.3 589.9,152.3" fill="#05AC3F"></path>
                <path d="M589.9,61.5 C587.7,61.5 585.5,62.1 583.7,63.3 C581.9,64.5 580.4,66.2 579.6,68.3 C578.8,70.4 578.5,72.5 579,74.7 C579.5,76.9 580.5,78.8 582,80.4 C583.6,82 585.5,82.9 587.7,83.4 C589.9,83.9 592.1,83.6 594.1,82.8 C596.2,82 597.9,80.5 599.1,78.7 C600.3,76.9 600.9,74.7 600.9,72.5 C600.9,71 600.7,69.6 600.1,68.3 C599.5,67 598.8,65.8 597.7,64.7 C596.7,63.7 595.4,62.9 594.1,62.3 C592.7,61.6 591.3,61.5 589.9,61.5" fill="#EF1541"></path>
                <path d="M589.9,31.2 C587.7,31.2 585.5,31.8 583.7,33 C581.9,34.2 580.4,35.9 579.6,38 C578.8,40.1 578.5,42.2 579,44.4 C579.5,46.6 580.5,48.5 582,50.1 C583.5,51.7 585.5,52.6 587.7,53.1 C589.9,53.6 592.1,53.3 594.1,52.5 C596.2,51.7 597.9,50.2 599.1,48.4 C600.3,46.6 600.9,44.4 600.9,42.2 C600.9,39.3 599.7,36.5 597.6,34.3 C595.7,32.4 592.9,31.2 589.9,31.2" fill="#FF7112"></path>
                <path d="M589.9,0.9 C587.7,0.9 585.5,1.5 583.7,2.7 C581.9,3.9 580.4,5.6 579.6,7.7 C578.8,9.8 578.5,11.9 579,14.1 C579.5,16.3 580.5,18.2 582,19.8 C583.5,21.4 585.5,22.3 587.7,22.8 C589.9,23.3 592.1,23 594.1,22.2 C596.2,21.4 597.9,19.9 599.1,18.1 C600.3,16.3 600.9,14.1 600.9,11.9 C600.9,9 599.7,6.2 597.6,4 C595.7,2.2 592.9,0.9 589.9,0.9" fill="#FCCC12"></path>
              </g>
            </g>
          </svg>
        </div>

        {/* Cinematic brand title pairing */}
        <h2 className="mt-8 text-2xl sm:text-4xl font-serif tracking-wide text-white font-bold text-center relative filter drop-shadow">
          Achol Cinematic Universe
        </h2>
        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#C8A261] to-transparent mt-3 mb-2" />
        <p className="text-xs tracking-[0.25em] font-mono text-[#D4B27A] uppercase font-medium">
          Streaming blockbusters & box office sensations
        </p>
      </div>
    </div>
  );
};
