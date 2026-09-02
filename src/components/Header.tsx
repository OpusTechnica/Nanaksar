import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { ShoppingBag, Utensils, Menu as MenuIcon, X } from 'lucide-react';
import { $cart, $isCartOpen, $isReservationOpen, getCartSummary } from '../data/cartStore';
import { BRAND_INFO } from '../data/restaurantData';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cart = useStore($cart);
  const summary = getCartSummary();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleAstroSwap = () => {
      document.body.style.overflow = '';
      setMobileMenuOpen(false);
    };
    document.addEventListener('astro:before-swap', handleAstroSwap);
    return () => document.removeEventListener('astro:before-swap', handleAstroSwap);
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-40 transition-colors duration-200 border-b header-solid-obsidian ${
          scrolled
            ? 'bg-[#0F0F0F] py-2.5 sm:py-3 border-[#E4A834]/30'
            : 'bg-[#0F0F0F] py-3 sm:py-4 border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Typographic Lockup */}
          <a
            href="/"
            className="flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none focus:ring-1 focus:ring-[#E4A834] rounded-lg p-0.5 shrink-0"
          >
            <img
              src="/assets/Logo.png"
              alt="Nanaksar Dhaba Seal"
              className="h-10 w-10 sm:h-12 sm:w-12 md:h-13 md:w-13 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col justify-center">
              <img
                src="/assets/Brand_Name.png"
                alt="Nanaksar Dhaba"
                className="h-7 sm:h-9 md:h-10 lg:h-11 w-auto object-contain"
              />
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-display font-semibold tracking-widest text-[#E4A834] uppercase -mt-0.5">
                ESTD. {BRAND_INFO.established} • INDORE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-display text-xs xl:text-sm font-semibold tracking-wider uppercase">
            <a href="/" className="relative text-white/90 hover:text-[#E4A834] py-1 transition-colors group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D01B1B] transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/all-categories" className="relative text-white/90 hover:text-[#E4A834] py-1 transition-colors group">
              All Categories
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D01B1B] transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/story" className="relative text-white/90 hover:text-[#E4A834] py-1 transition-colors group">
              Our Story
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D01B1B] transition-all duration-200 group-hover:w-full"></span>
            </a>
            <a href="/outlets" className="relative text-white/90 hover:text-[#E4A834] py-1 transition-colors group">
              5 Outlets
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D01B1B] transition-all duration-200 group-hover:w-full"></span>
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Book Table Button */}
            <button
              onClick={() => $isReservationOpen.set(true)}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 border border-[#E4A834] text-[#E4A834] hover:bg-[#E4A834] hover:text-[#0F0F0F] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg font-display text-xs font-bold tracking-wider uppercase transition-colors min-h-[42px] focus:outline-none focus:ring-1 focus:ring-[#E4A834]"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Book Table</span>
            </button>

            {/* Takeaway Cart Button (Mobile Responsive 390px Protection) */}
            <button
              onClick={() => $isCartOpen.set(true)}
              type="button"
              className="relative flex items-center gap-1.5 bg-[#D01B1B] hover:bg-[#B81414] text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-display text-xs sm:text-sm font-bold tracking-wider uppercase transition min-h-[42px] focus:outline-none focus:ring-1 focus:ring-[#E4A834]"
              aria-label={`View Cart (${summary.itemCount} items)`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Order Online</span>
              {summary.itemCount > 0 && (
                <span className="bg-white text-[#D01B1B] text-[11px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {summary.itemCount}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-white hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-[#E4A834]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile / Tablet Solid Drawer (Zero Blur) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#0F0F0F] animate-fadeIn">
          <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0F0F0F]">
            <div className="flex items-center gap-3">
              <img src="/assets/Logo.png" alt="Logo" className="h-10 w-10 object-contain" />
              <img src="/assets/Brand_Name.png" alt="Nanaksar" className="h-8 w-auto object-contain" />
            </div>
            <button
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center gap-5 font-display text-xl font-bold uppercase tracking-wider bg-[#0F0F0F]">
            <a
              href="/"
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="text-white hover:text-[#E4A834] py-2 border-b border-white/5 transition"
            >
              Home
            </a>
            <a
              href="/all-categories"
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="text-white hover:text-[#E4A834] py-2 border-b border-white/5 transition"
            >
              Explore All Categories
            </a>
            <a
              href="/story"
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="text-white hover:text-[#E4A834] py-2 border-b border-white/5 transition"
            >
              Our Story
            </a>
            <a
              href="/outlets"
              onClick={() => {
                document.body.style.overflow = '';
                setMobileMenuOpen(false);
              }}
              className="text-white hover:text-[#E4A834] py-2 border-b border-white/5 transition"
            >
              Five Indore Outlets
            </a>

            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  document.body.style.overflow = '';
                  setMobileMenuOpen(false);
                  $isReservationOpen.set(true);
                }}
                className="w-full flex items-center justify-center gap-2 border border-[#E4A834] text-[#E4A834] py-3.5 rounded-xl font-display text-sm font-bold uppercase tracking-wider"
              >
                <Utensils className="w-4 h-4" />
                <span>Book a Family Table</span>
              </button>

              <button
                onClick={() => {
                  document.body.style.overflow = '';
                  setMobileMenuOpen(false);
                  $isCartOpen.set(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#D01B1B] text-white py-3.5 rounded-xl font-display text-sm font-bold uppercase tracking-wider"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Takeaway Order Cart ({summary.itemCount})</span>
              </button>
            </div>
          </div>

          <div className="p-5 border-t border-white/10 bg-[#141414] pb-safe text-center">
            <p className="text-xs text-white/70 italic font-editorial">"{BRAND_INFO.motto}"</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2 text-[10px] font-mono text-[#E4A834]">
              <span>Dewas Naka</span> • <span>Vijay Nagar</span> • <span>Geeta Bhawan</span> • <span>Bhawarkua</span> • <span>Sudama Nagar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
