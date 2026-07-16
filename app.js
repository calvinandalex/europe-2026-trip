const { supabaseUrl, supabaseAnon, days, packing, family } = window.TRIP_CONFIG;
const TRIP = 'europe-2026';
const store = {
  items: {},
  packing: {},
  member: localStorage.getItem('europe2026_member') || 'calvin',
  offline: JSON.parse(localStorage.getItem('europe2026_offline_queue') || '[]')
};
let client = null;

const $ = selector => document.querySelector(selector);

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function activeMember() {
  return family.find(member => member.id === store.member) || family[0];
}

function renderMembers() {
  const wrap = $('#memberPicker');
  wrap.innerHTML = family.map(member =>
    '<button class="member-btn ' + (store.member === member.id ? 'active' : '') + '" data-member="' + member.id + '">' +
    member.emoji + ' ' + member.name + '</button>'
  ).join('');
  if (wrap.dataset.bound === 'true') return;
  wrap.dataset.bound = 'true';
  wrap.addEventListener('click', event => {
    const button = event.target.closest('[data-member]');
    if (!button) return;
    store.member = button.dataset.member;
    localStorage.setItem('europe2026_member', store.member);
    renderMembers();
    renderPacking();
  });
}

function preBookedBadge(text) {
  return text
    ? '<div class="prebooked"><span>✅ PRE-BOOKED</span><small>' + esc(text) + '</small></div>'
    : '';
}

function birthdayBanner(day) {
  if (!day.birthday) return '';
  return '<button class="birthday-banner" type="button" data-birthday-confetti aria-label="Celebrate Christian birthday">' +
    '<span class="birthday-copy">' + esc(day.birthday.banner) + '</span>' +
    '<span class="birthday-badge">' + esc(day.birthday.age) + '</span>' +
    '</button>' +
    '<div class="birthday-countdown" data-birthday-countdown="' + esc(day.birthday.date) + '">' +
    'Calculating birthday countdown...' +
    '</div>';
}

function dayCard(day) {
  return '<article class="day-card day-' + day.cls + '">' +
    '<div class="day-header"><span class="day-icon">' + day.icon + '</span> ' + esc(day.date) +
    '<span class="day-subtitle">' + esc(day.title) + '</span></div>' +
    birthdayBanner(day) +
    (day.link ? '<a class="tour-open" href="' + day.link[1] + '">' + day.link[0] + '</a>' : '') +
    (day.prep ? '<div class="prep-box"><h4>🎒 Pack for Today</h4><ul>' + day.prep.map(item => '<li>' + esc(item) + '</li>').join('') + '</ul></div>' : '') +
    '<div class="checklist">' + day.items.map((item, index) => {
      const id = day.n + '-' + (index + 1);
      return '<div class="checklist-item" data-id="' + id + '"><div class="checkbox"></div><div class="item-content">' +
        '<div class="item-time">' + esc(item[0]) + '</div>' +
        '<div class="item-text">' + esc(item[1]) + '</div>' +
        preBookedBadge(item[3]) +
        '<div class="item-details">' + esc(item[2]) + '</div>' +
        '<div class="checked-meta" data-meta="' + id + '"></div></div></div>';
    }).join('') + '</div>' +
    (day.booking ? '<div class="booking-info"><h4>📇 Booking Info</h4>' + day.booking.map(item => '<p>' + esc(item) + '</p>').join('') + '</div>' : '') +
    '</article>';
}

function renderDays() {
  const root = $('#dayCards');
  root.innerHTML = days.map(dayCard).join('');
  root.addEventListener('click', event => {
    if (event.target.closest('[data-birthday-confetti]')) {
      showBirthdayConfetti();
      return;
    }
    const item = event.target.closest('.checklist-item');
    if (item) toggleCloud(item.dataset.id);
  });
  paintCloud();
  renderBirthdayCountdowns();
  if (document.querySelector('[data-birthday-confetti]')) {
    setTimeout(showBirthdayConfetti, 700);
  }
}

function packKey(person, item) {
  return 'europe2026_pack_' + person + '_' + item.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

function renderPacking() {
  const root = $('#packingCards');
  root.innerHTML = orderedPacking().map(person =>
    '<article class="packing-person ' + person.className + '" data-person="' + person.id + '">' +
    '<div class="person-header"><span class="emoji">' + person.emoji + '</span><div class="person-info">' +
    '<span class="person-name">' + esc(person.name) + '</span><div class="person-bar"><div class="person-fill" data-pack-fill="' + person.id + '"></div></div></div>' +
    '<div class="person-progress" data-pack-progress="' + person.id + '">0/0 packed</div></div>' +
    Object.entries(person.categories).map(([category, items]) =>
      '<div class="packing-category"><div class="category-title">' + esc(category) + '</div>' +
      items.map(item =>
        '<div class="packing-item" data-key="' + packKey(person.id, item) + '" data-person="' + person.id + '">' +
        '<div class="pack-checkbox"></div><div class="pack-text">' + esc(item) + '</div></div>'
      ).join('') + '</div>'
    ).join('') + '</article>'
  ).join('');
  if (root.dataset.bound !== 'true') {
    root.dataset.bound = 'true';
    root.addEventListener('click', event => {
      const item = event.target.closest('.packing-item');
      if (!item) return;
      const key = item.dataset.key;
      const value = localStorage.getItem(key) !== 'true';
      localStorage.setItem(key, String(value));
      paintPacking();
    });
  }
  paintPacking();
}

function orderedPacking() {
  const familyIds = family.map(member => member.id);
  const selected = packing.find(person => person.id === store.member);
  const personalLists = packing.filter(person => familyIds.includes(person.id));
  const sharedLists = packing.filter(person => !familyIds.includes(person.id));
  const orderedPersonal = selected
    ? [selected].concat(personalLists.filter(person => person.id !== selected.id))
    : personalLists;
  return orderedPersonal.concat(sharedLists);
}

function paintPacking() {
  document.querySelectorAll('.packing-item').forEach(element => {
    element.classList.toggle('completed', localStorage.getItem(element.dataset.key) === 'true');
  });
  packing.forEach(person => {
    const elements = [...document.querySelectorAll('.packing-item[data-person="' + person.id + '"]')];
    const done = elements.filter(element => element.classList.contains('completed')).length;
    const total = elements.length;
    const text = document.querySelector('[data-pack-progress="' + person.id + '"]');
    const fill = document.querySelector('[data-pack-fill="' + person.id + '"]');
    if (text) text.textContent = person.name + ' ' + done + '/' + total + ' packed';
    if (fill) fill.style.width = total ? (done / total * 100) + '%' : '0%';
  });
}

function allItineraryIds() {
  return days.flatMap(day => day.items.map((_, index) => day.n + '-' + (index + 1)));
}

function paintCloud() {
  const total = allItineraryIds().length;
  let done = 0;
  document.querySelectorAll('.checklist-item,.tour-check-row').forEach(element => {
    const row = store.items[element.dataset.id];
    const completed = Boolean(row && row.completed);
    element.classList.toggle('completed', completed);
    if (completed && element.classList.contains('checklist-item')) done += 1;
    const meta = document.querySelector('[data-meta="' + element.dataset.id + '"]');
    if (meta) setCheckedMeta(meta, completed ? row : null);
  });
  const fill = $('#progressFill');
  const text = $('#progressText');
  if (fill) fill.style.width = total ? (done / total * 100) + '%' : '0%';
  if (text) text.textContent = done + ' of ' + total;
}

function setCheckedMeta(meta, row) {
  meta.className = 'checked-meta';
  if (!row || !row.completed) {
    meta.textContent = '';
    return;
  }
  const person = family.find(member => member.id === row.completed_by);
  if (person) meta.classList.add('checked-by-' + person.id);
  meta.textContent = metaText(row);
}

function metaText(row) {
  const person = family.find(member => member.id === row.completed_by);
  return '✓ ' + (person ? person.name : 'Family');
}

function celebrate() {
  const element = $('#celebration');
  if (!element) return;
  element.style.display = 'block';
  setTimeout(() => { element.style.display = 'none'; }, 850);
}

function showBirthdayConfetti() {
  const banner = document.querySelector('[data-birthday-confetti]');
  if (!banner) return;
  const burst = document.createElement('div');
  burst.className = 'birthday-confetti';
  burst.setAttribute('aria-hidden', 'true');
  burst.innerHTML = ['🎉', '✨', '🎂', '⭐', '🎈', '✨'].map((emoji, index) =>
    '<span style="--i:' + index + '">' + emoji + '</span>'
  ).join('');
  banner.appendChild(burst);
  setTimeout(() => { burst.remove(); }, 1400);
}

async function toggleCloud(id) {
  const current = Boolean(store.items[id] && store.items[id].completed);
  const next = !current;
  const member = activeMember();
  const row = {
    trip_slug: TRIP,
    item_id: id,
    completed: next,
    completed_by: next ? member.id : null,
    completed_at: next ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };
  store.items[id] = row;
  paintCloud();
  if (next) celebrate();
  try {
    await upsertRow(row);
  } catch (error) {
    queue(row);
    setStatus('Offline. Saved on this device and will retry.');
  }
}

async function upsertRow(row) {
  if (!client) throw new Error('No client');
  const { error } = await client.from('trip_checklist_items').upsert(row, { onConflict: 'trip_slug,item_id' });
  if (error) throw error;
  setStatus('Family sync live');
}

function queue(row) {
  store.offline = store.offline.filter(item => item.item_id !== row.item_id).concat(row);
  localStorage.setItem('europe2026_offline_queue', JSON.stringify(store.offline));
}

async function flushQueue() {
  if (!store.offline.length || !client || !navigator.onLine) return;
  const queueItems = [...store.offline];
  store.offline = [];
  localStorage.setItem('europe2026_offline_queue', '[]');
  for (const row of queueItems) {
    try {
      await upsertRow(row);
    } catch (error) {
      queue(row);
    }
  }
}

function setStatus(text) {
  const element = $('#syncStatus');
  if (element) element.textContent = text;
}

function renderCountdown() {
  const element = $('#countdownTimer');
  if (!element) return;
  const takeoff = new Date('2026-07-16T12:10:00-07:00');
  const diff = takeoff - Date.now();
  if (diff <= 0) {
    element.textContent = 'Trip is underway';
    return;
  }
  const daysLeft = Math.floor(diff / 86400000);
  const hoursLeft = Math.floor((diff % 86400000) / 3600000);
  element.textContent = daysLeft + ' days · ' + hoursLeft + ' hours until takeoff';
}

function isAthensBirthdayToday() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).reduce((value, part) => {
    value[part.type] = part.value;
    return value;
  }, {});
  return parts.year === '2026' && parts.month === '07' && parts.day === '17';
}

function renderBirthdayCountdowns() {
  document.querySelectorAll('[data-birthday-countdown]').forEach(element => {
    if (isAthensBirthdayToday()) {
      element.textContent = "🎂 It's Christian's 14th birthday today! 🎉";
      return;
    }
    const birthday = new Date(element.dataset.birthdayCountdown);
    const diff = birthday - Date.now();
    if (diff <= 0) {
      element.textContent = "🎂 It's Christian's 14th birthday today! 🎉";
      return;
    }
    const daysLeft = Math.floor(diff / 86400000);
    const hoursLeft = Math.floor((diff % 86400000) / 3600000);
    element.textContent = '🎂 Birthday countdown: ' + daysLeft + ' days · ' + hoursLeft + ' hours';
  });
}

async function initSupabase() {
  try {
    client = window.supabase.createClient(supabaseUrl, supabaseAnon);
    const { data, error } = await client.from('trip_checklist_items').select('*').eq('trip_slug', TRIP);
    if (error) throw error;
    (data || []).forEach(row => { store.items[row.item_id] = row; });
    paintCloud();
    setStatus('Family sync live');
    client.channel('trip_europe_2026_checklist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_checklist_items', filter: 'trip_slug=eq.' + TRIP }, payload => {
        const row = payload.new || payload.old;
        if (row && row.item_id) {
          store.items[row.item_id] = row;
          paintCloud();
        }
      })
      .subscribe();
    flushQueue();
  } catch (error) {
    setStatus('Family sync unavailable. Checks queue locally.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCountdown();
  setInterval(() => {
    renderCountdown();
    renderBirthdayCountdowns();
  }, 60000);
  renderMembers();
  renderDays();
  renderPacking();
  document.querySelector('.tab-nav').addEventListener('click', event => {
    const button = event.target.closest('[data-tab]');
    if (!button) return;
    document.querySelectorAll('.tab-btn').forEach(element => {
      element.classList.toggle('active', element === button);
    });
    document.querySelectorAll('.tab-content').forEach(element => {
      element.classList.toggle('active', element.id === button.dataset.tab);
    });
  });
  initSupabase();
  window.addEventListener('online', flushQueue);
});

window.EuropeTrip = { toggleCloud, paintCloud, store, metaText };
