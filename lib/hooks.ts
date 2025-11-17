import { useEffect, useState } from 'react'

/**
 * Hook for responsive viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
    orientation: typeof window !== 'undefined'
      ? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      : 'landscape',
  })

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      // Throttle resize events
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight

        setViewport({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
          orientation: width > height ? 'landscape' : 'portrait',
        })
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return viewport
}

/**
 * Hook for touch optimization
 */
export function useTouchOptimized() {
  useEffect(() => {
    // Prevent default touch behaviors on canvas elements
    const preventDefaultTouch = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        e.preventDefault()
      }
    }

    document.addEventListener('touchstart', preventDefaultTouch, { passive: false })
    document.addEventListener('touchmove', preventDefaultTouch, { passive: false })

    return () => {
      document.removeEventListener('touchstart', preventDefaultTouch)
      document.removeEventListener('touchmove', preventDefaultTouch)
    }
  }, [])
}

/**
 * Throttle function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Debounce function for performance
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

/**
 * Get responsive camera FOV based on viewport
 */
export function getResponsiveFOV(viewport: ReturnType<typeof useViewport>): number {
  if (viewport.isMobile) {
    return viewport.orientation === 'portrait' ? 70 : 60
  }
  if (viewport.isTablet) {
    return 65
  }
  return 60
}

/**
 * Get responsive camera position based on viewport
 */
export function getResponsiveCameraPosition(
  viewport: ReturnType<typeof useViewport>,
  basePosition: [number, number, number]
): [number, number, number] {
  if (viewport.isMobile && viewport.orientation === 'portrait') {
    // Pull camera back on mobile portrait
    return [basePosition[0], basePosition[1], basePosition[2] * 1.3]
  }
  return basePosition
}
