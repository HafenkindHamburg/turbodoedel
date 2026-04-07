import type { Umbau, UmbauInsert } from '@/lib/supabase/types'

describe('Umbau types', () => {
  it('Umbau hat alle Pflichtfelder', () => {
    const umbau: Umbau = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      fahrzeug: 'Golf 2 VR6',
      ps_nachher: 913,
      nm_nachher: 992,
      stage: 'Stage 3+',
      ps_vorher: null,
      nm_vorher: null,
      foto_fahrzeug: 'https://example.com/foto.jpg',
      foto_diagramm: 'https://example.com/diagramm.jpg',
      galerie: [],
      beschreibung: null,
      komponenten: null,
      tags: ['VW', 'Stage3+'],
      video_url: null,
      erstellt_am: '2025-03-14T10:00:00Z',
    }
    expect(umbau.fahrzeug).toBe('Golf 2 VR6')
    expect(umbau.ps_nachher).toBe(913)
  })

  it('UmbauInsert hat kein id oder erstellt_am', () => {
    const insert: UmbauInsert = {
      fahrzeug: 'Audi RS4',
      ps_nachher: 662,
      nm_nachher: 880,
      stage: 'Stage 2',
      ps_vorher: 420,
      nm_vorher: 560,
      foto_fahrzeug: 'https://example.com/foto.jpg',
      foto_diagramm: 'https://example.com/diagramm.jpg',
      galerie: [],
      beschreibung: 'Umbau mit...',
      komponenten: 'Garrett GTX',
      tags: ['Audi'],
      video_url: null,
    }
    expect(insert.fahrzeug).toBe('Audi RS4')
  })
})
