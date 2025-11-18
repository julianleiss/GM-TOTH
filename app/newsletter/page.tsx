'use client'

import Navigation from '@/components/Navigation'
import Script from 'next/script'

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

      {/* Laylo Newsletter Embed - Centered */}
      <Script src="https://embed.laylo.com/laylo-sdk.js" strategy="afterInteractive" />
      <div className="absolute inset-0 flex items-center justify-center z-20 px-4 overflow-y-auto">
        <div style={{ maxWidth: '1000px', margin: 'auto', width: '100%' }}>
          <iframe
            id="laylo-drop-xN8Ke"
            frameBorder="0"
            scrolling="no"
            allow="web-share"
            style={{
              width: '100%',
              height: '700px',
              border: '0'
            }}
            src="https://embed.laylo.com?dropId=xN8Ke&color=4283FF&minimal=false&theme=light"
          />
        </div>
      </div>
    </main>
  )
}
