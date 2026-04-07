# Turbodoedel.de — Design-Spec

**Datum:** 2026-04-07
**Status:** Genehmigt

---

## 1. Projektziel

Vollständiges Redesign von turbodoedel.de — von einer veralteten, statischen Automotive-Tuning-Website (Spry-Widget-Navigation, mid-2000s Design) zu einer modernen, hochwertigen Performance-Website mit dynamischem Content-Management.

**Kernfunktion:** Der Betreiber postet regelmäßig neue Turbo-Umbau-Datenstände (Fahrzeug, PS, NM, Fotos, Diagramme). Diese sollen einfach über ein geschütztes Admin-Panel gepflegt und auf der öffentlichen Website angezeigt werden.

---

## 2. Design

### Stilrichtung

**Dark + Industrial Premium** — eine Mischung aus:
- Schwarz/Anthrazit als Hintergrund (#0a0a0a – #1a1a1a)
- Gold/Amber als primäre Akzentfarbe (#c8902a)
- Weiß/Hellgrau für Text (#fff, #ddd, #aaa)
- Monospace-Font für PS/NM-Zahlen (technisches, messbares Feeling)
- Uppercase Letter-Spacing für Labels und Überschriften

### Parallax & Animationen

- **Hero-Sektion:** Hintergrundbild scrollt langsamer als Vordergrund-Content
- **Stats-Ticker:** Laufende Loop-Animation der Top-Umbauten (PS-Zahlen)
- **Sektions-Einblendung:** Inhalte faden beim Scrollen ins Bild ein (Intersection Observer)
- **Hover-Effekte:** Cards heben sich bei Hover leicht an (transform: translateY)

---

## 3. Seitenstruktur

| Seite | Route | Beschreibung |
|---|---|---|
| Home | `/` | Hero, Stats-Ticker, Teaser neuster Umbauten, Statement |
| Umbauten | `/umbauten` | Card-Grid aller Einträge, filterbar + suchbar |
| Umbau-Detail | `/umbauten/[id]` | Vollständige Einzelansicht eines Umbaus |
| Leistungen | `/leistungen` | Serviceangebot: Chiptuning, Turbo-Umbau, Online-Tuning, TÜV |
| Über uns | `/ueber-uns` | Team, Erfahrung, Philosophie |
| FAQ | `/faq` | Häufige Fragen zu Garantie, TÜV, Ablauf, Kosten |
| Partner | `/partner` | Kooperationen, Lieferanten, Zertifizierungen |
| Kontakt | `/kontakt` | Formular, Adresse, Öffnungszeiten, Social Media |
| Admin | `/admin` | Geschütztes Panel (nur eingeloggte Admins) |

### Navigation

Sticky Header, dunkel (rgba mit backdrop-blur), Logo links mit Amber-Akzent, Navigationslinks rechts, "Kontakt" als hervorgehobener CTA-Button.

### Statische Seiten

Leistungen, Über uns, FAQ und Partner sind statische Next.js-Seiten mit hardcoded Content (kein CMS-Backing). Änderungen erfordern einen Code-Deploy. Nur Umbauten sind dynamisch (Supabase-gespeist).

---

## 4. Umbauten-Einträge

### Darstellung: Card Grid

- Filterbar nach Hersteller, Stage, Umbau-Typ (Tags)
- Suchfeld
- Neueste Einträge mit "NEU"-Badge hervorgehoben
- Hover: Card hebt sich leicht an, Border-Farbe wechselt zu Amber

### Felder pro Eintrag

| Feld | Pflicht | Beschreibung |
|---|---|---|
| `fahrzeug` | ja | Bezeichnung, z.B. "Golf 2 VR6" |
| `ps_nachher` | ja | PS nach dem Umbau |
| `nm_nachher` | ja | NM nach dem Umbau |
| `stage` | ja | "Stage 1" / "Stage 2" / "Stage 3+" |
| `ps_vorher` | nein | PS Serienstand |
| `nm_vorher` | nein | NM Serienstand |
| `foto_fahrzeug` | ja | Dediziertes Fahrzeugfoto (Storage URL) |
| `foto_diagramm` | ja | Prüfstandsdiagramm-Bild (Storage URL) |
| `galerie` | nein | Array weiterer Fotos (Motorraum, Prüfstand, etc.) |
| `beschreibung` | nein | Freitext-Beschreibung des Umbaus |
| `komponenten` | nein | Verbaute Teile, komma-separiert |
| `tags` | nein | Array für Filter: Hersteller, Umbautyp, Stage |
| `video_url` | nein | YouTube / Instagram Link |
| `erstellt_am` | auto | Timestamp (automatisch) |

### Detailseite

- Großes Hero-Fahrzeugbild mit Gradient-Overlay
- PS/NM Headline prominent (Monospace, groß)
- Vorher/Nachher-Block mit Zuwachs-Berechnung (+X PS)
- Prüfstandsdiagramm-Bild
- Beschreibungstext
- Komponenten als Tags
- Fotogalerie (Grid, klickbar/lightbox)
- Video eingebettet (YouTube iframe / Instagram oEmbed)

---

## 5. Admin-Panel

### Zugang

- Route: `/admin`
- Supabase Auth: E-Mail + Passwort Login
- Single-Admin-Setup (ein Account für den Betreiber)
- Nicht eingeloggte Nutzer werden auf `/admin/login` umgeleitet

### Funktionen

- **Übersicht:** Liste aller Umbauten (Fahrzeug, PS, Datum), sortiert nach Datum absteigend
- **Neu erstellen:** Formular mit allen Feldern, Bild-Upload per Drag & Drop
- **Bearbeiten:** Selbes Formular, vorausgefüllt
- **Löschen:** Mit Bestätigungs-Dialog (kein versehentliches Löschen)
- **Bild-Upload:** Direkt in Supabase Storage, URLs werden automatisch in die Datenbank geschrieben

### Design des Admin-Panels

Gleiches Dark-Theme wie die öffentliche Website — dunkel, Amber-Akzente, helle Texte (#ddd/#fff für Inhalte, #bbb für Labels). Kein fremdes UI-Framework — eigene, minimalistische Komponenten.

---

## 6. Architektur & Tech-Stack

### Stack

| Schicht | Technologie | Begründung |
|---|---|---|
| Frontend & Admin | Next.js 14+ (App Router) | Server Components, ISR, optimale Performance |
| Datenbank | Supabase PostgreSQL | Managed, kostengünstig, gute DX |
| Datei-Storage | Supabase Storage | Bilder direkt per CDN ausgeliefert |
| Auth | Supabase Auth | E-Mail + Passwort Login |
| Hosting | Vercel | Git-Push → automatisch deployed |
| Styling | Tailwind CSS | Utility-first, schnelle Entwicklung |

### Datenmodell

```sql
CREATE TABLE umbauten (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fahrzeug      text NOT NULL,
  ps_nachher    integer NOT NULL,
  nm_nachher    integer NOT NULL,
  stage         text NOT NULL,
  ps_vorher     integer,
  nm_vorher     integer,
  foto_fahrzeug text NOT NULL,
  foto_diagramm text NOT NULL,
  galerie       text[] DEFAULT '{}',
  beschreibung  text,
  komponenten   text,
  tags          text[] DEFAULT '{}',
  video_url     text,
  erstellt_am   timestamptz NOT NULL DEFAULT now()
);
```

### Datenfluss

```
Admin (Browser)
  → POST /api/umbauten (Next.js API Route)
  → Supabase: Bild-Upload in Storage + Datensatz in DB

Besucher (Browser)
  → GET turbodoedel.de/umbauten
  → Next.js liest Supabase DB (Server Component / ISR)
  → Rendert Card-Grid
```

### Deployment

```
Developer → git push → GitHub → Vercel CI/CD → turbodoedel.de (Live)
```

---

## 7. Offene Entscheidungen

- **Domain-Migration:** Wie wird die bestehende Domain umgezogen? (DNS-Umstellung auf Vercel)
- **Inhalts-Migration:** Werden bestehende Referenzen aus der alten Site übernommen?
- **SEO/Sitemap:** Automatisch generierte Sitemap über `next-sitemap` oder manuell?
- **Kontaktformular:** Wie sollen Nachrichten zugestellt werden? (E-Mail via Resend/SendGrid oder Supabase DB-Eintrag)

---

## 8. Was bewusst nicht gebaut wird (YAGNI)

- Mehrsprachigkeit (nur Deutsch)
- Mehrere Admin-Benutzer / Rollen
- Kommentar- oder Like-Funktion
- Newsletter
- E-Commerce / Bezahlung
- Blog-Sektion (Umbauten sind das Content-Format)
