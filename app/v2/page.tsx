'use client'

import Navigation from '@/components/Navigation'

export default function HomeV2() {
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

      {/* Site Under Destruction Text */}
      <div
        className="absolute left-0 right-0 text-center z-20 px-4 color-cycle-text md:static"
        style={{
          fontFamily: 'Dunbar Tall, Arial, sans-serif',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.02em'
        }}
      >
        SITE UNDER DESTRUCTION
      </div>

      {/* CSS for color cycle animation and responsive text */}
      <style jsx>{`
        .color-cycle-text {
          animation: colorCycle 4s infinite;
          font-size: 24px;
          top: 50%;
          transform: translateY(-50%);
        }

        @keyframes colorCycle {
          0% {
            color: #FF0000;
          }
          25% {
            color: #FF9500;
          }
          50% {
            color: #FFE500;
          }
          75% {
            color: #FFFBDA;
          }
          100% {
            color: #FF0000;
          }
        }

        /* Tablet */
        @media (min-width: 640px) {
          .color-cycle-text {
            font-size: 36px;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .color-cycle-text {
            font-size: 48px;
          }
        }
      `}</style>
    </main>
  )
}
