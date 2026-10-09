import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, BookOpen, Star, Clock, Award, Compass, Heart, Film, Sparkles, ExternalLink, ChevronRight } from 'lucide-react';
import cinemaBanner from '../assets/images/achol_cinema_banner_1781897521656.jpg';

interface InteractiveBiographyProps {
  useAudio?: boolean;
}

export const InteractiveBiography: React.FC<InteractiveBiographyProps> = ({ useAudio = true }) => {
  const [activeTab, setActiveTab] = useState<'roots' | 'journey' | 'impact'>('roots');
  const containerRef = useRef<HTMLDivElement>(null);

  // Sound feedback system mimicking the main HUD components
  const playSfx = (freq: number) => {
    if (!useAudio) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Ignored if blocked
    }
  };

  const tabs = [
    { id: 'roots', label: 'EARLY LIFE & ROOTS', icon: MapPin },
    { id: 'journey', label: 'FILM JOURNEY', icon: Compass },
    { id: 'impact', label: 'MY FOCUS & PROJECTS', icon: Sparkles }
  ];

  return (
    <section 
      id="biography" 
      ref={containerRef}
      className="relative py-28 bg-[#040403] border-y border-white/5 overflow-hidden w-full"
    >
      {/* 1. LIQUID LIGHT BACKGROUND AURAS MATCHING HERO */}
      <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C8A261]/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-red-500/3 to-transparent blur-[140px] pointer-events-none" />
      
      {/* Floating background coordinate elements */}
      <div className="absolute top-12 right-[10%] font-mono text-[9px] text-white/5 tracking-[0.3em] uppercase select-none pointer-events-none hidden lg:block">
        SEC_03 // BIOGRAPHY // ACHOL AKHE
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Title / Narrative Lead Header block */}
        <div className="flex flex-col space-y-4 mb-20 text-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full w-fit relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C8A261]/10 via-transparent to-transparent animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-[#C8A261] animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-[10px] tracking-[0.25em] text-white/70 uppercase font-bold font-mono">BIOGRAPHY</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl text-white tracking-tight font-black uppercase max-w-3xl leading-none"
          >
            My Life & <br />
            <span className="bg-gradient-to-r from-[#D4B27A] via-white to-white/70 bg-clip-text text-transparent">
              Acting Journey
            </span>
          </motion.h2>
          <div className="w-24 h-[1px] bg-[#C8A261]/40" />
        </div>

        {/* Dynamic 2-column Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT PANEL: High Portrait & Dynamic Stats Cards Counterparts */}
          <div className="lg:col-span-5 space-y-8 flex flex-col items-center">
            
            {/* Red carpet styled beautiful double gold layout frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0.5 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[370px] aspect-[4/5] p-2 rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-[#C8A261]/20 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden group"
            >
              {/* Dynamic glare shine sweep sheen effect */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-br from-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
              
              <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#090908]">
                
                {/* Real interactive image filter backing */}
                <div className="absolute inset-0 bg-[#000]/25 z-1 mix-blend-color" />
                <img 
                  src={cinemaBanner} 
                  alt="Achol Akhe Glamour Scene"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover origin-center transition-transform duration-[2.5s] ease-out group-hover:scale-108"
                />
                
                {/* Extreme dynamic elegant overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />

                {/* Substantive award label tag */}
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex items-center gap-3 bg-[rgba(10,10,10,0.85)] border border-white/10 p-3.5 rounded-2xl backdrop-blur-md shadow-2xl"
                  >
                    <div className="p-2 bg-[#C8A261]/10 rounded-xl text-[#C8A261]">
                      <Award className="w-5 h-5 text-[#C8A261] animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-widest text-[#E6D5B8]/80 uppercase block font-mono">LEADING ACTRESS</span>
                      <span className="text-xs font-serif font-bold text-white uppercase tracking-wide">POPULAR DHALLYWOOD STAR</span>
                    </div>
                  </motion.div>
                </div>

                {/* High fashion aesthetic boundary boxes */}
                <div className="absolute inset-4 border border-white/5 pointer-events-none rounded-xl" />
                <div className="absolute inset-5 border border-[#C8A261]/25 pointer-events-none rounded-xl" />
              </div>
            </motion.div>

            {/* Quick stats mini-cards group */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-[370px]">
              
              <div className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="p-2 rounded-xl bg-[#C8A261]/10 text-[#C8A261]">
                    <Clock className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-xs text-white/50 uppercase">ACTIVE YEARS</span>
                </div>
                <p className="text-xs font-medium text-white/80 font-sans tracking-wide">Dhallywood Career</p>
                <p className="text-sm font-serif text-white font-bold tracking-wide mt-1">2011 — Present</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-white/10 backdrop-blur-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="p-2 rounded-xl bg-red-400/10 text-red-400">
                    <Heart className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-xs text-white/50 uppercase">STYLE</span>
                </div>
                <p className="text-xs font-medium text-white/80 font-sans tracking-wide">Performance Focus</p>
                <p className="text-sm font-serif text-white font-bold tracking-wide mt-1">Elegant & Versatile</p>
              </div>

            </div>

          </div>

          {/* RIGHT PANEL: Highly Animated Interactive Narrative Story Panels */}
          <div className="lg:col-span-7 space-y-8 w-full flex flex-col justify-start">
            
            {/* Interactive Tab Switcher resemble premium WebGL layouts */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 relative z-20">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      playSfx(isActive ? 350 : 440);
                    }}
                    className="group relative flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 focus:outline-none"
                  >
                    {/* Active solid highlight pill */}
                    {isActive ? (
                      <motion.div 
                        layoutId="activeTabPill"
                        className="absolute inset-0 bg-[#C8A261]/10 border border-[#C8A261]/35 rounded-xl z-0"
                        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/2 opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300 z-0" />
                    )}
                    
                    <TabIcon className={`w-4 h-4 z-10 transition-colors ${isActive ? 'text-[#D4B27A]' : 'text-white/50 group-hover:text-white'}`} />
                    <span className={`text-[10px] sm:text-[11px] font-mono tracking-[0.2em] font-bold z-10 transition-all ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content Display Window with stagger transitions */}
            <div className="min-h-[290px] relative">
              <AnimatePresence mode="wait">
                {activeTab === 'roots' && (
                  <motion.div
                    key="roots"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-6 text-left"
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[#C8A261] uppercase block">MY BACKGROUND</span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
                        Growing Up in Khulna
                      </h3>
                    </div>

                    <div className="text-white/70 text-sm sm:text-base leading-relaxed space-y-4 font-light font-sans">
                      <p>
                        Achol Akhe was born in <strong className="text-white font-medium">Khulna, Bangladesh</strong>. She loved acting and dancing from a young age. To follow her passion, she joined the <strong className="text-white font-semibold">Bulbul Lalitakala Academy (BAFA)</strong>, where she trained in classical and modern dance.
                      </p>
                      <p>
                        She graduated from Stamford University, Bangladesh. Achol began her career in modeling and starred in popular TV commercials for top brands, quickly winning fans nationwide.
                      </p>
                    </div>

                    {/* Meta stats tags */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          KHL
                        </div>
                        <div>
                          <span className="block font-mono text-xs tracking-wider text-white/50 uppercase">PLACE OF BIRTH</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">Khulna, Bangladesh</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          BAF
                        </div>
                        <div>
                          <span className="block font-mono text-xs tracking-wider text-white/50 uppercase">ARTS EDUCATION</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">Bulbul Lalitakala Academy</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'journey' && (
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-6 text-left"
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[#C8A261] uppercase block">FILM CAREER</span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
                        Breakout and Success
                      </h3>
                    </div>

                    <div className="text-white/70 text-sm sm:text-base leading-relaxed space-y-4 font-light font-sans">
                      <p>
                        Achol started acting in movies in 2011. With her natural charm and dedication, she quickly went from a popular model to one of the most successful actresses in Bangladesh cinema.
                      </p>
                      <p>
                        She starred in many hit films such as <strong className="text-[#C8A261]">Jotil Prem</strong>, <strong className="text-white">Prem Prem Paglami</strong>, and <strong className="text-white">Kistimaat</strong>. These movies were loved by audiences and established her as a leading star of the decade.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          JTP
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] tracking-wider text-white/40 uppercase">BREAKOUT FILM</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">Jotil Prem (2013 Success)</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          SLB
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] tracking-wider text-white/40 uppercase">NOTABLE MOVIE</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">Sultana Bibiana</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'impact' && (
                  <motion.div
                    key="impact"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="space-y-6 text-left"
                  >
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] tracking-[0.3em] text-[#C8A261] uppercase block">MY FOCUS & PROJECTS</span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
                        Connecting with Audiences
                      </h3>
                    </div>

                    <div className="text-white/70 text-sm sm:text-base leading-relaxed space-y-4 font-light font-sans">
                      <p>
                        Achol is known for bringing real emotion to her characters, creating a strong connection with her fans. She represents Bangladeshi cinema with grace and has won several awards for her work.
                      </p>
                      <p>
                        Today, she continues to act in movies, popular web series, and music videos. She is also passionate about supporting new artists and working on meaningful creative projects.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          VIP
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] tracking-wider text-white/40 uppercase">MEMBERSHIP</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">Dhallywood Film Guild</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="p-2.5 bg-white/5 rounded-xl text-white/40 font-mono text-center min-w-[36px] font-bold leading-none">
                          CON
                        </div>
                        <div>
                          <span className="block font-mono text-[9px] tracking-wider text-white/40 uppercase">FANBASE IMPRESSIONS</span>
                          <span className="text-xs sm:text-sm font-bold text-white/95">12 Million+ Followers</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Verified Celebrity Register Indexes with hover styles */}
            <div className="pt-6 border-t border-white/5 space-y-3.5">
              <span className="text-[10px] tracking-[0.25em] text-[#E6D5B8]/80 uppercase font-bold font-mono block text-left">
                Online Profiles & Database Records
              </span>
              
              <div className="flex flex-wrap gap-2.5 justify-start">
                <a 
                  href="https://www.imdb.com/name/nm6355498/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-400/5 hover:bg-yellow-400/15 border border-yellow-400/10 hover:border-yellow-400/30 rounded-xl text-[11px] text-yellow-500 font-mono font-bold hover:scale-[1.03] active:scale-95 transition-all text-center"
                >
                  <span>IMDb PRO</span>
                  <span className="text-[9px] opacity-60 font-semibold">(nm6355498)</span>
                  <ExternalLink className="w-3" />
                </a>

                <a 
                  href="https://en.wikipedia.org/wiki/Achol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-400/5 hover:bg-blue-400/15 border border-blue-400/10 hover:border-blue-400/30 rounded-xl text-[11px] text-blue-400 font-serif font-bold hover:scale-[1.03] active:scale-95 transition-all text-center"
                >
                  <span>WIKIPEDIA</span>
                  <ExternalLink className="w-3" />
                </a>

                <a 
                  href="https://www.wikidata.org/wiki/Q15894778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-400/5 hover:bg-red-400/15 border border-red-400/10 hover:border-red-400/30 rounded-xl text-[11px] text-red-400 font-mono font-bold hover:scale-[1.03] active:scale-95 transition-all text-center"
                >
                  <span>WIKIDATA</span>
                  <span className="text-[9px] opacity-60 font-semibold">(Q15894778)</span>
                  <ExternalLink className="w-3" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
