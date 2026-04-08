export type Umbau = {
  id: string
  fahrzeug: string
  ps_nachher: number
  nm_nachher: number
  stage: string
  ps_vorher: number | null
  nm_vorher: number | null
  foto_fahrzeug: string
  foto_diagramm: string
  galerie: string[]
  beschreibung: string | null
  komponenten: string | null
  tags: string[]
  video_url: string | null
  erstellt_am: string
}

export type UmbauInsert = Omit<Umbau, 'id' | 'erstellt_am'>
export type UmbauUpdate = Partial<UmbauInsert>

export type Database = {
  public: {
    Tables: {
      umbauten: {
        Row: Umbau
        Insert: UmbauInsert
        Update: UmbauUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
