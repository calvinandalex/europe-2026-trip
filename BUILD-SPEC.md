# Europe 2026 Trip Site — Build Spec

**Family:** Calvin, Karissa, Christian (13), Victoria/Tori (8) Bagley
**Trip:** July 16–27, 2026 · Athens → Norwegian Pearl cruise → Venice
**Reference site:** github.com/calvinandalex/maui-trip (already cloned at `/alex/projects/travel/maui-trip/`)
**This build folder:** `/alex/projects/travel/europe-2026-site/`

---

## 🎯 Goal

Build a mobile-first single-page trip website that matches the **Maui site pattern** the family loved, with two upgrades:

1. **Command Center-backed itinerary check-off** — check something off on Karissa's phone, it updates on Calvin's, Christian's, and Tori's in real time. Shared trip URL, no login required.
2. **Packing lists stay per-device localStorage** (Maui pattern) — Christian shouldn't uncheck Tori's items.

Plus two new pages the Maui site didn't have:

3. **Athens walking tour page** — 22-stop interactive map with descriptions, "what to look for," and kid hooks
4. **Venice walking tour page** — 10-stop interactive map for Sunday afternoon sightseeing

---

## 📁 Repo + Deploy

- **Repo:** `github.com/calvinandalex/europe-2026-trip` (create new, public)
- **Deploy:** GitHub Pages (same as Maui) — `https://calvinandalex.github.io/europe-2026-trip/`
- **File structure:**
  ```
  europe-2026-site/
  ├── index.html            — main trip site (itinerary + packing tabs)
  ├── athens.html           — Athens walking tour page
  ├── venice.html           — Venice walking tour page
  ├── style.css             — shared Mediterranean design system
  ├── app.js                — main trip site logic (CC sync + localStorage)
  ├── athens.js             — Athens map + tour page logic
  ├── venice.js             — Venice map + tour page logic
  ├── calendars/            — .ics files
  │   ├── flight-lax-yyz-ath.ics
  │   ├── athens-vrbo-checkin.ics
  │   ├── cruise-embark.ics
  │   ├── santorini-tour.ics
  │   ├── olympia-tour.ics
  │   ├── corfu-rental.ics
  │   ├── kotor-tour.ics
  │   ├── split-arrival.ics
  │   ├── koper-rental.ics
  │   ├── venice-checkin.ics
  │   ├── doges-palace.ics
  │   ├── bell-tower.ics
  │   ├── gondola.ics
  │   ├── flight-vce-atl-lax.ics
  ├── BUILD-NOTES.md
  └── reference/            — source data (already populated)
      ├── emails/           — 10 parsed booking confirmations
      ├── athens/           — ChatGPT map + final schedule
      ├── tickets/          — Acropolis PDFs, etc.
      └── packing-list-v2.md
  ```

---

## 🎨 Design System

**Colors (Mediterranean palette — NOT Maui tropical):**
- Aegean deep blue: `#1B5A8A`
- Santorini white: `#F8F6F1`
- Terracotta accent: `#D6704B`
- Olive gold: `#C8A94A`
- Success green (completed): `#7CB342`

**Fonts:**
- Headings: **Cinzel** (Greek/Roman inscription vibe, elegant)
- Body: **Inter** (mobile-legible)
- Playful accents: **Caveat** (kid check-off feedback, "Great job!" notes)

**Layout:**
- Mobile-first, max-width 600px (phone-shaped like Maui)
- Sky-blue-to-cream gradient background
- Floating decorations: 🏛️ (top-left, sways), 🚢 (top-right, floats), gondola-shaped wave at bottom
- Global progress bar at top: "🏛️ X of Y completed!"

---

## 📅 Main Site (`index.html`) — Itinerary + Packing Tabs

### Header
- Title: **🏛️ Europe 2026** (Cinzel)
- Subtitle: July 16–27
- Family emoji strip: 👨 Calvin · 👩 Karissa · 👦 Christian · 👧 Tori
- Global progress bar (itinerary completion only, not packing)

### Tab navigation
- **📅 Itinerary** (default active)
- **🧳 Packing Lists**
- **🗺️ Athens Tour** (links to athens.html)
- **🗺️ Venice Tour** (links to venice.html)

### Itinerary tab — 12 day cards

Same visual style as Maui day cards. Each day gets a unique gradient color header.

**Day 1: Thursday, July 16 — Travel Day** (red gradient)
- ✈️ Depart Las Vegas — 12:10 PM PDT — Air Canada 1702 to Toronto — Conf CP9RI9 — Terminal 3, Gate E7
- 🛬 Arrive Toronto (YYZ) — 7:33 PM EDT — Terminal 1, Gate F57
- ✈️ Depart Toronto — 9:10 PM EDT — Air Canada 920 to Athens — Terminal 1, Gate E73

**Day 2: Friday, July 17 — Arrive Athens** (pink gradient)
- 🛬 Arrive Athens (ATH) — 1:40 PM EEST
- 🏠 Check into Vrbo (Athens, hosted by Adamantia Alvenioti) — 3:00 PM — Res 961-1127323511
- 🍽️ Dinner in Plaka
- 🚶 Evening walk around neighborhood (jet lag friendly)

**Day 3: Saturday, July 18 — Athens Marathon Day** (blue gradient)
- Use the full 22-stop plan from `reference/athens/athens-jul18-final-schedule.md`
- 8:00 AM 🏟️ Panathenaic Stadium
- 9:00 AM 🏛️ Zeus + Hadrian's Arch
- 9:45 AM 📸 Syntagma + Old Parliament
- 10:15 AM 🏛️ Neoclassical Trilogy walk-by
- 11:00 AM ⚔️ Changing of the Guard
- 11:30 AM 🍽️ Long Plaka lunch (90 min)
- 1:00 PM 🏛️ Acropolis Museum 🔒 Order #880591
- 3:15 PM 🏛️ Ancient Agora + Stoa of Attalos
- 4:15 PM 🛍️ Monastiraki Square
- 5:00 PM 🏛️ ACROPOLIS 🔒 Hellenic Heritage
- 8:15 PM 🚡 Mount Lycabettus + sunset
- 9:30 PM 🍽️ Koukaki dinner
- Link at top of day card: "📖 Open Athens walking tour →" → athens.html

**Day 4: Sunday, July 19 — Embark Norwegian Pearl** (green gradient)
- 10:00 AM 🏠 Check out of Vrbo
- Morning: Optional Ancient Agora if missed Jul 18
- 5:00 PM 🚢 Head to Piraeus port
- 8:00 PM 🚢 Embark Norwegian Pearl — Reservation 65073715 — Cabin 11608 (Club Balcony Suite) — Freestyle dining
- 🍽️ Dinner on ship

**Day 5: Monday, July 20 — Santorini** (purple gradient)
- 7:00 AM ⚓ Arrive Santorini
- 7:30 AM 🚡 Santorini Cable Car (4 tickets, Order 019e45b0)
- 8:00 AM 🏛️ Santorini Must-See Highlights Private Tour (7 hrs) — Santoriginal Tours, +30 693 686 2736
- 6:00 PM ⚓ Depart Santorini

**Day 6: Tuesday, July 21 — Katakolon (Olympia)** (orange gradient)
- 9:00 AM ⚓ Arrive Katakolon
- 9:30 AM 🏛️ Best Olympia Tour (4.5 hrs) — Tickets and Tours (Ruslan), +30 690 921 5086 — Meet at cruise port, look for "J A T" sign
- 7:00 PM ⚓ Depart Katakolon

**Day 7: Wednesday, July 22 — Corfu** (teal gradient)
- 7:00 AM ⚓ Arrive Corfu
- 8:00 AM 🚗 Pick up Corfu Sunrise rental car (Res #035870) — 16 Ethnikis Antistaseos St, New Port
- Explore Corfu at own pace
- 5:00 PM 🚗 Drop off rental
- 5:00 PM ⚓ Depart Corfu

**Day 8: Thursday, July 23 — Kotor, Montenegro** (deep-blue gradient)
- 7:30 AM ⚓ Arrive Kotor
- 12:00 PM 🚤 Blue Cave + Secret Tunnels + Lady of the Rocks Tour (3 hrs)
- 6:00 PM ⚓ Depart Kotor

**Day 9: Friday, July 24 — Split, Croatia** (coral gradient)
- 7:00 AM ⚓ Arrive Split
- **On foot — no tour booked**
- Explore Diocletian's Palace + Old Town + Riva promenade at own pace
- 5:00 PM ⚓ Depart Split

**Day 10: Saturday, July 25 — Koper, Slovenia** (mint gradient)
- 8:00 AM ⚓ Arrive Koper
- 8:00 AM 🚗 Pick up SIXT rental car — Koper Pristaniska 21
- Explore Slovenia at own pace (Piran, Ljubljana, etc.)
- 6:00 PM 🚗 Drop off rental
- 7:00 PM ⚓ Depart Koper

**Day 11: Sunday, July 26 — Ravenna Disembark → Venice** (gold gradient)
- 6:00 AM ⚓ Disembark in Ravenna
- 7:00 AM 🚌 Cruise transfer to Venice Airport
- 2:00 PM 🏨 Check into Hotel Palazzo Priuli — Fondamenta de l'Osmarin 4979/b, Castello — Booking #6231598372
- 2:40 PM 🌉 Bridge of Sighs exterior photo (Ponte della Paglia)
- 3:00 PM 🏛️ Doge's Palace 🔒 Vivaticket (90 min at kid-pace)
- 4:30 PM 🏛️ St. Mark's Basilica free standby line
- 5:15 PM 🏛️ Inside Basilica (mosaics)
- 6:00 PM 🔔 Bell Tower / Campanile 🔒 Ticket 171-B0X07VC
- 6:45 PM 🛍️ Mercerie walk
- 7:05 PM 🌉 Rialto Bridge
- 7:25 PM 🚤 Vaporetto Line 1 → Salute stop (golden hour)
- 7:40 PM 🕍 Santa Maria della Salute exterior
- 7:55 PM 🌉 Accademia Bridge sunset view
- 8:15 PM 🍽️ Dinner in Dorsoduro (90 min)
- 10:00 PM 🚣 Gondola at Bacino Orseolo (30 min, blue hour)
- Link at top of day card: "📖 Open Venice walking tour →" → venice.html

**Day 12: Monday, July 27 — Home** (sunset gradient)
- 6:45 AM ☕ Sunrise walk to empty St. Mark's Square
- 7:30 AM 🍳 Hotel breakfast + pack
- 8:15 AM 🚤 Water taxi hotel → VCE
- 11:05 AM ✈️ Delta 193 VCE→ATL
- 3:56 PM EDT 🛬 Arrive Atlanta
- 6:34 PM ✈️ Delta 722 ATL→LAS
- 7:42 PM PDT 🛬 Home

### Each item = checkable card

- Standard checklist-item pattern from Maui site
- `data-id` attribute uses format `dayN-itemN` (e.g. `11-4` for Doge's Palace)
- On click: toggle → immediate visual change (checkbox pop animation, strikethrough) → POST to Command Center
- Real-time sync: subscribe to Supabase realtime channel `trip_europe_2026_checklist`
- If offline: queue local, sync when back online

### Booking info blocks
- Under each day, show a subtle "📇 Booking Info" section with conf numbers, phone numbers, addresses
- Same visual pattern as Maui (booking-info class, gray background)

### Prep boxes ("Pack for Today")
Include on the busy days like Maui does:
- **Athens Day (Jul 18):** Big hats, water bottles, Compeed blister pads, cash for taxis
- **Cruise embark (Jul 19):** Passport, cruise docs, ship key lanyard, swimsuit accessible
- **Santorini (Jul 20):** Cable car tickets on phone, sunscreen, water shoes
- **Olympia (Jul 21):** Look for "J A T" sign at port, hats, water
- **Corfu (Jul 22):** Driver's license, credit card for rental
- **Kotor (Jul 23):** Water shoes, swimsuit for Blue Cave, towel
- **Split (Jul 24):** Comfortable walking shoes, sunscreen
- **Koper (Jul 25):** Driver's license, snacks for road trip
- **Venice arrival (Jul 26):** ⚠️ **Knee-length shorts or pants for men + shawl for Tori (Basilica dress code)**, passport for hotel check-in

---

### Packing tab — Per-person localStorage lists

Use exact structure from `reference/packing-list-v2.md`.

Four person cards, color-coded per Maui pattern:
- 👨 **Calvin** (blue)
- 👩 **Karissa** (pink)
- 👦 **Christian** (green)
- 👧 **Tori** (purple)

Plus two shared cards:
- 👨‍👩‍👧‍👦 **Mom/Dad Suitcase** (for everyone) — teal
- 🎒 **Backpack** (carry-on) — gold

Each person card has categorized sections (Clothing, Toiletries, Medical, etc.).

**Per-item localStorage:** `europe2026_pack_calvin_underwear`, etc. NEVER touches Command Center.

Per-person progress bar at top of each card: "Calvin 12/47 packed".

---

## 🗺️ Athens Tour Page (`athens.html`)

Standalone page. Link from Day 3 (Jul 18) card in main site.

### Header
- Title: **🏛️ Athens Walking Tour**
- Subtitle: "22 stops · Saturday, July 18"
- Quick stats: 22 stops · ~8 hours · 4 taxis budget €56

### Interactive map
- Base: Leaflet.js (same as ChatGPT map already saved at `reference/athens/athens_optimized_low_walking_route.html`)
- **Custom SVG icons per category** — not identical blue circles:
  - 🏛️ Ancient site (numbered gold circles): Acropolis stops, Agora, Zeus temple
  - 👑 Government / neoclassical (numbered blue circles): Syntagma, Parliament, Trilogy
  - 🏟️ Sport (numbered orange): Panathenaic Stadium
  - 🎡 Viewpoint (numbered purple): Lycabettus
  - 🍽️ Food (numbered coral): Koukaki, Plaka
- **Cleaner basemap:** CartoDB Positron (soft, low-noise)
- **Smooth polyline** between stops (color-graded by time of day: morning gold → midday terracotta → evening deep blue)
- **Dashed lines** for taxi segments
- **Soft feathered polygons** for hotel zones (not sharp rectangles) — Makrigianni, Plaka, Koukaki

### Ordered stop list (below map)
For each of the 22 stops, one card containing:
- **Stop number + name** (bold, Cinzel)
- **⏱️ Time** (e.g. "8:00 AM · ~1 hr")
- **🚕 or 🚶** transport from previous stop
- **📸 What it is** (2 sentences)
- **🎯 Look for this** (1 specific thing, e.g. "The 6 sculpted maidens holding up the porch on the Erechtheion — called the Caryatids")
- **👶 Kid hook** (Christian 13 / Tori 8 angle, e.g. "Tori: See if you can find the sunken footprints in the Areopagus rock where St. Paul stood")
- **✅ Checkbox** — synced to Command Center same as main itinerary

### Stop content

Research and write all 22 stops using this framework. Sources: Rick Steves Greece 2026, Blue Guide Athens, Lonely Planet. Content bank saved separately to `reference/athens/tour-content.md` (Devin generates this file).

Requirements:
- Historically accurate
- Kid-friendly angle for each (specifically Christian 13 or Tori 8)
- Concise — max 5 lines per stop when displayed on phone

Example for stop #5 Parthenon:
> **📸 What it is:** The main temple of the Acropolis, built 447-432 BC to honor Athena. Symbol of ancient Greek democracy and Western civilization itself.
>
> **🎯 Look for this:** The columns bulge slightly in the middle (called "entasis") to trick your eye into seeing them as perfectly straight. The whole temple has almost no straight lines — every surface curves subtly.
>
> **👶 Christian:** The gaps you see high on the walls once held the Elgin Marbles — sculptures the British stole in 1801 that Greece is still fighting to get back today.
>
> **👶 Tori:** Look for the tiny holes near the top of the columns — they once held bronze shields captured from Persian invaders 2,400 years ago.
>
> **⏱️ 15 min** · **🎟️ Included in Acropolis combo**

Write this style for all 22 stops.

---

## 🗺️ Venice Tour Page (`venice.html`)

Same pattern as Athens page but 10 stops for Sunday afternoon/evening. All stops based on the Sunday plan in the main itinerary.

### Stops:
1. 🏨 Hotel Palazzo Priuli (start)
2. 🌉 Bridge of Sighs exterior (Ponte della Paglia)
3. 🏛️ Doge's Palace
4. 🏛️ St. Mark's Basilica
5. 🔔 Bell Tower / Campanile
6. 🕰️ St. Mark's Square (Piazza San Marco)
7. 🛍️ Mercerie shopping lanes
8. 🌉 Rialto Bridge
9. 🕍 Santa Maria della Salute
10. 🌉 Accademia Bridge
11. 🍽️ Dorsoduro dinner
12. 🚣 Bacino Orseolo (gondola launch)

(Yes, that's 12. Adjust map + list to include all.)

Same content framework: What it is · Look for this · Christian hook · Tori hook · Time · Ticket info.

---

## 🔌 Command Center Integration

### Supabase table (create new)

```sql
CREATE TABLE trip_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_slug TEXT NOT NULL,          -- 'europe-2026'
  item_id TEXT NOT NULL,            -- '11-4' or 'athens-tour-5'
  completed BOOLEAN DEFAULT false,
  completed_by TEXT,                -- 'calvin' | 'karissa' | 'christian' | 'tori'
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (trip_slug, item_id)
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE trip_checklist_items;

-- RLS: anonymous read/write for trip_slug='europe-2026' only
ALTER TABLE trip_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public europe-2026" ON trip_checklist_items
  FOR ALL USING (trip_slug = 'europe-2026') WITH CHECK (trip_slug = 'europe-2026');
```

### Client integration

- Supabase URL/anon key: use Command Center project `xsfvzedpkiqgipnftdxb` (already in CREDENTIALS.md)
- Subscribe to `postgres_changes` on `trip_checklist_items WHERE trip_slug='europe-2026'`
- On tap: optimistic UI update → upsert row → wait for confirm
- On realtime event: update local state → re-render matching checkbox
- Family member selector (top of site): "Who are you?" → 👨 Calvin · 👩 Karissa · 👦 Christian · 👧 Tori → stored in localStorage → passed as `completed_by`

Small "who checked this" indicator on completed items: shows small avatar + timestamp.

---

## 📅 .ics Calendar Files

Generate one .ics per major event listed in the file structure above. Each should include:
- Correct timezone
- Location with lat/lng
- Confirmation number in description
- Alarm 1 hr before

---

## ✅ Acceptance criteria (Alex will verify)

1. Site opens on phone, displays cleanly at 375px width (iPhone SE)
2. All 12 day cards render with correct events, times, confirmation numbers
3. Global progress bar updates when items are checked
4. Checking an itinerary item on Device A shows the check on Device B within 3 seconds
5. Checking a packing item does NOT sync (stays per-device)
6. Athens page opens from Day 3 card link
7. Athens map renders with all 22 stops, custom icons, and route polyline
8. All 22 Athens stops have complete content (What it is / Look for / Christian hook / Tori hook)
9. Venice page opens from Day 11 card link
10. Venice map renders with all 12 stops and content
11. .ics files download correctly and add events to Google Calendar / iOS Calendar
12. Site deployed and accessible at https://calvinandalex.github.io/europe-2026-trip/
13. Packing tab renders 6 person/shared cards with correct items from `reference/packing-list-v2.md`
14. No console errors
15. Lighthouse Performance ≥ 85 mobile
16. Passes HUMANIZER check — no AI tells in content (no em dashes, no "delve", no "in the heart of", no sycophantic openers, no bold+colon lists)

---

## 📚 Reference materials (already in repo folder)

- `reference/emails/parsed-all.txt` — 10 booking confirmations parsed
- `reference/athens/athens-jul18-final-schedule.md` — final Athens day plan
- `reference/athens/athens_optimized_low_walking_route.html` — ChatGPT source map
- `reference/tickets/` — Acropolis PDFs
- `reference/packing-list-v2.md` — final packing list
- `/alex/projects/travel/maui-trip/index.html` — reference site to match
- `/alex/projects/travel/spain-2027-site/BUILD-NOTES.md` — other reference for design taste

---

## 🚀 Delivery

- Create repo `github.com/calvinandalex/europe-2026-trip`
- Push complete site
- Enable GitHub Pages (deploy from main branch)
- Verify live URL works
- Write `BUILD-NOTES.md` with:
  - Live URL
  - Any known issues
  - How to update content later
  - Supabase table SQL for reference
- Post final URL when done

**When done, insert into Command Center:**
- `activity_log`: "Europe 2026 trip site built and deployed"
- `calvin_todos`: mark trip-site TODO complete
- `cron_jobs`: none needed (static site)
