import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('zeigt Dialog wenn offen', () => {
    render(
      <ConfirmDialog
        offen={true}
        titel="Eintrag löschen?"
        text="Diese Aktion kann nicht rückgängig gemacht werden."
        onBestaetigen={jest.fn()}
        onAbbrechen={jest.fn()}
      />
    )
    expect(screen.getByText('Eintrag löschen?')).toBeInTheDocument()
    expect(screen.getByText(/rückgängig/i)).toBeInTheDocument()
  })

  it('zeigt Dialog nicht wenn geschlossen', () => {
    render(
      <ConfirmDialog
        offen={false}
        titel="Eintrag löschen?"
        text="Diese Aktion kann nicht rückgängig gemacht werden."
        onBestaetigen={jest.fn()}
        onAbbrechen={jest.fn()}
      />
    )
    expect(screen.queryByText('Eintrag löschen?')).not.toBeInTheDocument()
  })

  it('ruft onBestaetigen auf bei Bestätigen-Klick', () => {
    const onBestaetigen = jest.fn()
    render(
      <ConfirmDialog
        offen={true}
        titel="Löschen?"
        text="Sicher?"
        onBestaetigen={onBestaetigen}
        onAbbrechen={jest.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /löschen/i }))
    expect(onBestaetigen).toHaveBeenCalledTimes(1)
  })

  it('ruft onAbbrechen auf bei Abbrechen-Klick', () => {
    const onAbbrechen = jest.fn()
    render(
      <ConfirmDialog
        offen={true}
        titel="Löschen?"
        text="Sicher?"
        onBestaetigen={jest.fn()}
        onAbbrechen={onAbbrechen}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /abbrechen/i }))
    expect(onAbbrechen).toHaveBeenCalledTimes(1)
  })
})
