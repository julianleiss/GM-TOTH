'use client'

import Navigation from '@/components/Navigation'

export default function Newsletter() {
  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Background GIFs - Full Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Desktop & Tablet Background */}
        <img
          src="/images/BG-DESK-003.gif"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile Background - object-cover to fill screen */}
        <img
          src="/images/BG-MOBILE-001.gif"
          alt="Background"
          className="block md:hidden w-full h-full object-cover"
        />
      </div>

      {/* Navigation Header */}
      <Navigation />

      {/* Newsletter Signup Component - Centered */}
      <div className="absolute inset-0 flex items-center justify-center z-20 px-4 md:px-8 lg:px-12">
        <div className="newsletter-container w-full max-w-md">
          <form className="flex flex-col gap-4 sm:gap-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input w-full px-4 py-3 sm:px-6 sm:py-4 text-base sm:text-lg bg-black/50 border-2 border-white text-white placeholder-white/70 focus:outline-none focus:border-red-500 transition-colors"
              style={{
                fontFamily: 'Dunbar Tall, Arial, sans-serif',
                fontWeight: 500
              }}
            />
            <button
              type="submit"
              className="newsletter-button w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-bold uppercase tracking-wider bg-white text-black hover:bg-black hover:text-white border-2 border-white transition-all duration-300"
              style={{
                fontFamily: 'Dunbar Tall, Arial, sans-serif',
                fontWeight: 900,
                letterSpacing: '0.05em'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* CSS for responsive newsletter component */}
      <style jsx>{`
        .newsletter-container {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .newsletter-input::placeholder {
          text-transform: uppercase;
        }

        /* Tablet adjustments */
        @media (min-width: 640px) {
          .newsletter-container {
            max-width: 500px;
          }
        }

        /* Desktop adjustments */
        @media (min-width: 1024px) {
          .newsletter-container {
            max-width: 600px;
          }
        }
      `}</style>
    </main>
  )
}
