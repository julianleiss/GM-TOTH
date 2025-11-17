'use client'

import Navigation from '@/components/Navigation'

export default function HomeV2() {
  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Background GIFs - Full Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Desktop & Tablet Background */}
        <img
          src="/images/BG-DESK-001.gif"
          alt="Background"
          className="hidden md:block w-full h-full object-cover"
        />
        {/* Mobile Background - object-contain to show full GIF */}
        <img
          src="/images/BG-MOBILE-001.gif"
          alt="Background"
          className="block md:hidden w-full h-full object-contain"
        />
      </div>

      {/* Navigation Header */}
      <Navigation />
    </main>
  )
}
