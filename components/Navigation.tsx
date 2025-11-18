'use client'

import { useState } from 'react'

// Social media icons as SVG components
const SpotifyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="w-full px-4 md:px-8 py-4">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left - Links */}
          <div className="flex items-center gap-4">
            <a
              href="#tour"
              className="text-white font-bold hover:text-[#ff0000] transition-colors"
              style={{ fontSize: '14px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
            >
              TOUR
            </a>
            <a
              href="/newsletter"
              className="text-white font-bold hover:text-[#ff0000] transition-colors"
              style={{ fontSize: '14px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
            >
              NEWSLETTER
            </a>
            <a
              href="#store"
              className="text-white font-bold hover:text-[#ff0000] transition-colors"
              style={{ fontSize: '14px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
            >
              STORE
            </a>
          </div>

          {/* Center - Artist Name */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold"
            style={{ fontSize: '14px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
          >
            CA7RIEL & PACO AMOROSO
          </div>

          {/* Right - Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff0000] transition-colors"
              aria-label="Spotify"
            >
              <SpotifyIcon />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff0000] transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff0000] transition-colors"
              aria-label="YouTube"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff0000] transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff0000] transition-colors"
              aria-label="X"
            >
              <XIcon />
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          {/* Left - Artist Name */}
          <div
            className="text-white font-bold"
            style={{ fontSize: '12px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
          >
            CA7RIEL & PACO AMOROSO
          </div>

          {/* Right - Hamburger Menu */}
          <button
            onClick={toggleMenu}
            className="text-white p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col items-center justify-center gap-[5px] relative">
              <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ease-in-out absolute ${isMenuOpen ? 'rotate-45 translate-y-0' : 'translate-y-[-8px]'}`}></span>
              <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}></span>
              <span className={`block h-[2px] w-6 bg-white transition-all duration-300 ease-in-out absolute ${isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-[8px]'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-in slide-in-from-top bg-[#ff0000] rounded-lg p-6">
            <div className="flex flex-col gap-8 items-center">
              {/* Navigation Links */}
              <a
                href="#tour"
                className="text-white font-bold hover:text-black transition-colors text-center"
                style={{ fontSize: '28px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                TOUR
              </a>
              <a
                href="/newsletter"
                className="text-white font-bold hover:text-black transition-colors text-center"
                style={{ fontSize: '28px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                NEWSLETTER
              </a>
              <a
                href="#store"
                className="text-white font-bold hover:text-black transition-colors text-center"
                style={{ fontSize: '28px', fontFamily: 'Dunbar Tall, Arial, sans-serif' }}
                onClick={() => setIsMenuOpen(false)}
              >
                STORE
              </a>

              {/* Social Icons */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/20 w-full">
                <a
                  href="https://open.spotify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors"
                  aria-label="Spotify"
                >
                  <SpotifyIcon />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors"
                  aria-label="YouTube"
                >
                  <YouTubeIcon />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-black transition-colors"
                  aria-label="X"
                >
                  <XIcon />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
