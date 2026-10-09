import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { filmographyProjects } from '../data';

interface CinematicHeroSliderProps {
  onExploreFilmography?: () => void;
}

export const CinematicHeroSlider: React.FC<CinematicHeroSliderProps> = ({
  onExploreFilmography,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Active slide details derived from real movie data randomly on every load
  const slides = useMemo(() => {
    // 1. Shuffle the array randomly
    const shuffledProjects = [...filmographyProjects].sort(() => 0.5 - Math.random());
    // 2. Take the first 6 projects
    const selectedProjects = shuffledProjects.slice(0, 6);

    return selectedProjects.map((project, index) => {
      // Elegant cinematic palettes matching film vibes
      const colors = [
        ['#C8A261', '#110c03'], // Bhool - Gold
        ['#EF1541', '#150306'], // Bailey Road - Crimson Red
        ['#069DE0', '#030f15'], // Jotil Prem - Cyan
        ['#6E55DC', '#0c071a'], // Prem Prem Paglami - Blue Orchid
        ['#FF7112', '#1a0d03'], // Faand: The Trap - Sunset Amber
        ['#05AC3F', '#031408'], // Kistimaat - Emerald green
      ];
      const selectedColor = colors[index % colors.length];
      return {
        ...project,
        num: String(index + 1).padStart(2, '0'),
        colorAccent: selectedColor[0],
        colorBg: selectedColor[1],
      };
    });
  }, []);

  // Soft loop autoplay timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 7000); 

    return () => clearInterval(interval);
  }, [slides.length]);

  // Liquid WebGL-mimicking high-fashion background canvas engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;
    
    const particleCount = 100;
    const waveSpeed = 1.2;
    const distortion = 0.6;
    const particles: Array<{
      x: number;
      y: number;
      ox: number;
      oy: number;
      size: number;
      speed: number;
      angle: number;
      depth: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          ox: x,
          oy: y,
          size: Math.random() * 2.0 + 0.5,
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI * 2,
          depth: Math.random() * 0.8 + 0.2,
        });
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let mouse = { x: canvas.width / 2, y: canvas.height / 2, tx: canvas.width / 2, ty: canvas.height / 2 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible) {
          cancelAnimationFrame(animFrame);
          animFrame = requestAnimationFrame(render);
        }
      },
      { threshold: 0.05 }
    );
    if (canvas) {
      observer.observe(canvas);
    }

    const render = () => {
      if (!isVisible) return;
      time += 0.01 * waveSpeed;

      mouse.x += (mouse.tx - mouse.x) * 0.07;
      mouse.y += (mouse.ty - mouse.y) * 0.07;

      const currentThemeColor = slides[activeIndex].colorAccent;
      const currentBgColor = slides[activeIndex].colorBg;

      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Liquid overlay
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.4) * 120 * distortion,
        canvas.height * 0.5 + Math.cos(time * 0.3) * 80 * distortion,
        200,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.9
      );
      gradient.addColorStop(0, `${currentBgColor}`);
      gradient.addColorStop(0.6, '#020202');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spotlight glow source
      const lightSourceX = canvas.width * 0.7 + Math.sin(time) * 80;
      const lightSourceY = canvas.height * 0.3 + Math.cos(time * 0.7) * 60;
      const lightGrad = ctx.createRadialGradient(
        lightSourceX, lightSourceY, 10,
        lightSourceX, lightSourceY, canvas.width * 0.6
      );
      lightGrad.addColorStop(0, `${currentThemeColor}12`);
      lightGrad.addColorStop(0.5, `${currentThemeColor}02`);
      lightGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Waves design
      ctx.strokeStyle = `${currentThemeColor}0b`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.moveTo(0, y);
        for (let x = 0; x < canvas.width; x += 20) {
          const wave = Math.sin(x * 0.002 + time) * 20 * distortion;
          const mouseDist = Math.hypot(x - mouse.x, y - mouse.y);
          const mouseDisplacement = Math.max(0, (120 - mouseDist) / 8) * Math.sin(time * 4);
          ctx.lineTo(x, y + wave + mouseDisplacement);
        }
      }
      ctx.stroke();

      // Cosmic star fields
      particles.forEach((p, idx) => {
        p.angle += 0.003;
        const sMult = p.depth;
        p.x += Math.sin(p.angle) * p.speed * sMult;
        p.y += Math.cos(p.angle) * p.speed * sMult;

        const dMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dMouse < 150) {
          const force = (150 - dMouse) * 0.03 * p.depth;
          const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x);
          p.x += Math.cos(angle) * force;
          p.y += Math.sin(angle) * force;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = (0.3 + (Math.sin(time + idx) * 0.4 + 0.4) * 0.6) * p.depth;
        ctx.fillStyle = `${idx % 3 === 0 ? currentThemeColor : '#ffffff'}${Math.floor(alpha * 240).toString(16).padStart(2, '0')}`;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 + p.depth), 0, Math.PI * 2);
        ctx.fill();
      });

      // Grid guides
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = 0; gx < canvas.width; gx += canvas.width / 5) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
      }
      ctx.stroke();

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeIndex, slides]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main 
      id="slider-container"
      className="slider-wrapper relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black text-white select-none lg:pt-24 pb-8 sm:pb-12"
    >
      {/* Liquid fluid animation backdrop */}
      <canvas ref={canvasRef} className="webgl-canvas absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" />

      {/* Dynamic gradient masks */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/30 to-transparent pointer-events-none z-1" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-1" />

      {/* LEFT/RIGHT STATUS FLUID DOTS (Hidden on mobile) */}
      <div className="absolute top-1/2 left-[5%] -translate-y-1/2 flex flex-col items-center gap-1 z-10 hidden xl:flex">
        <span 
          className="slide-number font-mono text-xs tracking-wider text-white font-medium transform -rotate-90 origin-center mb-6"
          aria-label={`Slide ${slides[activeIndex].num} of ${slides.length}`}
        >
          Slide 0{slides[activeIndex].num}
        </span>
        <div className="h-40 w-[2px] bg-white/10 relative rounded-full overflow-hidden" aria-hidden="true">
          <motion.div 
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent to-white animate-pulse"
            style={{ height: `${((activeIndex + 1) / slides.length) * 100}%` }}
            layout
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          />
        </div>
        <span className="slide-total font-mono text-xs tracking-wider text-white/50 mt-6" aria-hidden="true">
          0{slides.length}
        </span>
      </div>

      {/* GLOBAL NAVIGATION ARROWS (Positioned absolute to the screen for ease of use) */}
      <button 
        type="button"
        onClick={handlePrev} 
        aria-label="Previous slide"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-white text-white hover:text-black hover:scale-105 border border-white/10 transition-all duration-300 backdrop-blur-md shadow-2xl hidden md:block"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </button>

      <button 
        type="button"
        onClick={handleNext} 
        aria-label="Next slide"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-white text-white hover:text-black hover:scale-105 border border-white/10 transition-all duration-300 backdrop-blur-md shadow-2xl hidden md:block"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </button>

      {/* CORE CONTENT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex-1 flex flex-col justify-center py-16 lg:py-0">
        
        {/* Layered Grid System - Overlaps Image and Text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center w-full relative">
          
          {/* IMAGE LAYER (Behind the text panel, scaled to original proportions) */}
          <div className="lg:col-span-7 lg:col-start-1 relative z-10 flex justify-center items-center w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', x: -20 }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', x: 20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative group cursor-pointer w-full flex justify-center"
                onClick={handleNext}
              >
                {/* Dynamic Neon Backlight behind the image */}
                <div 
                  className="absolute inset-0 opacity-40 blur-[80px] rounded-full scale-90 transition-all duration-1000 -z-10"
                  style={{ background: slides[activeIndex].colorAccent }}
                />

                {/* The Image (Uncropped, pure proportions) */}
                <img 
                  src={
                    slides[activeIndex].embedId 
                      ? `https://img.youtube.com/vi/${slides[activeIndex].embedId}/maxresdefault.jpg` 
                      : (slides[activeIndex].imageUrl || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop')
                  }
                  alt={slides[activeIndex].title}
                  referrerPolicy="no-referrer"
                  className="max-h-[45vh] lg:max-h-[70vh] w-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Mobile Navigation Indicators (Visible only on small screens over the image) */}
                <div className="absolute bottom-4 inset-x-0 flex justify-between px-4 md:hidden z-30 pointer-events-none">
                  <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md pointer-events-auto border border-white/10">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md pointer-events-auto border border-white/10">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* TEXT OVERLAY LAYER (Frosted glass panel overlapping the image) */}
          <div className="lg:col-span-6 lg:col-start-7 relative z-20 -mt-12 lg:mt-0 lg:-ml-24 flex flex-col items-center lg:items-start w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex flex-col items-center lg:items-start text-center lg:text-left bg-black/50 lg:bg-black/40 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                {/* Badge & Year */}
                <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-start mb-4">
                  <span className="font-mono text-xs text-white/70 tracking-[0.2em] uppercase">
                    PROD — {slides[activeIndex].year}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full border text-xs uppercase font-semibold tracking-wider backdrop-blur-md"
                    style={{ 
                      borderColor: `${slides[activeIndex].colorAccent}45`, 
                      background: `${slides[activeIndex].colorAccent}15`,
                      color: slides[activeIndex].colorAccent,
                    }}
                  >
                    {slides[activeIndex].badge}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.1] font-bold text-white mb-3">
                  <span className="block capitalize bg-gradient-to-br from-white via-white/95 to-white/60 bg-clip-text text-transparent">
                    {slides[activeIndex].title}
                  </span>
                </h1>

                {/* Role/Character Subtitle */}
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-6 w-full">
                  <div className="h-[2px] w-8 sm:w-12 hidden lg:block" style={{ background: slides[activeIndex].colorAccent }} />
                  <p className="font-serif italic text-lg sm:text-xl lg:text-2xl tracking-wide font-medium text-white/90">
                    Achol Akhe as {slides[activeIndex].role}
                  </p>
                </div>

                {/* Description Text */}
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal font-sans mb-8">
                  {slides[activeIndex].description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  <button
                    type="button"
                    onClick={onExploreFilmography}
                    className="group relative inline-flex items-center justify-center gap-2.5 uppercase tracking-wider text-xs font-semibold bg-white text-black py-4 px-8 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
                  >
                    <span>EXPLORE ARCHIVE</span>
                    <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <a 
                    href="#bookings"
                    className="group inline-flex items-center justify-center gap-2 uppercase tracking-wider text-xs font-semibold border border-white/20 hover:border-[#D4B27A] bg-transparent hover:bg-white/5 text-white/90 hover:text-white py-4 px-8 rounded-full active:scale-95 transition-all duration-300 w-full sm:w-auto text-center"
                  >
                    <span>PR BOOKING</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* MINIMALIST VISITOR FOOTER STATUS WITH SIMPLE DOTS PAGE NAVIGATION */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Navigation dots */}
        <nav className="flex items-center gap-3 sm:gap-4 justify-center py-2" id="slidesNav">
          {slides.map((slide, index) => {
            const isSlideSelected = index === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(index)}
                className="group flex flex-col items-center gap-1 focus:outline-none"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div className="h-0 tracking-[0.1em] font-mono text-xs font-medium pb-4 text-white/50 group-hover:text-white/80 transition-colors uppercase relative select-none hidden sm:block">
                  {isSlideSelected ? (
                    <span style={{ color: slide.colorAccent }} className="font-bold">
                      {slide.title}
                    </span>
                  ) : (
                    <span>0{index + 1}</span>
                  )}
                </div>

                <div className="w-6 sm:w-10 h-1 bg-white/10 rounded-full relative overflow-hidden transition-all duration-300">
                  {isSlideSelected ? (
                    <motion.div 
                      layoutId="activeSlideBar"
                      className="absolute inset-0 w-full h-full"
                      style={{ background: slide.colorAccent }}
                      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-0 bg-white/30 group-hover:w-full transition-all duration-300" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Watermark */}
        <span className="font-mono text-xs tracking-[0.2em] text-white/40 uppercase text-center md:text-right">
          DHALLYWOOD CINEMATIC REELS © 2026
        </span>
      </div>

    </main>
  );
};