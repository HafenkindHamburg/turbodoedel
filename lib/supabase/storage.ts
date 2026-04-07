import { createClient } from './client'

const BUCKET = 'umbauten'

export async function uploadImage(
  file: File,
  pfad: string
): Promise<string> {
  const supabase = createClient()

  const dateiname = `${pfad}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(dateiname, file, { upsert: false })

  if (error) throw new Error(`Upload fehlgeschlagen: ${error.message}`)

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(dateiname)

  return data.publicUrl
}

export async function deleteImage(publicUrl: string): Promise<void> {
  const supabase = createClient()

  const marker = `/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return

  const pfad = publicUrl.slice(idx + marker.length)

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([pfad])

  if (error) throw new Error(`Löschen fehlgeschlagen: ${error.message}`)
}
