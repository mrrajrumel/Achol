import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Film, Calendar, Star, Tag, Award, Heart, Sparkles, ChevronRight, X, Play, Clock, User, ListFilter, Activity } from 'lucide-react';
import { filmographyProjects } from '../data';
import { FilmProject, ProjectCategory } from '../types';
import { GlowCard } from './GlowCard';
import { GlowCardsGroup } from './GlowCardsGroup';

interface InteractiveFilmographyProps {
  useAudio?: boolean;
}

export const InteractiveFilmography: React.FC<InteractiveFilmographyProps> = ({ useAudio = true }) => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Sound triggering helper mimicking existing ones
  const triggerAudio = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine') => {
    if (!useAudio) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Ignored if blocked
    }
  };

  // Get list of categories and their corresponding project count
  const filterCategories = useMemo(() => {
    const list: { name: ProjectCategory; count: number }[] = [
      { name: 'All', count: filmographyProjects.length }
    ];
    
    const categories: ProjectCategory[] = ['Movies', 'Web Series', 'Music Videos', 'Other Projects'];
    categories.forEach(cat => {
      const count = filmographyProjects.filter(p => p.category === cat).length;
      list.push({ name: cat, count });
    });
    return list;
  }, []);

  // Soft filtering and matching of items
  const filteredProjects = useMemo(() => {
    return filmographyProjects.filter((project) => {
      const matchesCategory = activeFilter === 'All' || project.category === activeFilter;
      const matchesSearch = 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.year.toString().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  return (
    <section 
      id="filmography" 
      className="relative py-28 bg-[#040403] overflow-hidden"
    >
      {/* Dynamic ambient backdrops mirroring hero style */}
      <div className="absolute top-1/3 right-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#C8A261]/4 to-transparent blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-[-10%] w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-cyan-500/3 to-transparent blur-[130px] pointer-events-none" />

      {/* Floating coordinates watermark */}
      <div className="absolute right-12 bottom-12 font-mono text-[9px] text-white/5 tracking-[0.3em] uppercase select-none pointer-events-none hidden lg:block">
        GRID_INDEX // ALL_FILMS_ARCHIVE
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Dynamic Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-8 border-b border-white/5">
          <div className="flex flex-col space-y-3.5 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="w-2.5 h-2.5 bg-[#C8A261] rounded-full animate-ping" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#C8A261] uppercase font-bold">MY WORK</span>
            </motion.div>
            
            <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-tight font-black uppercase leading-none">
              Films & <span className="bg-gradient-to-r from-white via-[#D4B27A] to-white/75 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-white/40 text-xs sm:text-sm font-light max-w-lg">
              Explore my movies, web series, and music videos.
            </p>
          </div>

          {/* Luxury Search input within a glowing border */}
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C8A261]/15 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, role, year..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length % 3 === 0) triggerAudio(550, 'sine');
              }}
              className="w-full bg-[#10100E]/75 text-white border border-white/10 group-hover:border-[#C8A261]/40 focus:border-[#C8A261] rounded-xl px-4 py-3.5 pl-11 text-xs sm:text-sm shadow-2xl focus:outline-none transition-all placeholder:text-white/30"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-hover:text-[#C8A261] transition-colors" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  triggerAudio(300, 'sine');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white transition-colors"
                aria-label="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Category Pill Tabs with integrated counts */}
        <div className="flex flex-wrap items-center gap-2 mb-12 justify-start">
          {filterCategories.map((category) => {
            const isSelected = activeFilter === category.name;
            if (category.name !== 'All' && category.count === 0) return null; // Only show non-empty categories
            return (
              <button
                key={category.name}
                onClick={() => {
                  setActiveFilter(category.name);
                  triggerAudio(isSelected ? 380 : 420, 'triangle');
                }}
                className="group relative flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 focus:outline-none"
              >
                {/* Visual select backing */}
                {isSelected ? (
                  <motion.div 
                    layoutId="activeFilterPill"
                    className="absolute inset-0 bg-[#C8A261] border border-[#C8A261] shadow-[0_8px_20px_rgba(200,162,97,0.3)] rounded-xl z-0"
                    transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 border border-white/10 rounded-xl transition-all duration-300 z-0" />
                )}

                <span className={`text-[10px] sm:text-[11px] font-mono tracking-[0.2em] font-bold z-10 transition-all ${isSelected ? 'text-black' : 'text-white/50 group-hover:text-white'}`}>
                  {category.name}
                </span>

                <span 
                  className={`text-[8px] sm:text-[9px] font-mono font-bold px-2 py-0.5 rounded-full z-10 transition-colors ${
                    isSelected 
                      ? 'bg-black/15 text-black' 
                      : 'bg-white/5 text-white/40 group-hover:text-white/60'
                  }`}
                >
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filmography Dynamic Staggered Responsive Grid with Images */}
        <GlowCardsGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.8, 
                  delay: Math.min(idx * 0.05, 0.35), 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="h-full"
              >
                <GlowCard 
                  className="flex flex-col h-full bg-[#10100E]/50 rounded-2xl overflow-hidden group border border-white/5 hover:border-[#C8A261]/25 shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
                >
                  {/* Image Container with luxurious hover leak shimmer */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                    <div className="absolute inset-0 bg-[#C8A261]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-1 pointer-events-none mix-blend-color-dodge" />
                    
                    {/* YT Thumbnail via embedId logic added here */}
                    <img 
                      src={project.embedId ? `https://img.youtube.com/vi/${project.embedId}/hqdefault.jpg` : (project.imageUrl || undefined)} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.8s]"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // Prevent infinite fallback loop
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop'; // Dark fallback cinematic image
                      }}
                    />
                    
                    {/* Shadow falloff overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040403] via-black/20 to-transparent" />
                    
                    {/* Visual Year Badge */}
                    <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/10 text-[#C8A261] text-[10px] tracking-wider uppercase font-bold px-3 py-1 rounded-xl">
                      {project.year}
                    </span>
                  </div>

                  {/* Complete details content block */}
                  <div className="p-6 flex flex-col flex-grow text-left justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <span className="text-[10px] tracking-[0.2em] text-[#C8A261] uppercase font-bold font-mono">
                          {project.category}
                        </span>
                        <span className="text-[9px] bg-[#C8A261]/10 text-white/80 border border-[#C8A261]/20 font-bold px-2.5 py-0.5 rounded-full tracking-wider font-mono">
                          {project.role.replace(/ \((.*?)\)/, '')} {/* Clean representation */}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-white font-bold group-hover:text-[#D4B27A] transition-colors duration-400 leading-tight">
                        {project.title}
                      </h3>

                      <p className="text-[#C8A261]/80 text-xs font-serif italic mt-1.5">
                        {project.badge}
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </GlowCardsGroup>

        {/* Premium Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-white/5 gap-4">
            <div className="text-white/40 text-xs font-mono tracking-wider">
              SHOWING <span className="text-[#C8A261] font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="text-[#C8A261] font-bold">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> OF <span className="text-white font-bold">{filteredProjects.length}</span> REELS
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  triggerAudio(360, 'sine');
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#C8A261]/40 disabled:opacity-20 disabled:pointer-events-none text-white/85 hover:text-white transition-all text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>PREV</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isSelected = page === currentPage;
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      triggerAudio(350 + page * 20, 'triangle');
                    }}
                    className={`w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#C8A261] text-black border-[#C8A261] shadow-[0_4px_12px_rgba(200,162,97,0.25)]'
                        : 'bg-transparent text-white/50 border-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  triggerAudio(440, 'sine');
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:border-[#C8A261]/40 disabled:opacity-20 disabled:pointer-events-none text-white/85 hover:text-white transition-all text-xs font-mono font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <span>NEXT</span>
              </button>
            </div>
          </div>
        )}

        {/* Empty Search Prompt */}
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 px-6 border border-white/5 rounded-2xl bg-white/2 max-w-md mx-auto mt-12 space-y-4"
          >
            <Film className="w-10 h-10 text-white/20 mx-auto" />
            <h3 className="text-white font-serif text-lg font-bold">No Records Found</h3>
            <p className="text-white/40 text-xs font-sans font-light">
              We couldn't find any film matching "{searchQuery}" in this category. Try adjusting your category filter or search term.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
                triggerAudio(300, 'sine');
              }}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-white/20 text-white text-[11px] font-mono tracking-wider uppercase rounded-xl transition-all"
            >
              Reset Search Filter
            </button>
          </motion.div>
        )}

      </div>

    </section>
  );
};