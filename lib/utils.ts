export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ')
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomColor(): string {
  const colors = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
