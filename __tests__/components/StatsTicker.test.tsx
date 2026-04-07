import { render, screen } from '@testing-library/react'
import StatsTicker from '@/components/StatsTicker'
import type { Umbau } from '@/lib/supabase/types'

const mockUmbauten: Pick<Umbau, 'id' | 'fahrzeug' | 'ps_nachher' | 'nm_nachher'>[] = [
  { id: '1', fahrzeug: 'Golf 2 VR6', ps_nachher: 913, nm_nachher: 992 },
  { id: '2', fahrzeug: 'Audi RS4',   ps_nachher: 662, nm_nachher: 880 },
]

describe('StatsTicker', () => {
  it('zeigt alle Fahrzeugbezeichnungen', () => {
    render(<StatsTicker umbauten={mockUmbauten} />)
    const golfElems = screen.getAllByText('Golf 2 VR6')
    expect(golfElems.length).toBeGreaterThanOrEqual(1)
  })

  it('zeigt PS-Zahlen', () => {
    render(<StatsTicker umbauten={mockUmbauten} />)
    const ps = screen.getAllByText('913 PS')
    expect(ps.length).toBeGreaterThanOrEqual(1)
  })
})
