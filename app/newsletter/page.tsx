'use client'

import Navigation from '@/components/Navigation'
import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Add Laylo API integration or other newsletter service
    console.log('Email submitted:', email)

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setEmail('')
      alert('Thanks for subscribing!')
    }, 1000)
  }

  return (
    <main className="w-screen h-screen overflow-y-auto relative">
      {/* Background GIFs - Full Viewport */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Desktop & Tablet Background */}
        <img
          src="/images/BG-DESK-NS_001.gif"
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

      {/* Newsletter Form - Minimalist Centered */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL"
              required
              className="newsletter-input"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className="newsletter-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .newsletter-input {
          width: 100%;
          padding: 16px 20px;
          font-family: 'Dunbar Tall', Arial, sans-serif;
          font-size: 16px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: transparent;
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          outline: none;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .newsletter-input:hover {
          border-color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05);
        }

        .newsletter-input:focus {
          border-color: #FFFFFF;
          background: rgba(255, 255, 255, 0.1);
        }

        .newsletter-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .newsletter-button {
          width: 100%;
          padding: 16px 20px;
          font-family: 'Dunbar Tall', Arial, sans-serif;
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: #FFFFFF;
          color: #000000;
          border: 2px solid #FFFFFF;
          cursor: pointer;
          outline: none;
          transition: all 0.3s ease;
        }

        .newsletter-button:hover {
          background: transparent;
          color: #FFFFFF;
        }

        .newsletter-button:active {
          transform: scale(0.98);
        }

        .newsletter-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Tablet & Desktop */
        @media (min-width: 640px) {
          .newsletter-input {
            padding: 20px 24px;
            font-size: 18px;
          }

          .newsletter-button {
            padding: 20px 24px;
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  )
}
