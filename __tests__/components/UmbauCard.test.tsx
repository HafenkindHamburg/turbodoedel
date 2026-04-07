import { render, screen } from '@testing-library/react'
import UmbauCard from '@/components/UmbauCard'
import type { Umbau } from '@/lib/supabase/types'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

const mockUmbau: Umbau = {
  id: 'test-id-123',
  fahrzeug: 'Golf 2 VR6',
  ps_nachher: 913,
  nm_nachher: 992,
  stage: 'Stage 3+',
  ps_vorher: 148,
  nm_vorher: 220,
  foto_fahrzeug: 'https://example.com/foto.jpg',
  foto_diagramm: 'https://example.com/diagramm.jpg',
  galerie: [],
  beschreibung: 'Testbeschreibung',
  komponenten: null,
  tags: ['VW', 'Stage 3+'],
  video_url: null,
  erstellt_am: new Date().toISOString(),
}

describe('UmbauCard', () => {
  it('zeigt Fahrzeugbezeichnung an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('Golf 2 VR6')).toBeInTheDocument()
  })

  it('zeigt PS-Zahl an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('913')).toBeInTheDocument()
  })

  it('zeigt Stage an', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    // Stage 3+ appears both as the stage label and as a tag — confirm at least one instance
    expect(screen.getAllByText('Stage 3+').length).toBeGreaterThanOrEqual(1)
  })

  it('verlinkt auf Detailseite', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/umbauten/test-id-123')
  })

  it('zeigt NEU-Badge für aktuelle Einträge (< 7 Tage)', () => {
    render(<UmbauCard umbau={mockUmbau} />)
    expect(screen.getByText('NEU')).toBeInTheDocument()
  })
})
