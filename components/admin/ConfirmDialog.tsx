type Props = {
  offen: boolean
  titel: string
  text: string
  onBestaetigen: () => void
  onAbbrechen: () => void
  bestaetigungsText?: string
  laden?: boolean
}

export default function ConfirmDialog({
  offen,
  titel,
  text,
  onBestaetigen,
  onAbbrechen,
  bestaetigungsText = 'LÖSCHEN',
  laden = false,
}: Props) {
  if (!offen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onAbbrechen}
      />

      {/* Dialog */}
      <div className="relative bg-bg-surface border border-bg-border max-w-sm w-full p-6">
        <h2 className="text-text-primary font-bold text-lg mb-2">{titel}</h2>
        <p className="text-text-muted text-sm mb-6">{text}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onAbbrechen}
            disabled={laden}
            className="btn-secondary disabled:opacity-50"
          >
            ABBRECHEN
          </button>
          <button
            onClick={onBestaetigen}
            disabled={laden}
            className="bg-red-800 border border-red-700 text-text-primary text-xs font-bold tracking-widest px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {laden ? 'WIRD GELÖSCHT…' : bestaetigungsText}
          </button>
        </div>
      </div>
    </div>
  )
}
