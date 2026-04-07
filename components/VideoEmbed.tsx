'use client'

import { getYoutubeId } from '@/lib/utils'

type Props = {
  url: string
}

export default function VideoEmbed({ url }: Props) {
  const youtubeId = getYoutubeId(url)

  if (youtubeId) {
    return (
      <div className="relative aspect-video bg-bg-raised">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Prüfstandsvideo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-bg-surface border border-bg-border p-4 hover:border-amber transition-colors"
    >
      <div className="bg-amber w-8 h-8 flex items-center justify-center flex-shrink-0">
        <span className="text-black text-xs">▶</span>
      </div>
      <span className="text-text-muted text-sm">Video ansehen</span>
    </a>
  )
}
