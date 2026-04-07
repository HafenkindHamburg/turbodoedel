export function calcPsDelta(psNachher: number, psVorher: number | null): number | null {
  if (psVorher === null) return null
  return psNachher - psVorher
}

export function calcNmDelta(nmNachher: number, nmVorher: number | null): number | null {
  if (nmVorher === null) return null
  return nmNachher - nmVorher
}

export function formatPs(ps: number): string {
  return `${ps} PS`
}

export function getYoutubeId(url: string | null): string | null {
  if (!url) return null

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}
