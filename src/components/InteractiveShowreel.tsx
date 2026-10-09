import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Tv, Film } from 'lucide-react';
import { showreelVideos } from '../data';

interface InteractiveShowreelProps {
  useAudio?: boolean;
}

export const InteractiveShowreel: React.FC<InteractiveShowreelProps> = ({ useAudio = true }) => {
  const [isPlayingModal, setIsPlayingModal] = useState<string | null>(null);

  const triggerAudio = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine') => {
    if (!useAudio) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  return (
    <section id="showreel" className="relative py-24 bg-[#090908] border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#C8A261]/5 to-transparent blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Tv className="w-4 h-4 text-[#D4B27A]" />
            <span className="font-mono text-xs tracking-[0.25em] text-[#D4B27A] uppercase font-bold">VIDEOS &amp; TRAILERS</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight font-black uppercase">
            Featured Videos
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showreelVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => {
                setIsPlayingModal(video.embedId);
                triggerAudio(600, 'sine');
              }}
              className="group cursor-pointer bg-[#10100E]/40 border border-white/5 hover:border-[#C8A261]/30 rounded-2xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden bg-neutral-950">
                {/* YouTube Thumbnail logic here */}
                <img 
                  src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-4 rounded-full bg-black/80 text-[#C8A261] group-hover:bg-[#C8A261] group-hover:text-black border border-[#C8A261]/30 transition-all duration-300">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-3 right-3 bg-black/85 text-xs font-mono text-[#D4B27A] px-2 py-0.5 rounded border border-white/5 font-bold">
                  {video.duration} MIN
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between border-t border-white/5">
                <h3 className="font-serif text-lg text-white font-bold group-hover:text-[#D4B27A] transition-colors">{video.title}</h3>
                <p className="text-white/60 text-xs mt-2 line-clamp-2">{video.desc}</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5 text-xs font-mono text-white/50 uppercase tracking-wider">
                  <Film className="w-3.5 h-3.5 text-[#D4B27A]" />
                  <span>Tap to Play</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isPlayingModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
          >
            <div className="absolute inset-0" onClick={() => setIsPlayingModal(null)} />
            <motion.div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden w-full max-w-4xl aspect-video shadow-2xl">
              <button onClick={() => setIsPlayingModal(null)} className="absolute top-4 right-4 z-20 p-3 bg-black/80 rounded-full text-white hover:bg-white hover:text-black transition-all">
                <X className="w-4 h-4" />
              </button>
              <iframe 
                src={`https://www.youtube.com/embed/${isPlayingModal}?autoplay=1`}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};