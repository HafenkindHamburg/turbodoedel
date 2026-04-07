import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Nav', () => {
  it('zeigt Logo an', () => {
    render(<Nav />)
    expect(screen.getByText(/TURBO/i)).toBeInTheDocument()
    expect(screen.getByText(/DÖEDEL/i)).toBeInTheDocument()
  })

  it('enthält Umbauten-Link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /umbauten/i })).toHaveAttribute('href', '/umbauten')
  })

  it('enthält Kontakt-Link als CTA', () => {
    render(<Nav />)
    const kontaktLink = screen.getByRole('link', { name: /kontakt/i })
    expect(kontaktLink).toHaveAttribute('href', '/kontakt')
    expect(kontaktLink.className).toMatch(/border/)
  })
})
