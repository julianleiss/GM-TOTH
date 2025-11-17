'use client'

import Navigation from '@/components/Navigation'

export default function HomeV2() {
  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Background GIFs - Full Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Desktop & Tablet Background */}
        <img
          src="/images/BG-DESK-002.gif"
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

      {/* Site Under Destruction Text */}
      <div
        className="absolute left-0 right-0 text-center z-20 px-4 blinking-text"
        style={{
          top: '200px',
          fontFamily: 'Dunbar Tall, Arial, sans-serif',
          color: '#FF0000',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.02em'
        }}
      >
        SITE UNDER DESTRUCTION
      </div>

      {/* CSS for blinking animation and responsive text */}
      <style jsx>{`
        .blinking-text {
          animation: blink 1s infinite;
          font-size: 18px;
          line-height: 1;
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        /* Tablet */
        @media (min-width: 640px) {
          .blinking-text {
            font-size: 36px;
            line-height: 1.2;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .blinking-text {
            font-size: 48px;
            line-height: 1.2;
          }
        }
      `}</style>
    </main>
  )
}
