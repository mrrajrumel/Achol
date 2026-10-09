import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Github, Twitter, Instagram, Sparkles, Film, Award, Image, Mail, BookOpen } from 'lucide-react';

interface FullScreenNavigationProps {
  useAudio?: boolean;
}

export const FullScreenNavigation: React.FC<FullScreenNavigationProps> = ({ useAudio = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sound triggering helper
  const triggerAudioChime = (frequency: number) => {
    if (!useAudio) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      console.warn('Audio feedback blocked or failed:', e);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { title: 'Home', href: '#hero', icon: Sparkles, desc: 'Introductory Cinematic Showcase' },
    { title: 'Biography', href: '#biography', icon: BookOpen, desc: 'Life, Career, and Inspiration' },
    { title: 'Filmography', href: '#filmography', icon: Film, desc: 'Stellar Box-Office Screen Archive' },
    { title: 'Showreel', href: '#showreel', icon: Award, desc: 'Selected Editorial Film Scenes' },
    { title: 'Recognition', href: '#recognition', icon: Award, desc: 'Elite Industry Awards' },
    { title: 'Gallery', href: '#gallery', icon: Image, desc: 'High-Fashion Dynamic Poster Wall' },
    { title: 'Bookings', href: '#bookings', icon: Mail, desc: 'Request PR Collaboration or Booking', primary: true },
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
    triggerAudioChime(isOpen ? 220 : 380);
    
    // Prevent scrolling when full screen menu is active
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    document.body.style.overflow = '';
    triggerAudioChime(440);
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      setTimeout(() => {
        let top = 0;
        let el = targetElement as HTMLElement | null;
        while (el && el.id !== 'smooth-content') {
          top += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }, 500);
    }
  };

  return (
    <>
      {/* 1. HUD CONTAINER HEADER */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 py-5 ${
          scrolled 
            ? 'bg-[#030302]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
          
          {/* Authentic Supreme Branding Logo */}
          <a 
            href="#hero" 
            onClick={() => handleLinkClick('#hero')}
            className="group flex flex-col focus:outline-none"
            aria-label="Achol Akhe - Dhallywood Prime Superstar, Home"
          >
            <span className="font-serif text-lg sm:text-2xl tracking-[0.22em] text-white group-hover:text-[#D4B27A] transition-colors duration-400 font-bold uppercase">
              ACHOL AKHE
            </span>
            <span className="font-sans text-xs tracking-[0.25em] text-[#D4B27A] uppercase transition-colors duration-400 mt-0.5 font-medium">
              DHALLYWOOD PRIME SUPERSTAR
            </span>
          </a>

          {/* Luxury Navigation Controller with Circular Clip Triggers */}
          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-white/80 hidden md:inline">
              {isOpen ? 'CLOSE INDEX' : 'EXPLORE SYSTEM'}
            </span>

            {/* Custom Interactive Hamburger Button */}
            <button
              type="button"
              onClick={handleToggle}
              className="btn group w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/15 hover:border-[#C8A261] hover:bg-white/10 text-white transition-all duration-300 relative focus:outline-none overflow-hidden"
              style={{ zIndex: 100 }}
              aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={isOpen}
            >
              {/* Button Hover Glow Backdrop */}
              <div className="absolute inset-0 bg-[#C8A261]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative w-5 h-5 flex flex-col justify-between items-center z-10">
                <motion.span
                  animate={{
                    rotate: isOpen ? 45 : 0,
                    y: isOpen ? 9 : 0,
                    width: isOpen ? "20px" : "20px"
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="h-[2px] bg-white rounded-full origin-center"
                  style={{ width: '20px' }}
                />
                <motion.span
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    scale: isOpen ? 0.5 : 1
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="h-[2px] w-5 bg-white rounded-full"
                />
                <motion.span
                  animate={{
                    rotate: isOpen ? -45 : 0,
                    y: isOpen ? -9 : 0,
                    width: isOpen ? "20px" : "20px"
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="h-[2px] bg-white rounded-full origin-center"
                  style={{ width: '20px' }}
                />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAJESTIC CIRCULAR CLIP-PATH NAVIGATION WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{
              clipPath: 'circle(0% at calc(100% - 60px) 60px)',
            }}
            animate={{
              clipPath: 'circle(150% at calc(100% - 60px) 60px)',
            }}
            exit={{
              clipPath: 'circle(0% at calc(100% - 60px) 60px)',
            }}
            transition={{
              duration: 1.1,
              ease: [0.76, 0, 0.24, 1] // Custom luxury cubic-bezier matching elite GSAP designs
            }}
            className="fixed inset-0 bg-black/98 z-40 flex flex-col [backface-visibility:hidden] [transform-style:preserve-3d] will-change-transform"
          >
            {/* Ambient luxury particle backdrop overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-neutral-900/40 via-transparent to-transparent opacity-60 pointer-events-none" />
            
            {/* Minimalist Grid Coordinate background guides */}
            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-5">
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div className="border-r border-white"></div>
              <div></div>
            </div>

            {/* Main Menu Box */}
            <div className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 py-12 max-w-7xl mx-auto z-10 pt-32">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto w-full">
                
                {/* Visual Editorial Left Side panel */}
                <div className="lg:col-span-5 flex-col hidden lg:flex space-y-7 border-l border-white/10 pl-8">
                  <span className="font-mono text-xs tracking-[0.25em] text-[#D4B27A] uppercase">Creative Director Note</span>
                  <div className="space-y-4">
                    <p className="font-serif italic text-2xl text-white/95 leading-relaxed font-light">
                      "Fashion and cinematic performance are mediums to express the transient beauty of human vulnerability and strength."
                    </p>
                    <span className="text-xs font-mono tracking-widest uppercase text-white/60">
                      — Hasna Hena Akhee Achol
                    </span>
                  </div>

                  {/* Dynamic interactive stats */}
                  <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                    <div>
                      <span className="block font-serif text-3xl text-white font-extrabold">20+</span>
                      <span className="text-xs tracking-wider uppercase text-white/60 font-mono">Box office ventures</span>
                    </div>
                    <div>
                      <span className="block font-serif text-3xl text-[#D4B27A] font-extrabold">12M+</span>
                      <span className="text-xs tracking-wider uppercase text-white/60 font-mono">Global impressions</span>
                    </div>
                  </div>
                </div>

                {/* Staggered Navigation Items List */}
                <div className="lg:col-span-7 flex flex-col space-y-1 sm:space-y-2 w-full text-left">
                  {menuItems.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.15 + idx * 0.08,
                          duration: 0.9,
                          ease: [0.16, 1, 0.3, 1] // Elastic slide in effect
                        }}
                      >
                        <button
                          onClick={() => handleLinkClick(item.href)}
                          className="group relative flex items-center justify-between w-full py-2.5 sm:py-3.5 border-b border-white/5 text-left focus:outline-none"
                        >
                          <div className="flex items-center gap-6 sm:gap-8">
                            {/* Stagger Index numbers resembling high fashion sites */}
                            <span className="font-mono text-[11px] text-[#C8A261]/50 tracking-widest">
                              0{idx + 1}
                            </span>
                            
                            <div>
                              <div className="flex items-center gap-3">
                                <span className={`font-serif text-3xl sm:text-5xl lg:text-5xl tracking-tight leading-none text-white transition-all duration-400 font-bold group-hover:pl-4 group-hover:text-[#D4B27A] ${item.primary ? 'underline decoration-[#C8A261]/30 underline-offset-8' : ''}`}>
                                  {item.title}
                                </span>
                                
                                {item.primary && (
                                  <span className="px-2 py-0.5 rounded-full border border-[#C8A261]/40 bg-[#C8A261]/10 text-[#C8A261] font-mono text-[9px] uppercase tracking-widest">
                                    PR Active
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] mt-1 font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {item.desc}
                              </p>
                            </div>
                          </div>

                          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:border-[#C8A261] group-hover:text-[#D4B27A] group-hover:scale-110 transition-all duration-400">
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

              </div>

              {/* Sub-navigation layout footer */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-white/10 pt-8 mt-12">
                <div className="flex gap-4">
                  <a href="https://instagram.com" target="_blank" className="p-2.5 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-[#C8A261] hover:border-[#C8A261] hover:bg-[#C8A261]/5 transition-all duration-300">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://twitter.com" target="_blank" className="p-2.5 rounded-full bg-white/5 border border-white/5 text-white/60 hover:text-[#C8A261] hover:border-[#C8A261] hover:bg-[#C8A261]/5 transition-all duration-300">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>

                <span className="font-mono text-[9px] tracking-[0.25em] text-white/30 uppercase text-center sm:text-right">
                  EXQUISITE CINEMATIC DIGITAL FRAMEWORK © 2026. ALL RIGHTS RESERVED
                </span>
              </div>

            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
