const TRIP = 'europe-2026';
const { supabaseUrl, supabaseAnon, family } = window.TRIP_CONFIG;
const stops = window.TOUR_STOPS;
const kind = window.TOUR_KIND;
const state = {
  items: {},
  member: localStorage.getItem('europe2026_member') || 'calvin'
};
let client = null;

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function idFor(index) {
  return kind + '-tour-' + (index + 1);
}

function categoryFor(index, stop) {
  if (kind === 'athens') return stop[5];
  if (index === 0) return 'hotel';
  if (index === 8 || index === 9) return 'view';
  if (index === 10) return 'food';
  return 'ancient';
}

function colorFor(category) {
  const colors = {
    ancient: '#C8A94A',
    gov: '#1B5A8A',
    sport: '#D6704B',
    view: '#8061b5',
    food: '#e46f63',
    hotel: '#2e8c8c'
  };
  return colors[category] || '#1B5A8A';
}

function iconFor(index, category) {
  return L.divIcon({
    className: '',
    html: '<div class="marker-pin marker-' + category + '">' + (index + 1) + '</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14]
  });
}

function stopField(stop, athensField, veniceField) {
  return kind === 'athens' ? stop[athensField] : stop[veniceField];
}

function stopLatLng(stop) {
  return kind === 'athens' ? [stop[3], stop[4]] : [stop[2], stop[3]];
}

function metaText(row) {
  const person = family.find(member => member.id === row.completed_by);
  const who = person ? person.emoji + ' ' + person.name : 'Family';
  const when = row.completed_at
    ? new Date(row.completed_at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    : 'just now';
  return who + ' · ' + when;
}

function renderStops() {
  const html = stops.map((stop, index) => {
    const name = stop[0];
    const time = stop[1];
    const transport = kind === 'athens' ? stop[2] : '🚶 Walk / vaporetto';
    const category = categoryFor(index, stop);
    const what = stopField(stop, 6, 4);
    const look = stopField(stop, 7, 5);
    const christian = stopField(stop, 8, 6).replace(/^Christian: /, '');
    const tori = stopField(stop, 9, 7).replace(/^Tori: /, '');
    const ticket = stopField(stop, 10, 8) || 'Free stop';
    const id = idFor(index);
    return '<article class="stop-card" data-id="' + id + '">' +
      '<div class="stop-head"><div class="stop-num" style="background:' + colorFor(category) + '">' + (index + 1) + '</div>' +
      '<div><h2 class="stop-title">' + esc(name) + '</h2>' +
      '<div class="stop-meta">⏱️ ' + esc(time) + ' · ' + esc(transport) + ' · ' + esc(ticket) + '</div></div></div>' +
      '<div class="stop-lines">' +
      '<p><span class="label">📸 What it is</span> ' + esc(what) + '</p>' +
      '<p><span class="label">🎯 Look for this</span> ' + esc(look) + '</p>' +
      '<p><span class="label">👦 Christian</span> ' + esc(christian) + '</p>' +
      '<p><span class="label">👧 Tori</span> ' + esc(tori) + '</p></div>' +
      '<div class="tour-check-row" data-id="' + id + '"><div class="checkbox"></div>' +
      '<div class="item-content"><div class="item-text">Stop done</div><div class="checked-meta" data-meta="' + id + '"></div></div></div>' +
      '</article>';
  }).join('');

  const list = document.getElementById('stopList');
  list.innerHTML = html;
  list.addEventListener('click', event => {
    const row = event.target.closest('.tour-check-row');
    if (row) toggle(row.dataset.id);
  });
}

function paint() {
  document.querySelectorAll('.tour-check-row').forEach(element => {
    const row = state.items[element.dataset.id];
    const completed = Boolean(row && row.completed);
    element.classList.toggle('completed', completed);
    const meta = document.querySelector('[data-meta="' + element.dataset.id + '"]');
    if (meta) meta.textContent = completed ? metaText(row) : '';
  });
}

async function toggle(id) {
  const current = Boolean(state.items[id] && state.items[id].completed);
  const next = !current;
  const row = {
    trip_slug: TRIP,
    item_id: id,
    completed: next,
    completed_by: next ? state.member : null,
    completed_at: next ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };
  state.items[id] = row;
  paint();
  if (client) {
    await client.from('trip_checklist_items').upsert(row, { onConflict: 'trip_slug,item_id' });
  }
}

async function sync() {
  try {
    client = window.supabase.createClient(supabaseUrl, supabaseAnon);
    const { data } = await client.from('trip_checklist_items').select('*').eq('trip_slug', TRIP);
    (data || []).forEach(row => { state.items[row.item_id] = row; });
    paint();
    client.channel('trip_europe_2026_checklist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_checklist_items', filter: 'trip_slug=eq.' + TRIP }, payload => {
        const row = payload.new || payload.old;
        if (row && row.item_id) {
          state.items[row.item_id] = row;
          paint();
        }
      })
      .subscribe();
  } catch (error) {
    console.warn('Tour sync unavailable', error);
  }
}

function drawMap() {
  const map = L.map('map', { scrollWheelZoom: false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 20
  }).addTo(map);

  const latlngs = stops.map(stopLatLng);
  stops.forEach((stop, index) => {
    const category = categoryFor(index, stop);
    L.marker(latlngs[index], { icon: iconFor(index, category) })
      .addTo(map)
      .bindPopup('<b>' + (index + 1) + '. ' + esc(stop[0]) + '</b><br>' + esc(stop[1]));
  });

  if (kind === 'athens') {
    for (let index = 0; index < latlngs.length - 1; index += 1) {
      const taxi = [0, 1, 3, 9, 11, 14, 20, 21].includes(index);
      const color = index < 8 ? '#C8A94A' : index < 15 ? '#D6704B' : '#1B5A8A';
      L.polyline([latlngs[index], latlngs[index + 1]], {
        color,
        weight: 4,
        opacity: 0.8,
        dashArray: taxi ? '8 8' : null
      }).addTo(map);
    }
    const zones = [
      { name: 'Makrigianni', points: [[37.9668,23.7267],[37.9708,23.7310],[37.9720,23.7270],[37.9684,23.7248]] },
      { name: 'Plaka', points: [[37.971,23.728],[37.975,23.733],[37.976,23.727],[37.972,23.724]] },
      { name: 'Koukaki', points: [[37.962,23.721],[37.967,23.727],[37.968,23.721],[37.964,23.718]] }
    ];
    zones.forEach(zone => {
      L.polygon(zone.points, { color: '#1B5A8A', fillColor: '#1B5A8A', fillOpacity: 0.08, weight: 1, opacity: 0.25 })
        .addTo(map)
        .bindTooltip(zone.name);
    });
  } else {
    L.polyline(latlngs, { color: '#1B5A8A', weight: 4, opacity: 0.8 }).addTo(map);
    L.polyline([latlngs[7], latlngs[8]], { color: '#D6704B', weight: 4, opacity: 0.75, dashArray: '8 8' })
      .addTo(map)
      .bindTooltip('Vaporetto Line 1');
  }

  map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('routeNote').textContent = kind === 'athens'
    ? 'Taxi segments are dashed. Colors shift from morning gold to midday terracotta to evening blue.'
    : 'Rialto to Salute is the scenic vaporetto segment. The rest is a kid-paced Venice walk.';
  renderStops();
  drawMap();
  sync();
});
