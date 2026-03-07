"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, X, ChevronDown, ChevronRight
} from 'lucide-react';
import { useNewsContext } from '@/app/context/NewsContext';
import Image from 'next/image';

import { useActiveAds } from '@/app/hooks/useAds';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface SubMenuItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  key: string;
  submenu?: SubMenuItem[];
}



const LiveScoreButton: React.FC<{ API_BASE: string }> = ({ API_BASE }) => {
  const [hasLiveMatch, setHasLiveMatch] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/live/live-stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setHasLiveMatch(data && data.live && data.live.length > 0);
      } catch (err) { setHasLiveMatch(false); }
    };
    return () => eventSource.close();
  }, [API_BASE]);

  return (
    <Link
      href="/sports/live"
      className="bg-[#dc2626] text-white px-8 py-4 rounded-none text-[16px] font-bold uppercase tracking-tight hover:bg-[#b91c1c] shadow-md transition-all no-underline whitespace-nowrap flex items-center gap-2"
    >
      {hasLiveMatch && <span className="w-2 h-2 bg-white rounded-full animate-pulse" />}
      {hasLiveMatch ? 'LIVE' : 'Live Scores'}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const newsContext = useNewsContext();
  const { data: ads, loading: adsLoading } = useActiveAds();

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems] = useState(1);

  const headerAds = useMemo(() => {
    if (!ads) return [];
    return ads.filter(ad => ad.isActive && (ad.headerImageUrl || ad.placement === 'header'));
  }, [ads]);

  useEffect(() => {
    if (!headerAds || headerAds.length <= visibleItems || adsLoading || isPaused) return;

    const interval = setInterval(() => {
      setCurrentAdIndex(prev => {
        const next = prev + 1;
        return next >= headerAds.length ? 0 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [headerAds.length, adsLoading, isPaused, visibleItems]);

  const navItems = useMemo<NavItem[]>(() => [
    { label: "Home", href: "/", key: "home" },
    {
      label: "World",
      href: "/Pages/world",
      key: "world",
      submenu: [
        { label: "India", href: "/Pages/india" },
        { label: "Europe", href: "/Pages/world/europe" },
        { label: "USA", href: "/Pages/world/usa" },
        { label: "Africa", href: "/Pages/world/africa" },
        { label: "Asia", href: "/Pages/world/asia" },
        { label: "Middle East", href: "/Pages/world/middle-east" },
      ]
    },
    { label: "Sports", href: "/Pages/sports", key: "sports" },
    { label: "Business", href: "/Pages/business", key: "business" },
    {
      label: "Awards",
      href: "/Pages/awards",
      key: "awards",
      submenu: [
        { label: "India  Brand Icon", href: "https://indiabrandicon.in/" },
        { label: "International Healthcare Awards", href: "https://internationalhealthcareaward.com/" },
        { label: "International Education Awards", href: "https://internationaleducationaward.com/" },
        { label: "Icon Of The Year Awards", href: "https://iconoftheyearawards.com/" },
        { label: "Awards News", href: "/Pages/awards" },
      ]
    },
    { label: "Entertainment", href: "/Pages/entertainment", key: "entertainment" },
    { label: "Fashion", href: "/Pages/lifestyle", key: "lifestyle" },
  ], []);

  const PRIMARY_COUNT = 7;
  const primaryItems = navItems.slice(0, PRIMARY_COUNT);
  const moreItems = navItems.slice(PRIMARY_COUNT);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 40);
          setShowPill(window.scrollY > 200);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="w-full bg-white z-[1000] relative font-inter">
      {/* Scroll Pill Navigation */}
      <AnimatePresence>
        {showPill && (
          <motion.div
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 20, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-0 left-1/2 z-[1100] w-[95%] max-w-[1200px]"
          >
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-full px-4 md:px-10 py-1.5 md:py-2 flex items-center justify-between gap-4 md:gap-8">
              <Link href="/" className="flex items-center select-none shrink-0 relative" onClick={() => setShowPill(false)}>
                <div className="relative w-24 h-24 md:w-36 md:h-36 -my-6 md:-my-12">
                  <Image
                    src="/logo.png"
                    alt="Time Cyber Media"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 96px, (max-width: 1024px) 144px, 180px"
                  />
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-2 py-1 scroll-smooth">
                {navItems.map(item => (
                  <div
                    key={item.key}
                    className="relative group/pill"
                    onMouseEnter={() => item.submenu && setActiveDropdown(`pill-${item.key}`)}
                    onMouseLeave={() => item.submenu && setActiveDropdown(null)}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`px-4 py-1.5 text-[12px] md:text-[13px] font-bold uppercase tracking-tight transition-all whitespace-nowrap relative after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:bg-[#dc2626] after:transition-transform after:duration-300 ${isActive(item.href)
                          ? 'text-[#dc2626] after:scale-x-100'
                          : 'text-gray-600 hover:text-[#dc2626] after:scale-x-0 group-hover:after:scale-x-100'
                          } flex items-center gap-1`}
                        onClick={(e) => {
                          if (item.submenu && window.innerWidth < 1024) {
                            e.preventDefault();
                            setActiveDropdown(prev => prev === `pill-${item.key}` ? null : `pill-${item.key}`);
                          } else {
                            setShowPill(false);
                          }
                        }}
                      >
                        {item.label}
                        {item.submenu && <ChevronDown size={12} className="opacity-50" />}
                      </Link>
                    </div>

                    {item.submenu && activeDropdown === `pill-${item.key}` && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white shadow-2xl border border-gray-200 rounded-xl py-2 z-[2000]">
                        {item.submenu.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            className="block px-4 py-3 text-xs font-semibold text-black hover:bg-black hover:text-white transition-all border-l-4 border-transparent hover:border-black"
                            onClick={() => {
                              setShowPill(false);
                              setActiveDropdown(null);
                            }}
                            target={sub.href.startsWith('http') ? '_blank' : undefined}
                            rel={sub.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden md:block">
                  <LiveScoreButton API_BASE={(newsContext as any)?.API_BASE || "https://api.primetimemedia.in"} />
                </div>
                <button
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu size={24} className="text-black" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tier 0: Dynamic Ad Banner Carousel */}
      <div className="w-full bg-white flex justify-center py-2 border-b border-gray-200 px-1 md:px-8">
        <div
          className="w-full max-w-[1300px] aspect-[20/5] md:aspect-[120/10] bg-[#f7f7f8] relative overflow-hidden transition-all duration-300 border border-gray-200 rounded-lg shadow-sm"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {adsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 animate-pulse">
              Loading advertisements...
            </div>
          ) : headerAds.length > 0 ? (
            <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}>
              {headerAds.map((ad, idx) => (
                <a
                  key={ad._id || idx}
                  href={ad.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex-shrink-0 relative"
                >
                  <Image
                    src={ad.headerImageUrl || ad.imageUrl}
                    alt={ad.title || "Advertisement"}
                    fill
                    className="object-fill"
                    priority={idx === 0}
                    sizes="(max-width: 768px) 100vw, 1300px"
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-white overflow-hidden">
              <div className="whitespace-nowrap animate-marquee flex items-center gap-8">
                <span className="text-[#0f172a] font-black text-xl md:text-3xl tracking-[0.2em] uppercase">HEALTHCARE AWARDS 2026</span>
                <span className="text-[#0f172a] font-black text-xl md:text-3xl tracking-[0.2em] uppercase">HEALTHCARE AWARDS 2026</span>
                <span className="text-[#0f172a] font-black text-xl md:text-3xl tracking-[0.2em] uppercase">HEALTHCARE AWARDS 2026</span>
                <span className="text-[#0f172a] font-black text-xl md:text-3xl tracking-[0.2em] uppercase">HEALTHCARE AWARDS 2026</span>
              </div>
            </div>
          )}

          {headerAds.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {headerAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentAdIndex(idx)}
                  className={`w-2 h-2 rounded-full border-2 border-white transition-all duration-200 ${idx === currentAdIndex ? 'bg-black' : 'bg-white/80'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tier 1: Sponsorship & Contact Bar */}
      <div className="w-full h-[32px] bg-[#0f172a] border-b border-slate-800 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-[0.15em] overflow-hidden px-4">
        <div className="flex items-center gap-2 sm:gap-6 whitespace-nowrap overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse shadow-[0_0_8px_var(--primary)] shrink-0"></span>
            <span className="hidden sm:inline">CONTACT FOR ADVERTISEMENT & SPONSORSHIP:</span>
            <span className="sm:hidden text-slate-400">ADS & SPONSORSHIP:</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="tel:+919821020995" className="text-white hover:text-[var(--primary)] transition-all duration-300 flex items-center gap-1.5 group">
              <span className="text-slate-500 group-hover:text-[var(--primary)] transition-colors">📞</span>
              +91 98210 20995
            </a>
            <div className="w-px h-3 bg-slate-700"></div>
            <a href="tel:+919873094416" className="text-white hover:text-[var(--primary)] transition-all duration-300 flex items-center gap-1.5 group">
              <span className="text-slate-500 group-hover:text-[var(--primary)] transition-colors">📞</span>
              +91 98730 94416
            </a>
          </div>
        </div>
      </div>

      {/* Tier 2: Main Branding & Navigation (Sticky) */}
      <nav className={`w-full sticky top-0 bg-white text-black z-[1001] transition-all duration-500 border-b border-gray-200 ${scrolled ? 'shadow-md translate-y-0' : 'translate-y-0'} ${showPill ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-1.5 md:py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center select-none relative z-10">
              <div className="relative w-24 h-24 md:w-44 md:h-44 -my-7 md:-my-12">
                <Image
                  src="/logo.png"
                  alt="Time Cyber Media Logo"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 176px, 200px"
                />
              </div>
            </Link>

            {/* Live Score */}
            <div className="hidden lg:block ml-4">
              <LiveScoreButton API_BASE={(newsContext as any)?.API_BASE || "https://api.timecybermedia.com"} />
            </div>

            {/* Navigation */}
            <ul className="hidden lg:flex items-center gap-2 list-none m-0 p-0">
              {primaryItems.map(item => (
                <li
                  key={item.key}
                  className="relative group/item"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.key)}
                  onMouseLeave={() => item.submenu && setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-[14px] font-extrabold uppercase tracking-tight transition-all flex items-center gap-1 relative after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-[#dc2626] after:transition-transform after:duration-300 ${isActive(item.href)
                      ? 'text-[#dc2626] after:scale-x-100'
                      : 'text-black hover:text-[#dc2626] after:scale-x-0 group-hover/item:after:scale-x-100'
                      }`}
                  >
                    {item.label}
                    {item.submenu && <ChevronDown size={14} className="opacity-50" />}
                  </Link>

                  {item.submenu && activeDropdown === item.key && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white shadow-2xl border border-gray-200 rounded-2xl py-2 z-[2000]">
                      {item.submenu.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={sub.href}
                          className="block px-4 py-3 text-sm font-semibold text-black hover:bg-black hover:text-white border-l-4 border-transparent hover:border-black transition-all rounded-xl"
                          target={sub.href.startsWith('http') ? '_blank' : undefined}
                          rel={sub.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}

              {moreItems.length > 0 && (
                <li
                  className="relative group/more"
                  onMouseEnter={() => setActiveDropdown('__more__')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="w-10 h-10 flex items-center justify-center text-[22px] font-black text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
                    <span>Â»</span>
                  </button>

                  {activeDropdown === '__more__' && (
                    <div className="absolute top-full right-0 mt-1 w-56 bg-white shadow-2xl border border-gray-200 rounded-2xl py-2 z-[2000]">
                      {moreItems.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          className={`block px-4 py-3 text-sm font-semibold hover:bg-gray-900/10 rounded-xl transition-all ${isActive(item.href) ? 'text-black font-bold' : 'text-black/80'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              )}
            </ul>
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={24} className="text-black" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-[1100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={160} height={160} className="w-24 h-24 object-contain" />
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={26} className="text-black" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-full pb-32">
            <ul className="list-none p-0 m-0 flex flex-col gap-1">
              {navItems.map(item => (
                <li key={item.key}>
                  <div className="flex flex-col">
                    <Link
                      href={item.href}
                      className={`block p-4 font-bold rounded-xl transition-all text-black ${isActive(item.href) ? 'bg-[#dc2626] text-white shadow-lg' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        if (item.submenu) {
                          setActiveDropdown(prev => prev === `mobile-${item.key}` ? null : `mobile-${item.key}`);
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        {item.label}
                        {item.submenu && <ChevronRight size={18} className={`transition-transform duration-300 ${activeDropdown === `mobile-${item.key}` ? 'rotate-90 text-white' : 'text-gray-400'}`} />}
                      </div>
                    </Link>
                    {item.submenu && (
                      <motion.div
                        initial={false}
                        animate={{ height: activeDropdown === `mobile-${item.key}` ? 'auto' : 0, opacity: activeDropdown === `mobile-${item.key}` ? 1 : 0 }}
                        className="overflow-hidden pl-6 flex flex-col gap-1"
                      >
                        {item.submenu.map((sub, idx) => (
                          <Link
                            key={idx}
                            href={sub.href}
                            className={`p-3 text-sm font-semibold transition-colors duration-200 ${isActive(sub.href) ? 'text-[#dc2626]' : 'text-gray-600 hover:text-black border-l-2 border-gray-100 hover:border-[#dc2626]'}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header >
  );
};

export default Navbar;
