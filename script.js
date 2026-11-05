'use strict';
const IG = 'https://www.instagram.com/h.b.uhas/';
const ORDER = ['menu', 'portfolio', 'samples', 'contact', 'comments'];
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const SKILLS = [
  { icon: 'fa-microphone-lines', title: 'Voice Modulation', brief: 'Low, high, human or not',
    text: "I do voices. Deep and gravelly, bright and squeaky, and a fair few that aren't human at all: animals, ghosts, cartoon sidekicks. Send me a script for an audiobook, a game or a video and I'll send back a few takes to pick from.",
    tags: ['Voiceover', 'Character voices', 'Audiobooks'], sample: 'Audio demo reel' },
  { icon: 'fa-feather-pointed', title: 'Creative Writing', brief: 'Stories and blogs',
    text: "Give me a mood, a one-line idea or a messy outline and I'll turn it into a story or a blog post. I've written fiction and plain how-to guides, so I can switch between the two without it sounding stiff.",
    tags: ['Blogs', 'Short stories', 'Made-to-order tales'], sample: 'Story excerpts' },
  { icon: 'fa-palette', title: 'Graphic Designing', brief: 'Ideas turned into art',
    text: "Tell me what you're picturing, even if it's vague, and I'll build it as digital art. Posters, thumbnails, stylised portraits. I keep tweaking until it looks like what you had in mind.",
    tags: ['Digital art', 'Posters', 'Thumbnails'], sample: 'Artwork showcase' },
  { icon: 'fa-hashtag', title: 'Social Media Handler', brief: 'Pages that stay active',
    text: "I look after the daily side of a page: captions that sound like a person wrote them, product descriptions, YouTube titles and a posting rhythm that suits your audience. I watch what gets reactions and adjust from there.",
    tags: ['Captions', 'Page handling', 'YouTube titles'], sample: 'Page and campaign work' },
  { icon: 'fa-display', title: 'PPT Making', brief: 'Slides people can follow',
    text: "Slides that make sense without me narrating every word. I turn rough notes into a tidy deck with a clear layout, readable text and one consistent look, whether it's for school, work or pitching an idea.",
    tags: ['Presentations', 'Pitch decks', 'Clean layouts'], sample: 'Slide deck samples' }
];

/* ---------- Tabs ---------- */
let tab = 'menu';
const deck = $('#deck');

function show(id) {
  if (!ORDER.includes(id)) id = 'menu';
  tab = id;
  $$('.content-section').forEach(s => s.classList.toggle('visible', s.id === id));
  $$('.nav-button').forEach(b => {
    const on = b.dataset.section === id;
    b.classList.toggle('active', on);
    if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  document.body.dataset.tab = id;
  if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
  scrollTo({ top: 0, behavior: 'instant' });
  spin(260);
  deck.classList.remove('dealt', 'dealing');
  if (id === 'portfolio') {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      deck.classList.add('dealing', 'dealt');
      setTimeout(() => deck.classList.remove('dealing'), 1400);
    }));
  }
}
$$('.nav-button').forEach(b => b.addEventListener('click', () => show(b.dataset.section)));
addEventListener('hashchange', () => show(location.hash.slice(1)));

/* ---------- Cards ---------- */
const face = s => `<span class="pip"><b>${s.title[0]}</b><i class="fas ${s.icon}"></i></span>
  <i class="fas ${s.icon} big"></i><span class="t">${s.title}</span><span class="b">${s.brief}</span>
  <span class="pip end"><b>${s.title[0]}</b><i class="fas ${s.icon}"></i></span>`;

deck.innerHTML = SKILLS.map((s, i) =>
  `<button type="button" class="card" style="--i:${i}" data-i="${i}" aria-label="Draw card: ${s.title}">${face(s)}</button>`).join('');

$('#samplesGrid').innerHTML = SKILLS.map(s =>
  `<a class="sample" href="${IG}" target="_blank" rel="noopener noreferrer" aria-label="${s.title} samples on Instagram (opens in a new tab)">
    <i class="fas ${s.icon}"></i><h3>${s.title}</h3><p>${s.sample}</p>
    <span class="go"><i class="fab fa-instagram"></i> h.b.uhas</span></a>`).join('');

const pick = $('#pick'), pickCard = $('#pickCard');
let opener = null, flipTimer = 0;

deck.addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (!c || !deck.classList.contains('dealt')) return;
  const s = SKILLS[+c.dataset.i];
  opener = c;
  $('#pickFront').innerHTML = face(s);
  $('#pickBack').innerHTML = `<button type="button" class="x" data-close aria-label="Close card"><i class="fas fa-xmark"></i></button>
    <i class="fas ${s.icon}"></i><h3>${s.title}</h3><p>${s.text}</p>
    <div class="tags">${s.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
  pickCard.classList.remove('flipped');
  pick.hidden = false;
  spin(180);
  flipTimer = setTimeout(() => { pickCard.classList.add('flipped'); $('[data-close]').focus(); }, 500);
});

function closePick() {
  if (pick.hidden) return;
  clearTimeout(flipTimer);
  pickCard.classList.remove('flipped');
  setTimeout(() => { pick.hidden = true; if (opener) opener.focus(); }, 350);
}
pick.addEventListener('click', e => { if (e.target === pick || e.target.closest('[data-close]')) closePick(); });

/* ---------- Scroll-driven sci-fi gear ---------- */
const NS = 'http://www.w3.org/2000/svg';
const gearEl = $('#gear');
const layers = [];
const pt = (a, r) => (r * Math.cos(a)).toFixed(1) + ',' + (r * Math.sin(a)).toFixed(1);

function segPath(k, N, T, r, R1, R2) {
  const A = 2 * Math.PI / N, a0 = k * A, s = A / T;
  let d = `M${pt(a0, r)}L${pt(a0, R1)}`;
  for (let t = 0; t < T; t++) {
    const b = a0 + t * s;
    d += `L${pt(b + s * .15, R1)}L${pt(b + s * .28, R2)}L${pt(b + s * .62, R2)}L${pt(b + s * .75, R1)}`;
  }
  return d + `L${pt(a0 + A, R1)}L${pt(a0 + A, r)}A${r} ${r} 0 0 0 ${pt(a0, r).replace(',', ' ')}Z`;
}
function addLayer(N, T, r, R1, R2, z, dir) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-110 -110 220 220');
  svg.classList.add('layer');
  const segs = [];
  for (let k = 0; k < N; k++) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', segPath(k, N, T, r, R1, R2));
    svg.append(p);
    segs.push([p, (k + .5) * 2 * Math.PI / N]);
  }
  gearEl.append(svg);
  layers.push({ svg, segs, z, dir, push: R1 * .4 });
}
addLayer(8, 3, 40, 84, 100, -40, 1);
addLayer(6, 2, 20, 50, 62, 10, -1.6);
addLayer(4, 1, 6, 24, 30, 60, 2.4);

const g = { cur: 0, target: 0, tx: 0, ty: 0, ttx: 0, tty: 0, run: false };
let lastY = scrollY;

function draw() {
  const open = (1 - Math.cos(g.cur * 0.0125)) / 2;
  gearEl.style.transform = `rotateY(${-58 + g.tx * 10}deg) rotateX(${-g.ty * 10}deg)`;
  for (const L of layers) {
    L.svg.style.transform = `translateZ(${L.z}px) rotate(${g.cur * L.dir}deg)`;
    for (const [p, a] of L.segs)
      p.setAttribute('transform', `translate(${(Math.cos(a) * open * L.push).toFixed(1)} ${(Math.sin(a) * open * L.push).toFixed(1)})`);
  }
}
function loop() {
  g.cur += (g.target - g.cur) * .08;
  g.tx += (g.ttx - g.tx) * .08;
  g.ty += (g.tty - g.ty) * .08;
  draw();
  if (Math.abs(g.target - g.cur) > .05 || Math.abs(g.ttx - g.tx) > .002 || Math.abs(g.tty - g.ty) > .002) requestAnimationFrame(loop);
  else g.run = false;
}
function kick() {
  if (REDUCE) { g.cur = g.target; draw(); return; }
  if (!g.run) { g.run = true; requestAnimationFrame(loop); }
}
function spin(n) { g.target += n; kick(); }

addEventListener('scroll', () => { g.target += (scrollY - lastY) * .5; lastY = scrollY; kick(); }, { passive: true });
addEventListener('wheel', e => {
  // On short pages there is nothing to scroll, so the wheel drives the gear directly.
  if (document.documentElement.scrollHeight <= innerHeight + 4) { g.target += e.deltaY * .3; kick(); }
}, { passive: true });

/* ---------- Pointer effects ---------- */
const profile = $('#profileCard');
addEventListener('pointermove', e => {
  document.body.style.setProperty('--mx', e.clientX + 'px');
  document.body.style.setProperty('--my', e.clientY + 'px');
  g.ttx = e.clientX / innerWidth - .5;
  g.tty = e.clientY / innerHeight - .5;
  kick();
  if (tab === 'menu' && !REDUCE) {
    const r = profile.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    const inside = Math.abs(px) < .6 && Math.abs(py) < .6;
    profile.style.setProperty('--ry', inside ? px * 8 + 'deg' : '0deg');
    profile.style.setProperty('--rx', inside ? -py * 8 + 'deg' : '0deg');
  }
});

/* ---------- Toast + copy ---------- */
const toastEl = $('#toast');
let toastTimer = 0;
function toast(msg, type = 'ok') {
  toastEl.textContent = msg;
  toastEl.className = 'toast show ' + (type === 'error' ? 'error' : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}
$$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); toast('Discord name copied'); }
  catch { toast('Copy failed. Discord: ' + b.dataset.copy, 'error'); }
}));

/* ---------- Messages ---------- */
let comments = [];
const KEY = 'portfolioComments';
try { comments = JSON.parse(localStorage.getItem(KEY)) || []; } catch { comments = []; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(comments)); } catch { /* storage unavailable */ } };
const esc = t => t.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);

const commentHTML = c => `<div class="comment"><div class="comment-header"><i class="fas fa-user-circle"></i> ${esc(c.user)}<small>${esc(c.timestamp)}</small></div>
  <p>${esc(c.msg)}</p><button type="button" class="like-btn" data-like="${c.id}" aria-label="Like this message"><i class="fas fa-heart"></i> ${c.likes}</button></div>`;

function renderComments() {
  const empty = t => `<div class="empty-state">${t}</div>`;
  $('#recent-comments').innerHTML = comments.slice(0, 5).map(commentHTML).join('') || empty('No messages yet. Be the first to write one.');
  $('#top-comments').innerHTML = [...comments].sort((a, b) => b.likes - a.likes).slice(0, 5).map(commentHTML).join('') || empty('Liked messages show up here.');
}
function submitComment() {
  const u = $('#user'), m = $('#message');
  const user = u.value.trim(), msg = m.value.trim();
  if (!user || !msg) return toast('Add your name and a message first.', 'error');
  comments.unshift({ id: Date.now(), user, msg, likes: 0, timestamp: new Date().toLocaleString() });
  save(); renderComments();
  u.value = m.value = '';
  toast('Message posted');
}
$('#send').addEventListener('click', submitComment);
$('#comments').addEventListener('click', e => {
  const b = e.target.closest('[data-like]');
  if (!b) return;
  const c = comments.find(x => x.id === +b.dataset.like);
  if (c) { c.likes++; save(); renderComments(); }
});
renderComments();

/* ---------- Keyboard ---------- */
addEventListener('keydown', e => {
  if (e.key === 'Escape') return closePick();
  if (e.key === 'Enter' && e.ctrlKey && tab === 'comments') return submitComment();
  if (!pick.hidden || /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
  const i = ORDER.indexOf(tab);
  if (e.key === 'ArrowLeft' && i > 0) show(ORDER[i - 1]);
  if (e.key === 'ArrowRight' && i < ORDER.length - 1) show(ORDER[i + 1]);
});

/* ---------- Init ---------- */
draw();
show(location.hash.slice(1));
