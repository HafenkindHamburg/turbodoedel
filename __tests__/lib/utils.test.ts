import { calcPsDelta, calcNmDelta, formatPs, getYoutubeId } from '@/lib/utils'

describe('calcPsDelta', () => {
  it('berechnet positiven Delta', () => {
    expect(calcPsDelta(913, 148)).toBe(765)
  })

  it('gibt null zurück wenn ps_vorher null', () => {
    expect(calcPsDelta(913, null)).toBeNull()
  })
})

describe('calcNmDelta', () => {
  it('berechnet positiven Delta', () => {
    expect(calcNmDelta(992, 220)).toBe(772)
  })

  it('gibt null zurück wenn nm_vorher null', () => {
    expect(calcNmDelta(992, null)).toBeNull()
  })
})

describe('formatPs', () => {
  it('formatiert PS-Zahl mit Einheit', () => {
    expect(formatPs(913)).toBe('913 PS')
  })
})

describe('getYoutubeId', () => {
  it('extrahiert ID aus standard URL', () => {
    expect(getYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('extrahiert ID aus youtu.be URL', () => {
    expect(getYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })

  it('gibt null für non-YouTube-URL zurück', () => {
    expect(getYoutubeId('https://instagram.com/p/abc')).toBeNull()
  })

  it('gibt null für null-Input zurück', () => {
    expect(getYoutubeId(null)).toBeNull()
  })
})
