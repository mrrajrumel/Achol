/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Film, 
  Award, 
  Calendar, 
  Mail, 
  User, 
  X, 
  Play, 
  ChevronRight, 
  Menu, 
  ArrowUpRight, 
  Sparkles, 
  Star, 
  Send,
  Linkedin,
  MapPin,
  Clock,
  ExternalLink,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Check,
  CheckCircle2,
  Database,
  Instagram,
  Heart,
  MessageSquare
} from 'lucide-react';
import { TiltCard } from './components/TiltCard';
import { SmoothTextTransition } from './components/SmoothTextTransition';
import { InfinityPosterWall } from './components/InfinityPosterWall';
import { SmoothScroll } from './components/SmoothScroll';
import { CinematicHeroSlider } from './components/CinematicHeroSlider';
import { FullScreenNavigation } from './components/FullScreenNavigation';
import { InteractiveBiography } from './components/InteractiveBiography';
import { InteractiveFilmography } from './components/InteractiveFilmography';
import { InteractiveShowreel } from './components/InteractiveShowreel';
import { filmographyProjects, timelineAwards, showreelVideos, instagramPosts } from './data';
import { ProjectCategory, FilmProject, BookingSubmission } from './types';

// Let's import the stunning generated assets directly using relative paths
import heroPortrait from './assets/images/achol_hero_portrait_1781897501640.jpg';
import cinemaBanner from './assets/images/achol_cinema_banner_1781897521656.jpg';

export default function App() {
  // Booking Form Submission states
  const [bookingForm, setBookingForm] = useState<BookingSubmission>({
    name: '',
    company: '',
    email: '',
    projectType: 'Feature Film',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll active section highlighting & top back button
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle clicks on internal anchor links to work seamlessly with SmoothScroll
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const navOffset = 70;
            const targetTop = window.scrollY + targetElement.getBoundingClientRect().top - navOffset;
            window.scrollTo({
              top: Math.max(0, targetTop),
              behavior: 'smooth'
            });
          }
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Live Instagram feed state
  const [posts, setPosts] = useState(instagramPosts);
  const [isLiveFeed, setIsLiveFeed] = useState(false);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        const res = await fetch('/instagram_data.json');
        if (res.ok) {
          const result = await res.json();
          const postsList = Array.isArray(result) ? result : result?.data;
          if (Array.isArray(postsList) && postsList.length > 0) {
            setPosts(postsList);
            setIsLiveFeed(true);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live Instagram feed, using beautiful static fallback posts.', err);
      }
    };
    fetchInstagramFeed();
  }, []);

  // Live Instagram Feed Custom Manager States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState({
    imageUrl: '',
    caption: '',
    likes: '20K',
    comments: 150,
    postUrl: 'https://www.instagram.com/achol_akhee'
  });
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = adminPasscode.trim().toLowerCase();
    if (cleanCode === 'achol' || cleanCode === 'achol123' || cleanCode === 'admin') {
      setIsAdminUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Invalid passcode! / সঠিক পাসকোড দিন (Hint: achol123)');
    }
  };

  const handleSaveToServer = async (currentPosts: typeof posts) => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: currentPosts })
      });
      if (res.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.imageUrl) return;

    let updated: typeof posts;
    if (editingPostId) {
      updated = posts.map(p => p.id === editingPostId ? { ...p, ...postForm } : p);
      setEditingPostId(null);
    } else {
      const newPost = {
        id: `custom-${Date.now()}`,
        ...postForm
      };
      updated = [newPost, ...posts];
    }

    setPosts(updated);
    setPostForm({
      imageUrl: '',
      caption: '',
      likes: `${((Math.random() * 15) + 10).toFixed(1)}K`,
      comments: Math.floor(Math.random() * 200) + 80,
      postUrl: 'https://www.instagram.com/achol_akhee'
    });
  };

  const handleDeletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
  };

  const handleResetToDefault = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে পূর্বের গ্যালারি ফিরিয়ে আনতে চান? (Are you sure you want to restore the 8 default curated photos?)')) {
      setPosts(instagramPosts);
      await handleSaveToServer(instagramPosts);
    }
  };

  const handleLoadEdit = (post: any) => {
    setEditingPostId(post.id);
    setPostForm({
      imageUrl: post.imageUrl,
      caption: post.caption,
      likes: post.likes,
      comments: post.comments,
      postUrl: post.postUrl
    });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const emailTo = 'rajrum3l@gmail.com';
    const emailSubject = `Achol Akhe Collaboration Proposal: ${bookingForm.projectType} (${bookingForm.company})`;
    const emailBody = `Hi Achol Akhe and PR Team,\n\nI would love to invite Achol Akhe for a professional collaboration placement.\n\n` +
      `Here are our project specification details:\n` +
      `-----------------------------------------------------\n` +
      `• Representative Name: ${bookingForm.name}\n` +
      `• Brand / Production House: ${bookingForm.company}\n` +
      `• Professional Contact Email: ${bookingForm.email}\n` +
      `• Project Frame Type: ${bookingForm.projectType}\n\n` +
      `• Collaboration Overview:\n${bookingForm.message}\n` +
      `-----------------------------------------------------\n\n` +
      `Thank you so much! Looking forward to discussing details.\n\nBest regards,\n${bookingForm.name}`;

    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setLastMailtoUrl(mailtoUrl);

    // Simulate secure network transaction delay then launch mail client
    setTimeout(() => {
      window.location.href = mailtoUrl;

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setBookingForm({
        name: '',
        company: '',
        email: '',
        projectType: 'Feature Film',
        message: ''
      });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 7000);
    }, 1200);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-obsidian text-alabaster font-sans selection:bg-champagne selection:text-obsidian overflow-x-hidden antialiased">
      
      {/* 1. STUNNING FULL SCREEN CIRCULAR REVEAL NAVIGATION */}
      <FullScreenNavigation />


      {/* 2. HERO SECTION COMPASS WRAP */}
      <SmoothScroll>
      <div id="hero" className="w-full relative">
        <CinematicHeroSlider onExploreFilmography={() => {
          const targetElement = document.getElementById('filmography');
          if (targetElement) {
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
          }
        }} />
      </div>


      {/* 3. BIOGRAPHY SECTION */}
      <InteractiveBiography />


      {/* 4. FILMOGRAPHY SECTION */}
      <InteractiveFilmography />

      {/* 4.5 CINEMATIC INFINITY POSTER WALL */}
      <InfinityPosterWall />

      {/* 5. MEDIA & VIDEO SHOWREEL (STUNNING THEATER LOOK) */}
      <InteractiveShowreel />


      {/* 6. RECOGNITION & AWARDS TIMELINE */}
      <section id="recognition" className="relative py-24 bg-obsidian overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs text-champagne font-semibold tracking-[0.3em] uppercase">My Awards</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight font-semibold mt-2">
              Career Timeline & Awards
            </h2>
            <div className="w-20 h-1 bg-champagne mx-auto mt-3" />
            <p className="text-sm sm:text-base text-alabaster/90 font-normal leading-relaxed mt-4">
              Explore Achol’s awards and honors celebrating more than ten years of dedication to the film industry.
            </p>
          </div>

          {/* Timeline Elements */}
          <div className="relative max-w-4xl mx-auto pl-6 sm:pl-0">
            {/* Center line (Desktop) or Left Line (Mobile) */}
            <div className="absolute top-0 bottom-0 left-0 sm:left-1/2 w-px bg-gradient-to-b from-champagne/50 via-champagne/10 to-transparent transform sm:-translate-x-1/2" />

            {timelineAwards.map((item, id) => (
              <motion.div 
                key={id}
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: id * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 sm:mb-16 ${
                  id % 2 === 0 ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Node Dot */}
                <div className="absolute left-0 sm:left-1/2 w-4 h-4 rounded-full bg-champagne border-4 border-obsidian transform -translate-x-[7.5px] sm:-translate-x-2 z-10 shadow-lg shadow-champagne/40" />

                {/* Empty block to fill opposite column on desktop */}
                <div className="hidden sm:block w-[45%]" />

                {/* Content Box */}
                <div className="w-full sm:w-[45%] text-left">
                  <div className="bg-[#121212]/50 border border-white/5 hover:border-champagne/20 backdrop-blur-md p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                    <span className="font-mono text-xs text-champagne font-bold tracking-widest">{item.year}</span>
                    <h3 className="font-serif text-lg sm:text-xl text-white font-medium mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-champagne-light/80 italic mt-0.5">
                      {item.organization}
                    </p>
                    <p className="text-xs sm:text-sm text-alabaster/60 font-light mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* 6.5 AESTHETIC INSTAGRAM CANVAS (Live-Synced Feed) */}
      <section id="gallery" className="relative py-24 bg-gradient-to-b from-obsidian to-[#0a0a09] border-y border-white/5 overflow-hidden">
        {/* Soft background glow & luxury radial mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#D4B27A]/3 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-champagne/2 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 font-sans">
          
          <div className="max-w-3xl mx-auto text-center mb-16 px-4">
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/15 border border-[#C8A261]/40 mb-3 select-none cursor-pointer hover:bg-champagne/20 transition-colors"
              onDoubleClick={() => setIsAdminOpen(true)}
              title="Double click to manage feed"
            >
              <Instagram className="w-3.5 h-3.5 text-champagne" />
              <span className="text-[10px] text-champagne uppercase font-mono tracking-[0.2em] font-bold flex items-center gap-1.5">
                {isLiveFeed && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />}
                {isLiveFeed ? "Live Synced Feed" : "Social Showcase"}
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight font-semibold mt-1">
              Inside Achol Akhe's World
            </h2>
            <div className="w-24 h-[1px] bg-[#C8A261] mx-auto mt-4" />
            <p className="text-sm sm:text-base text-alabaster/90 font-normal leading-relaxed mt-4 max-w-xl mx-auto">
              Explore behind-the-scenes moments, photo shoots, and daily updates straight from her official Instagram feed: <a href="https://www.instagram.com/achol_akhee" target="_blank" rel="noopener noreferrer" className="text-[#D4B27A] font-bold hover:underline" aria-label="Achol Akhe Instagram profile (opens in a new tab)">@achol_akhee</a>
            </p>
          </div>

          {/* GALLERY CONTENT AREA: INFINITE LUXURY AUTO-SCROLL MARQUEE */}
          <div className="overflow-hidden w-full py-4 relative">
            {/* Soft gold vignette edges to fade the scrolling items luxuriously */}
            <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-obsidian to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-obsidian to-transparent z-10 pointer-events-none" />

            <div className="flex w-full overflow-hidden">
              <div className="animate-marquee">
                {/* Track 1 */}
                <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
                  {posts.map((post) => (
                    <motion.a
                      key={`track1-${post.id}`}
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative w-60 sm:w-72 aspect-square flex-shrink-0 bg-[#0F0F0D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl block hover:border-[#C8A261]/40 transition-colors"
                    >
                      {/* Post Image */}
                      <img 
                        src={post.imageUrl} 
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Golden Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left" />

                      {/* Overlay Metadata */}
                      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none font-sans">
                        {/* Caption snippet */}
                        <p className="text-xs line-clamp-3 leading-relaxed text-alabaster/95 mb-3 font-sans font-normal">
                          {post.caption}
                        </p>

                        <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-2.5 text-champagne/90 font-sans">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-champagne fill-champagne/20" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-sans">
                            <MessageSquare className="w-3.5 h-3.5 text-champagne" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Top Instagram Corner Icon Badge */}
                      <span className="absolute top-3.5 right-3.5 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Instagram className="w-3.5 h-3.5 text-champagne-light" />
                      </span>
                    </motion.a>
                  ))}
                </div>

                {/* Track 2 (Identical duplicate for seamless endless loop) */}
                <div className="flex gap-4 sm:gap-6 pr-4 sm:pr-6">
                  {posts.map((post) => (
                    <motion.a
                      key={`track2-${post.id}`}
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative w-60 sm:w-72 aspect-square flex-shrink-0 bg-[#0F0F0D] border border-white/5 rounded-2xl overflow-hidden shadow-2xl block hover:border-[#C8A261]/40 transition-colors"
                    >
                      {/* Post Image */}
                      <img 
                        src={post.imageUrl} 
                        alt={post.caption}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Golden Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left" />

                      {/* Overlay Metadata */}
                      <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none font-sans">
                        {/* Caption snippet */}
                        <p className="text-xs line-clamp-3 leading-relaxed text-alabaster/95 mb-3 font-sans font-normal">
                          {post.caption}
                        </p>

                        <div className="flex items-center justify-between text-xs font-mono border-t border-white/10 pt-2.5 text-champagne/90 font-sans">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-champagne fill-champagne/20" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-sans">
                            <MessageSquare className="w-3.5 h-3.5 text-champagne" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>

                      {/* Top Instagram Corner Icon Badge */}
                      <span className="absolute top-3.5 right-3.5 p-2 bg-black/50 backdrop-blur-md rounded-full text-white border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Instagram className="w-3.5 h-3.5 text-champagne-light" />
                      </span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visit Instagram button */}
          <div className="text-center mt-12 px-4 flex justify-center items-center">
            <a 
              href="https://www.instagram.com/achol_akhee" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Follow @achol_akhee on Instagram (opens in a new tab)"
              className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-wider text-[#E6D5B8] border border-[#C8A261]/30 hover:border-[#C8A261] bg-champagne/5 hover:bg-[#D4B27A] hover:text-[#0A0A0A] px-7 py-3.5 rounded-full transition-all duration-300 scale-100 hover:scale-105 w-full sm:w-auto justify-center"
            >
              <Instagram className="w-4 h-4" /> Follow @achol_akhee on Instagram
            </a>
          </div>

          {/* LUXURIOUS INSTAGRAM FEED MANAGER MODAL */}
          <AnimatePresence>
            {isAdminOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-[#0D0D0B] border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl relative my-8"
                >
                  {/* Modal Header */}
                  <div className="border-b border-white/5 px-6 py-5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#D4B27A]/10 rounded-lg border border-[#D4B27A]/20">
                        <Instagram className="w-5 h-5 text-champagne" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-serif text-lg sm:text-xl text-white font-medium">ইনস্টাগ্রাম গ্যালারি প্যানেল (Feed Manager)</h3>
                        <p className="text-[11px] text-alabaster/40 font-mono mt-0.5">Control live-rendered social stream without API tokens</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setIsAdminOpen(false);
                        setIsAdminUnlocked(false);
                        setAdminPasscode('');
                        setPasscodeError('');
                      }}
                      className="p-2 hover:bg-white/5 rounded-full text-alabaster/50 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* UNLOCKED VIEW OR PASSWORD LOCK VIEW */}
                  {!isAdminUnlocked ? (
                    // LOCK SCREEN
                    <div className="px-6 py-16 text-center max-w-md mx-auto flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-[#D4B27A]/10 rounded-full border border-[#D4B27A]/20 flex items-center justify-center mb-6">
                        <Database className="w-6 h-6 text-champagne animate-pulse" />
                      </div>
                      <h4 className="font-serif text-xl text-white mb-2">সুরক্ষিত সংযোগ (Admin Verification Required)</h4>
                      <p className="text-xs text-alabaster/50 mb-6 leading-relaxed">
                        To add, edit or delete Instagram photos on the website, please enter the administrator passcode.
                      </p>
                      
                      <form onSubmit={handleUnlockAdmin} className="w-full space-y-4">
                        <div className="text-left">
                          <label className="block text-[10px] font-mono text-champagne uppercase tracking-wider mb-2">Admin Passcode / পাসকোড</label>
                          <input 
                            type="password"
                            placeholder="Hint: achol123"
                            value={adminPasscode}
                            onChange={(e) => setAdminPasscode(e.target.value)}
                            className="w-full bg-[#121210] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4B27A] transition-colors"
                            autoFocus
                          />
                          {passcodeError && (
                            <p className="text-xs text-red-400 mt-2 font-light">{passcodeError}</p>
                          )}
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#D4B27A] to-[#C8A261] text-obsidian text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-opacity font-sans"
                        >
                          Verify & Unlock / আনলক করুন
                        </button>
                      </form>
                    </div>
                  ) : (
                    // FULL MANAGER INTERACTIVE CANVAS
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                      {/* Left Side: Create / Edit Form */}
                      <div className="lg:col-span-5 bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col text-left">
                        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                          <Plus className="w-4 h-4 text-champagne" />
                          <h4 className="font-serif text-sm text-white uppercase tracking-wider">
                            {editingPostId ? "পোস্ট সম্পাদনা করুন (Edit Post)" : "নতুন পোস্ট যোগ করুন (Add New Post)"}
                          </h4>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4 flex-grow">
                          <div>
                            <label className="block text-[10px] text-champagne uppercase font-mono mb-1.5">Image URL / ছবির লিঙ্ক</label>
                            <input 
                              type="url"
                              placeholder="https://images.unsplash.com/photo-..."
                              required
                              value={postForm.imageUrl}
                              onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                              className="w-full bg-[#121210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4B27A] transition-colors"
                            />
                            <p className="text-[9px] text-alabaster/30 mt-1 font-mono">Tip: You can use any high-quality image URL from the web</p>
                          </div>

                          <div>
                            <label className="block text-[10px] text-champagne uppercase font-mono mb-1.5">Instagram Post URL / ইনস্টাগ্রাম লিঙ্ক</label>
                            <input 
                              type="url"
                              placeholder="https://www.instagram.com/p/..."
                              value={postForm.postUrl}
                              onChange={(e) => setPostForm({ ...postForm, postUrl: e.target.value })}
                              className="w-full bg-[#121210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4B27A] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-champagne uppercase font-mono mb-1.5">Caption / ক্যাপশন</label>
                            <textarea 
                              placeholder="Write a beautiful description... ✨"
                              rows={3}
                              value={postForm.caption}
                              onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                              className="w-full bg-[#121210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4B27A] transition-colors resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] text-champagne uppercase font-mono mb-1.5">Likes Count / লাইক</label>
                              <input 
                                type="text"
                                placeholder="e.g., 25.4K"
                                value={postForm.likes}
                                onChange={(e) => setPostForm({ ...postForm, likes: e.target.value })}
                                className="w-full bg-[#121210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4B27A] transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-champagne uppercase font-mono mb-1.5">Comments / কমেন্ট</label>
                              <input 
                                type="number"
                                placeholder="e.g., 180"
                                value={postForm.comments}
                                onChange={(e) => setPostForm({ ...postForm, comments: parseInt(e.target.value) || 0 })}
                                className="w-full bg-[#121210] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4B27A] transition-colors"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-white/5">
                            <button
                              type="submit"
                              className="flex-1 bg-champagne text-obsidian text-xs font-bold py-3 rounded-xl hover:bg-champagne-light transition-colors cursor-pointer"
                            >
                              {editingPostId ? "আপডেট করুন (Update)" : "যোগ করুন (Add to Feed)"}
                            </button>
                            {editingPostId && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPostId(null);
                                  setPostForm({
                                    imageUrl: '',
                                    caption: '',
                                    likes: '20K',
                                    comments: 150,
                                    postUrl: 'https://www.instagram.com/achol_akhee'
                                  });
                                }}
                                className="px-4 bg-white/5 text-white hover:bg-white/10 text-xs py-3 rounded-xl transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </form>
                      </div>

                      {/* Right Side: Active Feed Preview List & Global Actions */}
                      <div className="lg:col-span-7 flex flex-col text-left">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                          <h4 className="font-serif text-sm text-white uppercase tracking-wider flex items-center gap-2">
                            <span>বর্তমান লাইভ ফিড তালিকা ({posts.length} টি পোস্ট)</span>
                          </h4>
                          <button
                            onClick={handleResetToDefault}
                            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                            title="Reset to original default curated items"
                          >
                            <RefreshCw className="w-3 h-3" /> মূল ডিজাইন রিসেট (Reset Defaults)
                          </button>
                        </div>

                        {/* List Area */}
                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-white/10">
                          {posts.map((post, idx) => (
                            <div 
                              key={post.id || idx} 
                              className="flex items-center justify-between p-3 bg-[#121210] border border-white/5 rounded-xl hover:border-white/10 transition-all gap-4"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img 
                                  src={post.imageUrl} 
                                  alt="Preview" 
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10 flex-shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs text-white line-clamp-1 font-medium">{post.caption || "No Caption"}</p>
                                  <div className="flex items-center gap-2 text-[10px] text-alabaster/40 font-mono mt-0.5">
                                    <span>❤️ {post.likes}</span>
                                    <span>💬 {post.comments} comments</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <button
                                  onClick={() => handleLoadEdit(post)}
                                  className="p-2 hover:bg-white/5 rounded-lg text-champagne hover:text-white transition-colors cursor-pointer"
                                  title="Edit Post"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post.id)}
                                  className="p-2 hover:bg-white/5 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Global Actions Area */}
                        <div className="border-t border-white/5 pt-5 mt-4 space-y-3 bg-black/20 p-4 rounded-xl">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-alabaster/40 font-mono">Status: Manual Mode active</span>
                            {saveStatus === 'saving' && <span className="text-[10px] text-champagne font-mono animate-pulse">Saving changes...</span>}
                            {saveStatus === 'success' && <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">✓ Saved successfully on server!</span>}
                            {saveStatus === 'error' && <span className="text-[10px] text-red-400 font-mono">Error saving files!</span>}
                          </div>

                          <button
                            onClick={() => handleSaveToServer(posts)}
                            disabled={saveStatus === 'saving'}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer"
                          >
                            {saveStatus === 'saving' ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Saving To Server...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                সকল পরিবর্তন লাইভ করুন (Save All Changes to Server)
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </section>



      {/* 7. PROFESSIONAL BOOKING ENGINE (Form) */}
      <section id="bookings" className="relative py-24 bg-obsidian-light border-t border-white/5 overflow-hidden">
        
        {/* Soft background gold fluid effect */}
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-champagne/2 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Booking Text Information */}
            <div className="lg:col-span-5 text-left flex flex-col space-y-6">
              <div className="flex flex-col space-y-2">
                <span className="text-xs text-champagne font-semibold tracking-[0.3em] uppercase">Industry Collaborations</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight font-semibold">
                  Secure Professional Bookings
                </h2>
                <div className="w-20 h-1 bg-champagne mt-2" />
              </div>

              <p className="text-sm sm:text-base text-alabaster/90 font-normal leading-relaxed">
                Connect directly with Achol Akhe’s team for film roles, commercial brand deals, music videos, and special media appearances.
              </p>

              <div className="space-y-4 pt-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-xs text-[#D4B27A] uppercase tracking-wider font-semibold">PR &amp; Booking Division</p>
                    <p className="text-white font-medium">bookings@acholakhe.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-xs text-[#D4B27A] uppercase tracking-wider font-semibold">Direct Placement</p>
                    <p className="text-white font-medium">Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-champagne" />
                  <div>
                    <p className="text-xs text-[#D4B27A] uppercase tracking-wider font-semibold">Turnaround Period</p>
                    <p className="text-white font-medium">Response within 48 Business Hours</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-xs text-champagne/80 font-mono">
                * Available for feature films, web series, runway shows, TV commercials, and luxury brand partnerships.
              </div>
            </div>

            {/* Premium Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#121212]/30 border border-white/5 backdrop-blur-luxury p-8 rounded-2xl relative">
                
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="booking-form"
                      onSubmit={handleBookingSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-left"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="name" className="text-xs uppercase tracking-widest text-[#E6D5B8]/80 font-medium">Full Name</label>
                          <input 
                            type="text" 
                            id="name"
                            name="name"
                            required
                            placeholder="e.g. Rumel Ahmed"
                            value={bookingForm.name}
                            onChange={handleInputChange}
                            className="bg-obsidian/70 border border-white/10 hover:border-white/20 focus:border-champagne focus:ring-1 focus:ring-champagne outline-none text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 placeholder:text-white/20"
                          />
                        </div>

                        {/* Company / Production */}
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="company" className="text-xs uppercase tracking-widest text-[#E6D5B8]/80 font-medium">Production / Brand House</label>
                          <input 
                            type="text" 
                            id="company" 
                            name="company"
                            required
                            placeholder="e.g. Tune Soul Ocean"
                            value={bookingForm.company}
                            onChange={handleInputChange}
                            className="bg-obsidian/70 border border-white/10 hover:border-white/20 focus:border-champagne focus:ring-1 focus:ring-champagne outline-none text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 placeholder:text-white/20"
                          />
                        </div>
                      </div>

                      {/* Email and Project Type */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label htmlFor="email" className="text-xs uppercase tracking-widest text-[#E6D5B8]/80 font-medium">Professional Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            name="email"
                            required
                            placeholder="rajglobaltalenthire.co.uk"
                            value={bookingForm.email}
                            onChange={handleInputChange}
                            className="bg-obsidian/70 border border-white/10 hover:border-white/20 focus:border-champagne focus:ring-1 focus:ring-champagne outline-none text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 placeholder:text-white/20"
                          />
                        </div>

                        <div className="flex flex-col space-y-2">
                          <label htmlFor="projectType" className="text-xs uppercase tracking-widest text-[#E6D5B8]/80 font-medium">Project Framework</label>
                          <select 
                            id="projectType" 
                            name="projectType"
                            value={bookingForm.projectType}
                            onChange={handleInputChange}
                            className="bg-obsidian/70 border border-white/10 hover:border-white/20 focus:border-champagne focus:ring-1 focus:ring-champagne outline-none text-white text-sm px-4 py-3 rounded-lg transition-all duration-300"
                          >
                            <option value="Feature Film" className="bg-[#121212] text-white">Mainstream Feature Film</option>
                            <option value="Web Series / OTT" className="bg-[#121212] text-white">Web Series / OTT Film</option>
                            <option value="Commercial Campaign" className="bg-[#121212] text-white">Commercial Fashion Campaign</option>
                            <option value="Brand Endorsement" className="bg-[#121212] text-white">Global Brand Ambassador Position</option>
                            <option value="Event Gala Guest" className="bg-[#121212] text-white">Luxury Event Guest-of-Honor</option>
                          </select>
                        </div>
                      </div>

                      {/* Message Brief */}
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="message" className="text-xs uppercase tracking-widest text-[#E6D5B8]/80 font-medium">Collaboration Brief</label>
                        <textarea 
                          id="message" 
                          name="message"
                          required
                          rows={4}
                          placeholder="Outline the budget allocation, timeline structures, target platform, and brief concept storyline..."
                          value={bookingForm.message}
                          onChange={handleInputChange}
                          className="bg-obsidian/70 border border-white/10 hover:border-white/20 focus:border-champagne focus:ring-1 focus:ring-champagne outline-none text-white text-sm px-4 py-3 rounded-lg transition-all duration-300 placeholder:text-white/20 resize-none"
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold bg-champagne hover:bg-champagne-light disabled:bg-champagne/40 disabled:cursor-not-allowed text-obsidian py-4 px-6 rounded-lg shadow-lg hover:shadow-champagne/15 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-obsidian" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Transmitting Proposal...
                          </div>
                        ) : (
                          <>
                            Submit Secured Proposal <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success-message"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-champagne/10 border border-champagne text-champagne rounded-full flex items-center justify-center">
                        <Star className="w-8 h-8 fill-champagne animate-pulse" />
                      </div>
                      <h3 className="font-serif text-2xl text-white font-medium">
                        Transmission Initiated
                      </h3>
                      <p className="text-sm text-alabaster/65 max-w-md mx-auto leading-relaxed">
                        We have prepared your proposal and automatically launched your default system mail application to securely dispatch details to <span className="text-champagne font-semibold font-mono">rajrum3l@gmail.com</span>.
                      </p>
                      <div className="bg-obsidian border border-white/5 p-4 rounded-xl space-y-3 max-w-sm mx-auto">
                        <p className="text-[11px] text-alabaster/50 leading-normal">
                          If your default mail browser/client did not automatically trigger, please click the secure link below to send manually:
                        </p>
                        <a 
                          href={lastMailtoUrl}
                          className="w-full inline-flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] font-bold bg-champagne hover:bg-champagne-light text-obsidian py-2.5 px-4 rounded-lg shadow-lg transition-all"
                        >
                          <Mail className="w-3.5 h-3.5" /> Dispatch Mail Manually
                        </a>
                      </div>
                      
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4 text-xs uppercase tracking-widest text-champagne/60 hover:text-white transition-colors underline underline-offset-4"
                      >
                        File another proposal
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 8. FOOTER */}
      <footer className="bg-obsidian border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-white/5">
            {/* Left Name */}
            <div className="text-center md:text-left">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-white font-medium">
                ACHOL AKHE
              </span>
              <p className="text-[10px] tracking-[0.3em] text-champagne uppercase font-sans mt-1">
                Dhallywood Contemporary Film Superstar
              </p>
            </div>

            {/* Center links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-wider text-alabaster/60 font-medium">
              <a href="#biography" className="hover:text-champagne transition-colors">Bio</a>
              <a href="#filmography" className="hover:text-champagne transition-colors">Filmography</a>
              <a href="#showreel" className="hover:text-champagne transition-colors">Showreel</a>
              <a href="#recognition" className="hover:text-champagne transition-colors">Recognition</a>
              <a href="#gallery" className="hover:text-champagne transition-colors">Gallery</a>
              <a href="#bookings" className="hover:text-champagne transition-colors">Bookings</a>
            </div>

            {/* Right Social SVG Links */}
            <div className="flex items-center space-x-3.5 flex-wrap justify-center sm:justify-end gap-y-2">
              <a 
                href="https://www.facebook.com/acholakhee0fficial/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-champagne hover:text-obsidian rounded-full text-champagne transition-all duration-300 border border-white/5 hover:border-champagne inline-flex items-center justify-center"
                aria-label="Facebook Profile"
                id="footer-facebook-link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/achol_akhee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-champagne hover:text-obsidian rounded-full text-champagne transition-all duration-300 border border-white/5 hover:border-champagne inline-flex items-center justify-center"
                aria-label="Instagram Profile"
                id="footer-instagram-link"
              >
                <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@acholakheofficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-champagne hover:text-obsidian rounded-full text-champagne transition-all duration-300 border border-white/5 hover:border-champagne inline-flex items-center justify-center"
                aria-label="TikTok Profile"
                id="footer-tiktok-link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.96.86 2.2 1.41 3.49 1.57.01 1.25.01 2.5-.01 3.75-.92-.09-1.84-.39-2.66-.86-.54-.34-1.01-.79-1.39-1.31v5.65c0 1.27-.32 2.53-.94 3.64-.62 1.11-1.54 1.99-2.64 2.55-1.12.57-2.39.85-3.66.8-1.28-.05-2.51-.49-3.53-1.25S4.85 18.06 4.41 16.9c-.44-1.16-.5-2.42-.18-3.62.33-1.2 1.05-2.26 2.05-2.99 1.01-.73 2.25-1.11 3.51-1.07.01 1.27.01 2.54.02 3.81-.66-.02-1.32.14-1.86.5-.54.36-.93.91-1.08 1.54-.15.63-.07 1.3.23 1.88.3.58.79 1.03 1.39 1.28.6.25 1.28.27 1.89.06.61-.21 1.12-.66 1.43-1.25.18-.39.27-.82.26-1.25V.02z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com/@achol_akhee" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-champagne hover:text-obsidian rounded-full text-champagne transition-all duration-300 border border-white/5 hover:border-champagne inline-flex items-center justify-center"
                aria-label="YouTube Channel"
                id="footer-youtube-link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.003 3.003 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.475 20.455 12 20.455 12 20.455s7.524 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-alabaster/60 font-mono">
            <p>© {new Date().getFullYear()} Achol Akhe. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-1.5">
              <span>Design &amp; Developer: <a href="https://facebook.com/mrrajrumel" target="_blank" rel="noopener noreferrer" className="text-champagne hover:underline transition-all">Rumel Ahmed</a></span>
              <span className="hidden sm:inline">•</span>
              <span className="text-[#D4B27A] font-medium">Dhallywood Cinema Star</span>
            </div>
          </div>

        </div>
      </footer>
      </SmoothScroll>

    </div>
  );
}
