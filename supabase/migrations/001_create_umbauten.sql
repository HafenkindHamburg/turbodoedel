-- Umbauten-Tabelle
CREATE TABLE IF NOT EXISTS public.umbauten (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fahrzeug      text NOT NULL,
  ps_nachher    integer NOT NULL CHECK (ps_nachher > 0),
  nm_nachher    integer NOT NULL CHECK (nm_nachher > 0),
  stage         text NOT NULL CHECK (stage IN ('Stage 1', 'Stage 2', 'Stage 3', 'Stage 3+')),
  ps_vorher     integer CHECK (ps_vorher IS NULL OR ps_vorher > 0),
  nm_vorher     integer CHECK (nm_vorher IS NULL OR nm_vorher > 0),
  foto_fahrzeug text NOT NULL,
  foto_diagramm text NOT NULL,
  galerie       text[] NOT NULL DEFAULT '{}',
  beschreibung  text,
  komponenten   text,
  tags          text[] NOT NULL DEFAULT '{}',
  video_url     text,
  erstellt_am   timestamptz NOT NULL DEFAULT now()
);

-- Index für Sortierung nach Datum (häufigste Abfrage)
CREATE INDEX IF NOT EXISTS idx_umbauten_erstellt_am ON public.umbauten(erstellt_am DESC);

-- Index für Tag-Filter
CREATE INDEX IF NOT EXISTS idx_umbauten_tags ON public.umbauten USING GIN(tags);

-- Row Level Security aktivieren
ALTER TABLE public.umbauten ENABLE ROW LEVEL SECURITY;

-- Öffentlich: Lesen erlaubt
CREATE POLICY "umbauten_select_public"
  ON public.umbauten FOR SELECT
  USING (true);

-- Nur eingeloggte Admins dürfen schreiben/ändern/löschen
CREATE POLICY "umbauten_insert_admin"
  ON public.umbauten FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "umbauten_update_admin"
  ON public.umbauten FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "umbauten_delete_admin"
  ON public.umbauten FOR DELETE
  TO authenticated
  USING (true);

-- Storage Bucket für Bilder
INSERT INTO storage.buckets (id, name, public)
VALUES ('umbauten', 'umbauten', true)
ON CONFLICT DO NOTHING;

-- Storage Policy: Öffentlich lesbar
CREATE POLICY "storage_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'umbauten');

-- Storage Policy: Nur Admins dürfen hochladen
CREATE POLICY "storage_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'umbauten');

CREATE POLICY "storage_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'umbauten');
