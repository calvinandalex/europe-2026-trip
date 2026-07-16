# Europe 2026 Trip Site - Build Notes

Built by Devin on 2026-07-15.

## Live URL

https://calvinandalex.github.io/europe-2026-trip/

## Repo

https://github.com/calvinandalex/europe-2026-trip

## What is included

- Mobile-first Maui-style single page trip site with 12 itinerary day cards.
- Shared Supabase-backed checklist sync for itinerary and tour checkboxes.
- Per-device localStorage packing lists for Calvin, Karissa, Christian, Tori, shared suitcase, and backpack.
- Athens walking tour page with 22 mapped stops, category icons, route lines, taxi dashes, and family stop content.
- Venice walking tour page with 12 mapped stops and family stop content.
- Fourteen .ics calendar files in the calendars folder.

## Supabase table SQL

```sql
CREATE TABLE IF NOT EXISTS trip_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_slug TEXT NOT NULL,
  item_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_by TEXT,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (trip_slug, item_id)
);

ALTER PUBLICATION supabase_realtime ADD TABLE trip_checklist_items;

ALTER TABLE trip_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public europe-2026" ON trip_checklist_items
  FOR ALL USING (trip_slug = 'europe-2026') WITH CHECK (trip_slug = 'europe-2026');
```

## How to update content

- Edit itinerary day data in `index.html` inside `window.TRIP_CONFIG`, then update rendering if needed in `app.js`.
- Edit Athens content in `reference/athens/tour-content.md` first, then mirror the stop data in `athens.html`.
- Edit Venice content in `reference/venice/tour-content.md` first, then mirror the stop data in `venice.html`.
- Packing list changes live in `index.html` data and remain per-device because checks use localStorage.
- Calendar files are static .ics files in `calendars/`.

## Known issues

None at handoff. GitHub Pages may take a minute or two to refresh after a push.
