'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
const fmt = n => clp.format(Math.round(n || 0));
const fmtS = n => (n > 0 ? '+' : n < 0 ? '−' : '') + clp.format(Math.abs(Math.round(n || 0)));
const pad = n => String(n).padStart(2, '0');
const ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => ymd(new Date());
const ymOf = s => String(s || '').slice(0, 7);
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const monthLabel = ym => { const [y, m] = ym.split('-').map(Number); return cap(new Date(y, m - 1, 1).toLocaleDateString('es-CL', { month: 'long' })) + ' ' + y; };
const monthName = ym => { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('es-CL', { month: 'long' }); };
const dayLabel = s => { const [y, m, d] = s.split('-').map(Number); return cap(new Date(y, m - 1, d).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })); };
const shiftMonth = (ym, n) => { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + pad(d.getMonth() + 1); };
const digits = s => Number(String(s || '').replace(/\D/g, '')) || 0;
const num = n => n ? Number(n).toLocaleString('es-CL') : '';

const ICONS = {
  cart: 'M3 4h2.2l2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L19.2 8H6M9.5 19.5h.01M16.5 19.5h.01',
  utensils: 'M7 3v7a2 2 0 0 0 4 0V3M9 3v18M17 21V3c-2.2 1.2-3.5 3.8-3.5 6.5 0 2 1.2 3 3.5 3',
  home: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5',
  bolt: 'M13 2.5 5 13.5h6l-1 8 8-11h-6z',
  car: 'M5 16.5V13l1.6-4.5A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.5L19 13v3.5M3.5 13h17M5 16.5V19h2.5v-2.5M16.5 16.5V19H19v-2.5M7.5 15.5h.01M16.5 15.5h.01',
  person: 'M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M5 20a7 7 0 0 1 14 0',
  card: 'M3 6.5h18v11H3zM3 10.5h18M6.5 14.5h3',
  briefcase: 'M4 8h16v11H4zM9 8V5.5h6V8M4 13h16',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z',
  wallet: 'M3.5 7.5A2 2 0 0 1 5.5 5.5H17v3M3.5 7.5v10a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-8.5a1 1 0 0 0-1-1h-13a2 2 0 0 1-2-1.5M16 14h.01',
  send: 'M21 3 10.5 13.5M21 3l-6.5 18-4-8.5L2 8.5z',
  heart: 'M12 20s-7.5-4.6-9-9.6A4.8 4.8 0 0 1 12 7.2a4.8 4.8 0 0 1 9 3.2C19.5 15.4 12 20 12 20z',
  dots: 'M6 12h.01M12 12h.01M18 12h.01',
  banknote: 'M3 7h18v10H3zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M6.5 12h.01M17.5 12h.01',
  tag: 'M3.5 12.2V4.5h7.7l9 9a1.5 1.5 0 0 1 0 2.1l-5.6 5.6a1.5 1.5 0 0 1-2.1 0zM8 8.5h.01',
  repeat: 'M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5',
  swap: 'M7 8h12M15.5 4.5 19 8l-3.5 3.5M17 16H5M8.5 12.5 5 16l3.5 3.5',
  sliders: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 4.5v5M9 14.5v5',
  plus: 'M12 5v14M5 12h14',
  chevL: 'M14.5 6 8.5 12l6 6',
  chevR: 'M9.5 6l6 6-6 6',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-3.8-3.8',
  download: 'M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  bell: 'M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 21h4',
  calendar: 'M4 6.5h16v13H4zM4 10.5h16M8 4v4M16 4v4'
};
const ic = (n, c = '') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ICONS.dots}"/></svg>`;

const CAT_OUT = [
  { id: 'super', name: 'Supermercado', icon: 'cart', color: 'k6' },
  { id: 'comida', name: 'Comida fuera', icon: 'utensils', color: 'k5' },
  { id: 'vivienda', name: 'Vivienda y hogar', icon: 'home', color: 'k1' },
  { id: 'servicios', name: 'Servicios', icon: 'bolt', color: 'k7' },
  { id: 'transporte', name: 'Transporte', icon: 'car', color: 'k2' },
  { id: 'saul', name: 'Saúl', icon: 'person', color: 'k3' },
  { id: 'creditos', name: 'Créditos y tarjetas', icon: 'card', color: 'k8' },
  { id: 'negocio', name: 'Negocio', icon: 'briefcase', color: 'k10' },
  { id: 'ahorro', name: 'Ahorro', icon: 'wallet', color: 'k4' },
  { id: 'ocio', name: 'Ocio', icon: 'star', color: 'k9' },
  { id: 'remesas', name: 'Remesas', icon: 'send', color: 'k11' },
  { id: 'salud', name: 'Salud', icon: 'heart', color: 'k12' },
  { id: 'otros', name: 'Otros', icon: 'dots', color: 'k8' }
];
const CAT_IN = [
  { id: 'sueldo', name: 'Sueldo', icon: 'banknote', color: 'k6' },
  { id: 'ventas', name: 'Ventas', icon: 'tag', color: 'k2' },
  { id: 'reembolsos', name: 'Reembolsos', icon: 'repeat', color: 'k7' },
  { id: 'otrosi', name: 'Otros ingresos', icon: 'dots', color: 'k8' }
];
const CAT_X = [
  { id: 'transfer', name: 'Transferencia', icon: 'swap', color: 'k1' },
  { id: 'ajuste', name: 'Ajuste de saldo', icon: 'sliders', color: 'k8' }
];
const CATMAP = {};
[...CAT_OUT, ...CAT_IN, ...CAT_X].forEach(c => { CATMAP[c.id] = c; });
const catName = id => (CATMAP[id] && CATMAP[id].name) || 'Otros';
const catColor = id => (CATMAP[id] && CATMAP[id].color) || 'k8';
const catIcon = id => (CATMAP[id] && CATMAP[id].icon) || 'dots';

const S = {
  tab: 'home', month: today().slice(0, 7), allTime: false, monthSet: false,
  accounts: [], txs: [], budgets: {}, fixed: [], settings: { remind: 3, notify: false }, bsub: 'fx',
  mode: 'ready', err: null, fAcc: 'all', fType: 'all', q: '', lastAcc: ''
};
let deferredInstall = null, HIST = false;

const colorOf = a => /^k([1-9]|1[0-2])$/.test(a && a.color) ? a.color : 'k1';
const acct = id => S.accounts.find(a => a.id === id);
const acctName = id => (acct(id) && acct(id).name) || '—';

function effect(t, id) {
  if (t.type === 'ingreso') return t.account === id ? t.amount : 0;
  if (t.type === 'gasto') return t.account === id ? -t.amount : 0;
  if (t.type === 'transferencia') return (t.account === id ? -t.amount : 0) + (t.to === id ? t.amount : 0);
  if (t.type === 'ajuste') return t.account === id ? t.amount : 0;
  return 0;
}
const balance = id => S.txs.reduce((s, t) => s + effect(t, id), 0) + ((acct(id) && acct(id).initial) || 0);
const totalBalance = () => S.accounts.reduce((s, a) => s + balance(a.id), 0);
function stats(list) {
  let inc = 0, exp = 0;
  list.forEach(t => { if (t.type === 'ingreso') inc += t.amount; else if (t.type === 'gasto') exp += t.amount; });
  return { inc, exp };
}
const monthTxs = () => S.txs.filter(t => ymOf(t.date) === S.month);

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2800);
}

// ---------- Almacenamiento local (queda en este teléfono) ----------
const KEY = 'miscarteras.v1', KEY_BK = 'miscarteras.lastBackup', KEY_BAD = 'miscarteras.corrupt';
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
const newId = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const sortTxs = () => S.txs.sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order);
const sortAccs = () => S.accounts.sort((a, b) => (a.order || 0) - (b.order || 0));

function normTx(x, id) {
  return { id: id || x.id, type: ['gasto', 'ingreso', 'transferencia', 'ajuste'].includes(x.type) ? x.type : 'gasto',
    amount: Number(x.amount) || 0, description: String(x.description || ''), category: x.category || 'otros',
    account: x.account || '', to: x.to || '', date: /^\d{4}-\d{2}-\d{2}$/.test(x.date || '') ? x.date : today(),
    order: Number(x.order) || 0, approx: !!x.approx, fixedId: x.fixedId ? String(x.fixedId) : '', fixedMonth: /^\d{4}-\d{2}$/.test(x.fixedMonth || '') ? x.fixedMonth : '' };
}
function normAcc(a) {
  return { id: String(a.id), name: String(a.name || 'Cartera'), kind: String(a.kind || ''), color: /^k([1-9]|1[0-2])$/.test(a.color) ? a.color : 'k1',
    order: Number(a.order) || 0, initial: Number(a.initial) || 0 };
}
// Valida y normaliza datos (de la memoria local o de un respaldo). Devuelve null si no sirven.
function parseData(d) {
  if (!d || typeof d !== 'object' || !Array.isArray(d.accounts) || !Array.isArray(d.transactions)) return null;
  const accounts = d.accounts.filter(a => a && a.id).map(normAcc);
  const ids = new Set(accounts.map(a => a.id));
  const txs = d.transactions.filter(t => t && t.id && Number.isFinite(Number(t.amount))).map(t => normTx(t));
  const budgets = {};
  Object.entries(d.budgets || {}).forEach(([k, v]) => { const l = Number(v && v.limit) || 0; if (l > 0) budgets[k] = { limit: l }; });
  const fixed = (Array.isArray(d.fixed) ? d.fixed : []).filter(f => f && f.id).map(normFx);
  const st = d.settings || {};
  const settings = { remind: Number.isFinite(st.remind) ? Math.min(30, Math.max(0, st.remind)) : 3, notify: !!st.notify };
  return { accounts, txs, budgets, fixed, settings, orphans: txs.filter(t => !ids.has(t.account)).length };
}
function setData(p) {
  S.accounts = p.accounts; S.txs = p.txs; S.budgets = p.budgets; S.fixed = p.fixed; S.settings = p.settings; sortAccs(); sortTxs();
  if (S.txs.length && !S.txs.some(t => ymOf(t.date) === S.month)) S.month = ymOf(S.txs[0].date);
}
const snapshot = () => ({ app: 'mis-carteras', version: 1, accounts: S.accounts, transactions: S.txs, budgets: S.budgets, fixed: S.fixed, settings: S.settings });
const persist = () => lsSet(KEY, JSON.stringify(snapshot()));
function loadLocal() {
  const raw = lsGet(KEY);
  if (!raw) return;
  let p = null;
  try { p = parseData(JSON.parse(raw)); } catch (e) { p = null; }
  if (p) setData(p);
  else { lsSet(KEY_BAD, raw); S.mode = 'error'; }
}

const DB = {
  setAcc(id, d) {
    const o = normAcc({ ...d, id }), i = S.accounts.findIndex(a => a.id === id);
    if (i >= 0) S.accounts[i] = o; else S.accounts.push(o); sortAccs();
  },
  delAcc(id) { S.accounts = S.accounts.filter(a => a.id !== id); },
  setTx(id, d) {
    const o = normTx(d, id), i = S.txs.findIndex(t => t.id === id);
    if (i >= 0) S.txs[i] = o; else S.txs.push(o); sortTxs();
  },
  delTx(id) { S.txs = S.txs.filter(t => t.id !== id); },
  setBud(cat, d) { S.budgets[cat] = { limit: Number(d.limit) || 0 }; },
  delBud(cat) { delete S.budgets[cat]; },
  setFx(id, d) { const o = normFx({ ...d, id }), i = S.fixed.findIndex(f => f.id === id); if (i >= 0) S.fixed[i] = o; else S.fixed.push(o); },
  delFx(id) { S.fixed = S.fixed.filter(f => f.id !== id); }
};
// Aplica un cambio, lo guarda en el teléfono y vuelve a dibujar.
function write(fn, ok) {
  try { fn(); } catch (e) { toast('No se pudo guardar.'); return false; }
  const saved = persist();
  render();
  toast(saved ? (ok || '') : 'No se pudo guardar en el teléfono. Revisa el espacio o los permisos del navegador.');
  return true;
}
const lastBackup = () => Number(lsGet(KEY_BK)) || 0;
const backupDue = () => S.txs.length >= 5 && Date.now() - lastBackup() > 14 * 864e5;
const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

// ---------- Vistas ----------
function txInfo(t) {
  if (t.type === 'transferencia') return { k: 'k1', icon: 'swap', sub: acctName(t.account) + ' → ' + acctName(t.to), amt: fmt(t.amount), cls: '' };
  if (t.type === 'ajuste') return { k: 'k8', icon: 'sliders', sub: 'Ajuste de saldo · ' + acctName(t.account), amt: fmtS(t.amount), cls: '' };
  const sign = t.type === 'ingreso' ? 1 : -1;
  return { k: catColor(t.category), icon: catIcon(t.category), sub: catName(t.category) + ' · ' + acctName(t.account), amt: fmtS(sign * t.amount), cls: sign > 0 ? 'pos' : 'neg' };
}
function txRow(t) {
  const i = txInfo(t);
  return `<button class="tx" data-act="editTx" data-id="${esc(t.id)}">
    <span class="ico" style="--k:var(--${i.k})">${ic(i.icon)}</span>
    <span class="tx-main"><b>${esc(t.description || catName(t.category))}</b><small>${esc(i.sub)}${t.approx ? ' · fecha aprox.' : ''}</small></span>
    <span class="amt ${i.cls}">${i.amt}</span></button>`;
}
function monthSel(disabled, label) {
  return `<div class="monthsel"><button data-act="prevMonth" aria-label="Mes anterior" ${disabled ? 'disabled' : ''}>${ic('chevL')}</button><span>${esc(label || monthLabel(S.month))}</span><button data-act="nextMonth" aria-label="Mes siguiente" ${disabled ? 'disabled' : ''}>${ic('chevR')}</button></div>`;
}

function renderHero() {
  const el = $('#hero');
  const ok = S.mode === 'ready';
  const tot = ok ? fmt(totalBalance()) : '—';
  let h = '';
  if (S.tab === 'home') {
    const st = stats(monthTxs());
    h = `<div class="hero-in"><div class="hero-top"><span class="brand">Mis Carteras</span>${monthSel(false)}</div>
      <div><p class="hero-label">Saldo total en carteras</p><p class="hero-total">${tot}</p></div>
      <div class="hero-stats"><div><span>Ingresos de ${esc(monthName(S.month))}</span><b class="up">${ok ? '+' + fmt(st.inc) : '—'}</b></div>
      <div><span>Gastos de ${esc(monthName(S.month))}</span><b class="down">${ok ? '−' + fmt(st.exp) : '—'}</b></div></div></div>`;
  } else if (S.tab === 'tx') {
    h = `<div class="hero-in"><h1>Movimientos</h1><div class="hero-row">${monthSel(S.allTime, S.allTime ? 'Todo el historial' : '')}
      <button class="pill ${S.allTime ? 'on' : ''}" data-act="toggleAll" aria-pressed="${S.allTime}">Ver todo</button></div></div>`;
  } else if (S.tab === 'bud') {
    h = `<div class="hero-in"><h1>${S.bsub === 'fx' ? 'Pagos fijos' : 'Presupuestos'}</h1><div class="hero-row">${monthSel(false)}</div></div>`;
  } else {
    h = `<div class="hero-in"><h1>Carteras</h1><div><p class="hero-label">Dinero disponible en total</p><p class="hero-total">${tot}</p></div></div>`;
  }
  el.innerHTML = h;
}

function stateCard() {
  if (S.mode === 'error') return `<div class="card welcome"><h2>No pude leer tus datos</h2><p class="note">Los datos guardados en este teléfono están dañados. Se dejó una copia aparte para no perderlos. Si tienes un respaldo, puedes restaurarlo.</p><div class="actions"><button class="btn primary grow" data-act="importBackup">Restaurar respaldo</button><button class="btn grow" data-act="newAcc">Empezar de cero</button></div></div>`;
  if (!S.accounts.length) return `<div class="card welcome"><h2>¡Bienvenido!</h2><p class="note">Empieza creando tus carteras: los lugares donde guardas tu dinero.</p>
    <ul><li>Ej: Cuenta RUT, Mercado Pago, Efectivo, Tarjeta de crédito.</li><li>Puedes indicar cuánto dinero tiene cada una al crearla.</li><li>Después registra ingresos, gastos y transferencias con el botón naranja.</li></ul>
    <div class="actions"><button class="btn primary grow" data-act="newAcc">Crear mi primera cartera</button><button class="btn grow" data-act="importBackup">Restaurar respaldo</button></div></div>`;
  return '';
}

function donut(list) {
  const by = {};
  list.filter(t => t.type === 'gasto').forEach(t => { by[t.category] = (by[t.category] || 0) + t.amount; });
  const arr = Object.entries(by).map(([id, v]) => ({ id, v })).sort((a, b) => b.v - a.v);
  const total = arr.reduce((s, x) => s + x.v, 0);
  if (!total) return `<p class="empty">Sin gastos en este mes.</p>`;
  const top = arr.slice(0, 6);
  const rest = arr.slice(6).reduce((s, x) => s + x.v, 0);
  if (rest) top.push({ id: '_rest', v: rest });
  const R = 46, C = 2 * Math.PI * R; let off = 0, segs = '';
  top.forEach(x => {
    const len = x.v / total * C, gap = top.length > 1 ? 1.6 : 0;
    const col = x.id === '_rest' ? 'var(--k8)' : 'var(--' + catColor(x.id) + ')';
    segs += `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${col}" stroke-width="16" stroke-dasharray="${Math.max(len - gap, 0.5).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 60 60)"/>`;
    off += len;
  });
  const legend = top.map(x => {
    const col = x.id === '_rest' ? 'k8' : catColor(x.id);
    return `<div class="lg"><i style="--k:var(--${col})"></i><span>${x.id === '_rest' ? 'Otras categorías' : esc(catName(x.id))}</span><b>${fmt(x.v)} · ${Math.round(x.v / total * 100)}%</b></div>`;
  }).join('');
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 120 120" role="img" aria-label="Gastos por categoría">${segs}
    <text x="60" y="56" font-size="9.5" style="fill:var(--muted)">Gastos</text><text x="60" y="71" font-size="12.5" font-weight="700">${esc(fmt(total))}</text></svg>
    <div class="legend">${legend}</div></div>`;
}

function viewHome() {
  const accs = S.accounts.map(a => {
    const b = balance(a.id);
    return `<button class="acc" data-act="pickAcc" data-id="${esc(a.id)}"><span class="sq" style="--k:var(--${colorOf(a)})">${ic('wallet')}</span>
      <span class="acc-main"><b>${esc(a.name)}</b><small>${esc(a.kind || '')}</small></span><span class="acc-bal ${b < 0 ? 'neg' : ''}">${fmt(b)}</span></button>`;
  }).join('');
  const last = S.txs.slice(0, 6).map(txRow).join('');
  const payBox = payAlertHTML();
  const remind = backupDue() ? `<section class="card banner"><p class="note"><b>Haz un respaldo.</b> Tus datos viven solo en este teléfono y llevas más de 2 semanas sin respaldarlos.</p><div class="actions"><button class="btn primary grow" data-act="goAcc">Ir a respaldo</button></div></section>` : '';
  return payBox + remind + `<section class="card"><div class="sec-h"><h2>Mis carteras</h2><button class="link" data-act="goAcc">Administrar</button></div><div class="accs">${accs}</div></section>
    <section class="card"><div class="sec-h"><h2>Gastos por categoría</h2></div>${donut(monthTxs())}</section>
    <section><div class="sec-h"><h2>Últimos movimientos</h2><button class="link" data-act="goTx">Ver todos</button></div>
      ${last ? `<div class="list">${last}</div>` : `<div class="card"><p class="empty">Aún no hay movimientos. Toca el botón naranja para agregar el primero.</p></div>`}</section>`;
}

function filteredTxs() {
  const q = S.q.trim().toLowerCase();
  return S.txs.filter(t => {
    if (!S.allTime && ymOf(t.date) !== S.month) return false;
    if (S.fType !== 'all' && t.type !== S.fType) return false;
    if (S.fAcc !== 'all' && t.account !== S.fAcc && t.to !== S.fAcc) return false;
    if (q && !((t.description || '') + ' ' + catName(t.category)).toLowerCase().includes(q)) return false;
    return true;
  });
}
function txListHTML() {
  const list = filteredTxs();
  const st = stats(list);
  const sum = `<span>${list.length} movimiento${list.length === 1 ? '' : 's'}</span><span><b class="pos">${fmtS(st.inc)}</b> · <b class="neg">${fmtS(-st.exp)}</b></span>`;
  if (!list.length) return { sum, body: `<div class="card"><p class="empty">Sin movimientos para este filtro.</p></div>` };
  const m = new Map();
  list.forEach(t => { if (!m.has(t.date)) m.set(t.date, []); m.get(t.date).push(t); });
  const body = [...m.entries()].map(([d, arr]) => {
    const s = stats(arr), net = s.inc - s.exp;
    return `<div class="day"><div class="dayhead"><span>${esc(dayLabel(d))}</span><span>${net ? fmtS(net) : ''}</span></div><div class="list">${arr.map(txRow).join('')}</div></div>`;
  }).join('');
  return { sum, body: `<div class="days">${body}</div>` };
}
function refreshTxList() {
  const r = txListHTML();
  if ($('#txList')) $('#txList').innerHTML = r.body;
  if ($('#txSum')) $('#txSum').innerHTML = r.sum;
}
function viewTx() {
  const chips = [['all', 'Todas']].concat(S.accounts.map(a => [a.id, a.name]))
    .map(([id, n]) => `<button class="chip ${S.fAcc === id ? 'on' : ''}" data-act="fAcc" data-v="${esc(id)}" aria-pressed="${S.fAcc === id}">${esc(n)}</button>`).join('');
  const types = [['all', 'Todo'], ['ingreso', 'Ingresos'], ['gasto', 'Gastos'], ['transferencia', 'Traspasos']]
    .map(([v, n]) => `<button class="${S.fType === v ? 'on' : ''}" data-act="fType" data-v="${v}" aria-pressed="${S.fType === v}">${n}</button>`).join('');
  const r = txListHTML();
  return `<div class="filters"><label class="search">${ic('search')}<input id="qInput" type="search" placeholder="Buscar movimiento" value="${esc(S.q)}" autocomplete="off"></label>
    <div class="chips" role="group" aria-label="Cartera">${chips}</div><div class="seg">${types}</div></div>
    <div class="summary" id="txSum">${r.sum}</div><div id="txList">${r.body}</div>`;
}

function viewBudgetsOnly() {
  const spent = {};
  S.txs.forEach(t => { if (t.type === 'gasto' && ymOf(t.date) === S.month) spent[t.category] = (spent[t.category] || 0) + t.amount; });
  const rows = [];
  CAT_OUT.forEach(c => { const b = S.budgets[c.id], sp = spent[c.id] || 0; if (b || sp > 0) rows.push({ c, limit: b ? b.limit : 0, sp, has: !!b }); });
  rows.sort((a, b) => (b.has - a.has) || (b.sp - a.sp));
  const withB = rows.filter(r => r.has);
  const tl = withB.reduce((s, r) => s + r.limit, 0), ts = withB.reduce((s, r) => s + r.sp, 0);
  let sum = '';
  if (tl > 0) {
    const pct = Math.min(100, Math.round(ts / tl * 100));
    sum = `<section class="card bsum"><div class="bsum-nums"><div><span>Presupuestado</span><b>${fmt(tl)}</b></div><div><span>Gastado</span><b>${fmt(ts)}</b></div>
      <div><span>${ts > tl ? 'Excedido' : 'Disponible'}</span><b class="${ts > tl ? 'neg' : 'pos'}">${fmt(Math.abs(tl - ts))}</b></div></div>
      <span class="bar ${ts > tl ? 'over' : ''}"><i style="width:${pct}%"></i></span></section>`;
  }
  const list = rows.map(r => {
    const ico = `<span class="ico" style="--k:var(--${r.c.color})">${ic(r.c.icon)}</span>`;
    if (!r.has) return `<button class="brow" data-act="editBud" data-id="${r.c.id}">${ico}<span class="brow-main"><span class="brow-top"><b>${esc(r.c.name)}</b><span class="link">Fijar límite</span></span><small>Sin límite · gastado ${fmt(r.sp)}</small></span></button>`;
    const pct = Math.round(r.sp / r.limit * 100), over = r.sp > r.limit;
    return `<button class="brow" data-act="editBud" data-id="${r.c.id}">${ico}<span class="brow-main"><span class="brow-top"><b>${esc(r.c.name)}</b><span class="brow-nums">${fmt(r.sp)} / ${fmt(r.limit)}</span></span>
      <span class="bar ${over ? 'over' : ''}"><i style="width:${Math.min(100, pct)}%"></i></span>
      <small>${over ? 'Excedido por ' + fmt(r.sp - r.limit) : 'Quedan ' + fmt(r.limit - r.sp)} · ${pct}%</small></span></button>`;
  }).join('');
  return sum + `<section class="card"><div class="sec-h"><h2>Por categoría</h2><button class="link" data-act="newBud">Agregar</button></div>
    ${list ? `<div class="brows">${list}</div>` : `<p class="empty">Sin gastos ni presupuestos en este mes. Define un límite mensual por categoría con “Agregar”.</p>`}</section>`;
}

function viewAccounts() {
  const cards = S.accounts.map(a => {
    const b = balance(a.id); let ein = 0, eout = 0;
    S.txs.forEach(t => {
      if (ymOf(t.date) !== S.month) return;
      if (t.type === 'ingreso' && t.account === a.id) ein += t.amount;
      else if (t.type === 'gasto' && t.account === a.id) eout += t.amount;
      else if (t.type === 'transferencia') { if (t.account === a.id) eout += t.amount; if (t.to === a.id) ein += t.amount; }
    });
    return `<article class="card acard"><div class="acard-top"><span class="sq" style="--k:var(--${colorOf(a)})">${ic('wallet')}</span>
      <div class="acc-main"><b>${esc(a.name)}</b><small>${esc(a.kind || '')}</small></div>
      <button class="iconbtn" data-act="editAcc" data-id="${esc(a.id)}" aria-label="Editar ${esc(a.name)}">${ic('edit')}</button></div>
      <p class="acard-bal ${b < 0 ? 'neg' : ''}">${fmt(b)}</p>
      <div class="acard-m"><span>Entradas en ${esc(monthName(S.month))}: <b class="pos">${fmtS(ein)}</b></span><span>Salidas: <b class="neg">${fmtS(-eout)}</b></span></div>
      <div class="actions"><button class="btn" data-act="adjAcc" data-id="${esc(a.id)}">Ajustar saldo</button><button class="btn" data-act="pickAcc" data-id="${esc(a.id)}">Ver movimientos</button></div></article>`;
  }).join('');
  const bk = lastBackup();
  const when = bk ? 'Último respaldo: ' + new Date(bk).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }) + '.' : 'Aún no has hecho ningún respaldo.';
  const canShare = !!(navigator.canShare && navigator.share);
  const inst = deferredInstall && !isStandalone() ? `<section class="card banner"><p class="note"><b>Instala la app.</b> Así se abre a pantalla completa desde tu pantalla de inicio.</p><div class="actions"><button class="btn primary grow" data-act="installApp">Instalar en el teléfono</button></div></section>` : '';
  return cards + `<div class="actions"><button class="btn grow" data-act="newAcc">Nueva cartera</button></div>${inst}
    <section class="card"><div class="sec-h"><h2>Respaldo de datos</h2></div>
    <p class="note">Tus datos se guardan solo en este teléfono. Si borras los datos del navegador o cambias de teléfono, se pierden: guarda un respaldo de vez en cuando. ${esc(when)}</p>
    <div class="actions" style="margin-top:12px"><button class="btn grow" data-act="exportBackup">${ic('download')} Guardar respaldo</button>${canShare ? `<button class="btn grow" data-act="shareBackup">Compartir respaldo</button>` : ''}</div>
    <div class="actions" style="margin-top:10px"><button class="btn grow" data-act="importBackup">Restaurar respaldo</button><button class="btn grow" data-act="exportCsv">Exportar CSV</button></div>
    <p class="hint" style="margin-top:10px">El respaldo se guarda en Descargas. Compártelo a Drive o WhatsApp para tenerlo a salvo fuera del teléfono.</p></section>`;
}

function renderView() {
  const st = stateCard();
  let h = st;
  if (!st) h = S.tab === 'home' ? viewHome() : S.tab === 'tx' ? viewTx() : S.tab === 'bud' ? viewBud() : viewAccounts();
  $('#view').innerHTML = h;
}
function render() {
  const f = document.activeElement, wasQ = f && f.id === 'qInput', pos = wasQ ? f.selectionStart : 0;
  renderHero(); renderView();
  const nAl = S.mode === 'ready' ? alerts().length : 0, dot = $('#payDot');
  if (dot) { dot.hidden = !nAl; dot.textContent = nAl > 9 ? '9+' : String(nAl); }
  $$('.tab').forEach(b => b.setAttribute('aria-current', b.dataset.tab === S.tab ? 'page' : 'false'));
  if (wasQ && $('#qInput')) { const q = $('#qInput'); q.focus(); try { q.setSelectionRange(pos, pos); } catch (e) {} }
}

// ---------- Hojas (formularios) ----------
let SH = null, ADJ = null, ACC = null, BUD = null, RST = null, FX = null, PAY = null;

function openShell(title, body) {
  $('#sheetRoot').innerHTML = `<div class="overlay" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shTitle">
    <div class="sh-head"><h3 id="shTitle">${esc(title)}</h3><button class="iconbtn" data-act="closeSheet" aria-label="Cerrar">${ic('close')}</button></div>${body}</div>`;
  document.body.classList.add('no-scroll');
  if (!HIST) { try { history.pushState({ sheet: 1 }, ''); HIST = true; } catch (e) {} }
}
function closeSheet(fromPop) {
  $('#sheetRoot').innerHTML = ''; document.body.classList.remove('no-scroll');
  SH = ADJ = ACC = BUD = RST = FX = PAY = null;
  if (HIST) { HIST = false; if (fromPop !== true) { try { history.back(); } catch (e) {} } }
}
const accOptions = (sel, blank) => (blank ? `<option value="">${blank}</option>` : '') +
  S.accounts.map(a => `<option value="${esc(a.id)}" ${a.id === sel ? 'selected' : ''}>${esc(a.name)}</option>`).join('');
const moneyField = (id, val, label) => `<label class="field"><span>${label}</span><div class="money"><span>$</span><input id="${id}" inputmode="numeric" autocomplete="off" placeholder="0" value="${num(val)}"></div></label>`;

function openTx(id) {
  const t = id ? S.txs.find(x => x.id === id) : null;
  if (id && !t) return;
  if (!S.accounts.length) { toast('Crea una cartera primero.'); return; }
  SH = t
    ? { mode: 'edit', id: t.id, type: t.type, amount: Math.abs(t.amount), sign: t.amount < 0 ? -1 : 1, desc: t.description, cat: t.category, acc: t.account, to: t.to, date: t.date, origDate: t.date, order: t.order, approx: t.approx, fixedId: t.fixedId, fixedMonth: t.fixedMonth, tab: 'manual' }
    : { mode: 'new', type: 'gasto', amount: 0, sign: 1, desc: '', cat: '', acc: acct(S.lastAcc) ? S.lastAcc : S.accounts[0].id, to: '', date: today(), tab: 'manual' };
  renderTxSheet();
  if (SH.mode === 'new') setTimeout(() => { const a = $('#fAmount'); if (a) a.focus(); }, 60);
}
function captureTx() {
  if (!SH) return;
  const g = i => document.getElementById(i);
  if (g('fAmount')) SH.amount = digits(g('fAmount').value);
  if (g('fDesc')) SH.desc = g('fDesc').value;
  if (g('fAcc')) SH.acc = g('fAcc').value;
  if (g('fTo')) SH.to = g('fTo').value;
  if (g('fDate')) SH.date = g('fDate').value;
}
function renderTxSheet() {
  const s = SH, edit = s.mode === 'edit';
  const title = edit ? (s.type === 'ajuste' ? 'Ajuste de saldo' : 'Editar movimiento') : 'Nuevo movimiento';
  openShell(title, manualHTML());
}
function manualHTML() {
  const s = SH, edit = s.mode === 'edit', adj = s.type === 'ajuste', tr = s.type === 'transferencia';
  if (tr && (!s.to || s.to === s.acc)) { const o = S.accounts.find(a => a.id !== s.acc); s.to = o ? o.id : ''; }
  let h = '';
  if (adj) {
    h += `<div class="seg"><button class="${s.sign > 0 ? 'on' : ''}" data-act="adjSign" data-v="1">Sumar al saldo</button><button class="${s.sign < 0 ? 'on' : ''}" data-act="adjSign" data-v="-1">Restar del saldo</button></div>`;
  } else {
    h += `<div class="seg">${[['gasto', 'Gasto'], ['ingreso', 'Ingreso'], ['transferencia', 'Transferencia']]
      .map(([v, n]) => `<button class="${s.type === v ? 'on' : ''}" data-act="txType" data-v="${v}" aria-pressed="${s.type === v}">${n}</button>`).join('')}</div>`;
  }
  h += moneyField('fAmount', s.amount, 'Monto');
  h += `<label class="field"><span>Descripción</span><input id="fDesc" class="inp" maxlength="120" placeholder="Ej: pan y bebida" value="${esc(s.desc)}"></label>`;
  if (!adj && !tr) {
    const list = s.type === 'ingreso' ? CAT_IN : CAT_OUT;
    h += `<div class="field"><span>Categoría</span><div class="cats">${list.map(c => `<button type="button" class="cat ${s.cat === c.id ? 'on' : ''}" data-act="catPick" data-id="${c.id}" aria-pressed="${s.cat === c.id}"><span class="ico" style="--k:var(--${c.color})">${ic(c.icon)}</span><span>${esc(c.name)}</span></button>`).join('')}</div></div>`;
  }
  h += `<label class="field"><span>${tr ? 'Desde' : 'Cartera'}</span><select id="fAcc" class="inp">${accOptions(s.acc)}</select></label>`;
  if (tr) h += `<label class="field"><span>Hacia</span><select id="fTo" class="inp">${accOptions(s.to)}</select></label>`;
  h += `<label class="field"><span>Fecha</span><input id="fDate" type="date" class="inp" value="${esc(s.date)}"></label>`;
  if (s.approx) h += `<p class="note">La fecha de este movimiento es aproximada. Corrígela si la conoces.</p>`;
  h += `<div class="actions">${edit ? `<button class="btn danger" data-act="delTx">Eliminar</button>` : ''}<button class="btn primary grow" data-act="saveTx">Guardar</button></div>`;
  return h;
}
function saveTx() {
  captureTx();
  const s = SH;
  if (!(s.amount > 0)) return toast('Ingresa un monto mayor a 0.');
  if (!s.acc) return toast('Elige una cartera.');
  if (s.type === 'transferencia' && (!s.to || s.to === s.acc)) return toast('Elige una cartera de destino distinta.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.date)) return toast('Elige una fecha.');
  const cat = s.type === 'transferencia' ? 'transfer' : s.type === 'ajuste' ? 'ajuste' : (s.cat || (s.type === 'ingreso' ? 'otrosi' : 'otros'));
  const id = s.mode === 'edit' ? s.id : newId('t');
  const doc = { type: s.type, amount: s.type === 'ajuste' ? s.sign * s.amount : s.amount, description: s.desc.trim() || catName(cat),
    category: cat, account: s.acc, date: s.date, order: s.order || Date.now() };
  if (s.type === 'transferencia') doc.to = s.to;
  if (s.approx && s.date === s.origDate) doc.approx = true;
  if (s.fixedId) { doc.fixedId = s.fixedId; doc.fixedMonth = s.fixedMonth; }
  S.lastAcc = s.acc;
  if (write(() => DB.setTx(id, doc), 'Guardado')) closeSheet();
}


// ---------- Ajuste de saldo ----------
function openAdjust(id) {
  const a = acct(id); if (!a) return;
  ADJ = { id };
  openShell('Ajustar saldo', `<p class="note">${esc(a.name)}: saldo actual <b>${fmt(balance(id))}</b>. Ingresa el saldo real y se registra la diferencia como ajuste.</p>
    ${moneyField('aReal', 0, 'Saldo real')}<p id="aDiff" class="note"></p>
    <div class="actions"><button class="btn primary grow" data-act="saveAdj">Guardar ajuste</button></div>`);
}
function updateAdjDiff() {
  const el = $('#aReal'), out = $('#aDiff'); if (!el || !out || !ADJ) return;
  if (el.value === '') { out.textContent = ''; return; }
  const d = digits(el.value) - balance(ADJ.id);
  out.textContent = d === 0 ? 'El saldo ya coincide.' : 'Diferencia a registrar: ' + fmtS(d);
}
function saveAdj() {
  const el = $('#aReal'); if (!el || el.value === '') return toast('Ingresa el saldo real.');
  const d = digits(el.value) - balance(ADJ.id);
  if (d === 0) { toast('El saldo ya coincide.'); closeSheet(); return; }
  const id = newId('t');
  const doc = { type: 'ajuste', amount: d, description: 'Ajuste de saldo', category: 'ajuste', account: ADJ.id, date: today(), order: Date.now() };
  if (write(() => DB.setTx(id, doc), 'Saldo ajustado')) closeSheet();
}

// ---------- Carteras ----------
function accountHTML() {
  const sw = Array.from({ length: 12 }, (_, i) => 'k' + (i + 1)).map(k => `<button type="button" class="sw ${ACC.color === k ? 'on' : ''}" style="--k:var(--${k})" data-act="pickColor" data-v="${k}" aria-label="Color ${k.slice(1)}" aria-pressed="${ACC.color === k}"></button>`).join('');
  return `<label class="field"><span>Nombre</span><input id="aName" class="inp" maxlength="40" placeholder="Ej: Cuenta RUT" value="${esc(ACC.name)}"></label>
    <label class="field"><span>Tipo o banco</span><input id="aKind" class="inp" maxlength="40" placeholder="Ej: BancoEstado, Efectivo" value="${esc(ACC.kind)}"></label>
    ${ACC.id ? '' : moneyField('aInit', 0, 'Saldo inicial (opcional)')}
    <div class="field"><span>Color</span><div class="sw-row">${sw}</div></div>
    <div class="actions">${ACC.id ? `<button class="btn danger" data-act="delAcc">Eliminar</button>` : ''}<button class="btn primary grow" data-act="saveAcc">Guardar</button></div>`;
}
function openAccount(id) {
  const a = id ? acct(id) : null;
  ACC = { id: a ? a.id : null, name: a ? a.name : '', kind: a ? (a.kind || '') : '', color: a ? colorOf(a) : 'k1', initial: a ? (a.initial || 0) : 0, order: a ? a.order : null };
  openShell(a ? 'Editar cartera' : 'Nueva cartera', accountHTML());
}
function saveAcc() {
  ACC.name = $('#aName').value.trim(); ACC.kind = $('#aKind').value.trim();
  if (!ACC.name) return toast('Escribe un nombre.');
  const id = ACC.id || newId('c');
  if (!ACC.id) ACC.initial = $('#aInit') ? digits($('#aInit').value) : 0;
  const order = ACC.order != null ? ACC.order : S.accounts.reduce((m, a) => Math.max(m, a.order || 0), 0) + 1;
  const doc = { name: ACC.name, kind: ACC.kind, color: ACC.color, order, initial: ACC.initial || 0 };
  if (write(() => DB.setAcc(id, doc), 'Cartera guardada')) closeSheet();
}

// ---------- Presupuestos ----------
function openBudget(cat) {
  BUD = { cat: cat || '', del: false };
  const cur = cat && S.budgets[cat];
  const opts = CAT_OUT.map(c => `<option value="${c.id}" ${c.id === BUD.cat ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  openShell(cur ? 'Editar presupuesto' : 'Presupuesto mensual', `<label class="field"><span>Categoría</span><select id="bCat" class="inp" ${cur ? 'disabled' : ''}>${opts}</select></label>
    ${moneyField('bLimit', cur ? cur.limit : 0, 'Límite mensual')}
    <div class="actions">${cur ? `<button class="btn danger" data-act="delBud">Quitar</button>` : ''}<button class="btn primary grow" data-act="saveBud">Guardar</button></div>`);
}
function saveBud() {
  const cat = $('#bCat').value, limit = digits($('#bLimit').value);
  if (!(limit > 0)) return toast('Ingresa un límite mayor a 0.');
  if (write(() => DB.setBud(cat, { limit }), 'Presupuesto guardado')) closeSheet();
}

// ---------- Exportar / respaldo ----------
function saveFile(name, text, mime) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function exportCsv() {
  const q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const rows = [['Fecha', 'Tipo', 'Monto', 'Categoría', 'Descripción', 'Cuenta', 'Destino'].map(q).join(';')];
  S.txs.slice().reverse().forEach(t => rows.push([t.date, t.type, t.amount, catName(t.category), t.description, acctName(t.account), t.to ? acctName(t.to) : ''].map(q).join(';')));
  saveFile('movimientos-mis-carteras.csv', '﻿' + rows.join('\n'), 'text/csv'); toast('CSV guardado en Descargas');
}
const backupName = () => 'respaldo-mis-carteras-' + today() + '.json';
const backupText = () => JSON.stringify({ ...snapshot(), exportedAt: new Date().toISOString() }, null, 1);
function exportBackup() {
  saveFile(backupName(), backupText(), 'application/json'); lsSet(KEY_BK, String(Date.now()));
  toast('Respaldo guardado en Descargas'); render();
}
async function shareBackup() {
  try {
    const f = new File([backupText()], backupName(), { type: 'application/json' });
    if (!navigator.canShare || !navigator.canShare({ files: [f] })) return exportBackup();
    await navigator.share({ files: [f], title: 'Respaldo Mis Carteras' });
    lsSet(KEY_BK, String(Date.now())); render();
  } catch (e) { if (!e || e.name !== 'AbortError') toast('No se pudo compartir. Usa “Guardar respaldo”.'); }
}
function openRestore(p, fileName) {
  RST = p;
  openShell('Restaurar respaldo', `<p class="note">Archivo: <b>${esc(fileName)}</b><br>Contiene ${p.accounts.length} cartera${p.accounts.length === 1 ? '' : 's'} y ${p.txs.length} movimiento${p.txs.length === 1 ? '' : 's'}.</p>
    <p class="note"><b>Esto reemplaza todo lo que hay ahora en la app.</b> Si quieres conservarlo, guarda antes un respaldo.</p>
    <div class="actions"><button class="btn grow" data-act="closeSheet">Cancelar</button><button class="btn primary grow" data-act="doRestore">Restaurar</button></div>`);
}
function doRestore() {
  const p = RST; if (!p) return;
  setData(p); S.mode = 'ready'; S.fAcc = 'all'; S.fType = 'all'; S.q = '';
  if (!persist()) toast('No se pudo guardar en el teléfono.'); else toast('Respaldo restaurado');
  closeSheet(); render();
}
function onPickBackup(file) {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    let p = null;
    try { p = parseData(JSON.parse(String(r.result))); } catch (e) { p = null; }
    if (!p) return toast('Ese archivo no es un respaldo válido.');
    openRestore(p, file.name);
  };
  r.onerror = () => toast('No se pudo leer el archivo.');
  r.readAsText(file);
}

// ---------- Eventos ----------
const confirmTwice = (el, flag, owner, label) => { if (owner[flag]) return true; owner[flag] = true; el.textContent = label; return false; };
const goTab = t => { S.tab = t; render(); window.scrollTo(0, 0); };
const ACTIONS = {
  openNew: () => openTx(),
  editTx: el => { const t = S.txs.find(x => x.id === el.dataset.id); if (t) openTx(t.id); },
  prevMonth: () => { S.month = shiftMonth(S.month, -1); render(); },
  nextMonth: () => { S.month = shiftMonth(S.month, 1); render(); },
  toggleAll: () => { S.allTime = !S.allTime; render(); },
  pickAcc: el => { S.fAcc = el.dataset.id; S.allTime = true; S.fType = 'all'; S.q = ''; goTab('tx'); },
  goAcc: () => goTab('acc'),
  goTx: () => { S.fAcc = 'all'; S.fType = 'all'; S.q = ''; goTab('tx'); },
  fAcc: el => { S.fAcc = el.dataset.v; render(); },
  fType: el => { S.fType = el.dataset.v; render(); },
  newAcc: () => openAccount(),
  editAcc: el => openAccount(el.dataset.id),
  adjAcc: el => openAdjust(el.dataset.id),
  newBud: () => openBudget(),
  editBud: el => openBudget(el.dataset.id),
  bSub: el => { S.bsub = el.dataset.v; render(); },
  goPay: () => { S.bsub = 'fx'; S.month = today().slice(0, 7); goTab('bud'); },
  newFx: () => openFx(),
  editFx: el => openFx(el.dataset.id),
  saveFx: () => saveFx(),
  delFx: el => { if (!confirmTwice(el, 'del', FX, 'Toca de nuevo para eliminar')) return; if (write(() => DB.delFx(FX.id), 'Pago fijo eliminado')) closeSheet(); },
  payFx: el => openPay(el.dataset.id, el.dataset.ym),
  doPay: () => doPay(),
  undoPay: el => { if (!confirmTwice(el, 'del', PAY, 'Toca de nuevo para desmarcar')) return; const id = PAY.tx.id; if (write(() => DB.delTx(id), 'Pago desmarcado')) closeSheet(); },
  notifOn: () => notifOn(),
  notifOff: () => { S.settings.notify = false; persist(); render(); toast('Notificaciones desactivadas'); },
  exportCsv: () => exportCsv(),
  exportBackup: () => exportBackup(),
  shareBackup: () => shareBackup(),
  importBackup: () => { const f = $('#impFile'); if (f) { f.value = ''; f.click(); } },
  doRestore: () => doRestore(),
  installApp: async () => { if (!deferredInstall) return; deferredInstall.prompt(); try { await deferredInstall.userChoice; } catch (e) {} deferredInstall = null; render(); },
  closeSheet: () => closeSheet(),
  adjSign: el => { captureTx(); SH.sign = Number(el.dataset.v); renderTxSheet(); },
  txType: el => {
    captureTx(); SH.type = el.dataset.v;
    const list = SH.type === 'ingreso' ? CAT_IN : CAT_OUT;
    if (!list.some(c => c.id === SH.cat)) SH.cat = '';
    renderTxSheet();
  },
  catPick: el => { SH.cat = el.dataset.id; $$('.cat').forEach(b => { const on = b === el; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); },
  saveTx: () => saveTx(),
  delTx: el => {
    if (!confirmTwice(el, 'confirmDel', SH, 'Toca de nuevo para eliminar')) return;
    if (write(() => DB.delTx(SH.id), 'Movimiento eliminado')) closeSheet();
  },
  saveAdj: () => saveAdj(),
  pickColor: el => { ACC.color = el.dataset.v; $$('.sw').forEach(b => { const on = b === el; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); },
  saveAcc: () => saveAcc(),
  delAcc: el => {
    if (S.txs.some(t => t.account === ACC.id || t.to === ACC.id)) return toast('Esta cartera tiene movimientos y no se puede eliminar.');
    if (!confirmTwice(el, 'del', ACC, 'Toca de nuevo para eliminar')) return;
    if (write(() => DB.delAcc(ACC.id), 'Cartera eliminada')) closeSheet();
  },
  saveBud: () => saveBud(),
  delBud: el => {
    if (!confirmTwice(el, 'del', BUD, 'Toca de nuevo para quitar')) return;
    if (write(() => DB.delBud(BUD.cat), 'Presupuesto quitado')) closeSheet();
  }
};
document.addEventListener('click', e => {
  const tb = e.target.closest('[data-tab]');
  if (tb) { goTab(tb.dataset.tab); return; }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = ACTIONS[el.dataset.act]; if (fn) fn(el, e);
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.matches && t.matches('.money input')) {
    const d = digits(t.value); t.value = d ? d.toLocaleString('es-CL') : '';
    if (t.id === 'aReal') updateAdjDiff();
  } else if (t.id === 'qInput') { S.q = t.value; refreshTxList(); }
});
document.addEventListener('change', e => {
  if (e.target && e.target.id === 'remindSel') { S.settings.remind = Number(e.target.value) || 0; persist(); render(); return; }
  if (e.target && e.target.id === 'impFile') onPickBackup(e.target.files && e.target.files[0]);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#sheetRoot').firstChild) closeSheet(); });


// ---------- Pagos fijos y recordatorios ----------
function normFx(f) {
  const ym = v => /^\d{4}-\d{2}$/.test(v || '') ? v : '';
  return { id: String(f.id), name: String(f.name || 'Pago'), amount: Number(f.amount) || 0, category: f.category || 'otros', account: f.account || '',
    day: Math.min(31, Math.max(1, Math.round(Number(f.day)) || 1)), remind: (f.remind === '' || f.remind == null || !Number.isFinite(Number(f.remind))) ? null : Math.min(30, Math.max(0, Number(f.remind))),
    from: ym(f.from) || today().slice(0, 7), until: ym(f.until), order: Number(f.order) || 0 };
}
const daysIn = ym => { const [y, m] = ym.split('-').map(Number); return new Date(y, m, 0).getDate(); };
const dueDate = (f, ym) => ym + '-' + pad(Math.min(f.day, daysIn(ym)));
const dayDiff = (a, b) => Math.round((new Date(a + 'T00:00:00') - new Date(b + 'T00:00:00')) / 864e5);
const fxActive = (f, ym) => ym >= f.from && (!f.until || ym <= f.until);
const paidTx = (f, ym) => S.txs.find(t => t.fixedId === f.id && t.fixedMonth === ym);
const remindOf = f => f.remind != null ? f.remind : S.settings.remind;
const shortDate = d => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }).replace('.', ''); };
function fxState(f, ym) {
  const due = dueDate(f, ym), p = paidTx(f, ym);
  if (p) return { k: 'paid', tx: p, due, d: 0 };
  const d = dayDiff(due, today());
  return { k: d < 0 ? 'over' : d <= remindOf(f) ? 'soon' : 'pend', due, d };
}
function fxText(st) {
  if (st.k === 'paid') return 'Pagado el ' + shortDate(st.tx.date);
  if (st.k === 'over') return 'Vencido hace ' + (-st.d) + (st.d === -1 ? ' día' : ' días') + ' · ' + shortDate(st.due);
  if (st.d === 0) return 'Vence hoy';
  if (st.d === 1) return 'Vence mañana';
  if (st.k === 'soon') return 'Vence en ' + st.d + ' días · ' + shortDate(st.due);
  return 'Vence el ' + shortDate(st.due);
}
const fxList = ym => S.fixed.filter(f => fxActive(f, ym)).sort((a, b) => dueDate(a, ym).localeCompare(dueDate(b, ym)) || a.order - b.order);
function alerts() {
  const cur = today().slice(0, 7), out = [];
  [shiftMonth(cur, -1), cur].forEach(ym => fxList(ym).forEach(f => { const st = fxState(f, ym); if (st.k === 'over' || st.k === 'soon') out.push({ f, ym, st }); }));
  return out.sort((a, b) => a.st.due.localeCompare(b.st.due));
}
function fxRow(f, ym) {
  const st = fxState(f, ym), c = CATMAP[f.category] || CATMAP.otros, paid = st.k === 'paid';
  return `<div class="fx ${st.k}"><button class="chk ${paid ? 'on' : ''}" data-act="payFx" data-id="${esc(f.id)}" data-ym="${ym}" aria-pressed="${paid}" aria-label="${paid ? 'Pagado' : 'Marcar como pagado'}: ${esc(f.name)}">${paid ? ic('check') : ''}</button>
    <button class="fx-main" data-act="editFx" data-id="${esc(f.id)}"><b>${esc(f.name)}</b><small class="st-${st.k}">${esc(fxText(st))}${paid ? '' : ' · ' + esc(c.name)}</small></button>
    <span class="amt">${fmt(paid ? st.tx.amount : f.amount)}</span></div>`;
}
function payAlertHTML() {
  const al = alerts(); if (!al.length) return '';
  return `<section><div class="sec-h"><h2>Pagos por vencer</h2><button class="link" data-act="goPay">Ver todos</button></div><div class="list">${al.slice(0, 4).map(a => fxRow(a.f, a.ym)).join('')}</div></section>`;
}
function viewBud() {
  const seg = `<div class="seg"><button class="${S.bsub === 'fx' ? 'on' : ''}" data-act="bSub" data-v="fx" aria-pressed="${S.bsub === 'fx'}">Pagos fijos</button><button class="${S.bsub === 'bud' ? 'on' : ''}" data-act="bSub" data-v="bud" aria-pressed="${S.bsub === 'bud'}">Presupuestos</button></div>`;
  return seg + (S.bsub === 'fx' ? viewFixed() : viewBudgetsOnly());
}
function viewFixed() {
  const ym = S.month, list = fxList(ym);
  let paid = 0, pend = 0, n = 0;
  list.forEach(f => { const st = fxState(f, ym); if (st.k === 'paid') { paid += st.tx.amount; n++; } else pend += f.amount; });
  const pct = paid + pend ? Math.round(paid / (paid + pend) * 100) : 0;
  const sum = list.length ? `<section class="card bsum"><div class="bsum-nums"><div><span>Pagado</span><b class="pos">${fmt(paid)}</b></div><div><span>Por pagar</span><b>${fmt(pend)}</b></div><div><span>Pagos</span><b>${n} de ${list.length}</b></div></div><span class="bar"><i style="width:${pct}%"></i></span></section>` : '';
  const rows = list.length ? `<div class="list">${list.map(f => fxRow(f, ym)).join('')}</div>`
    : `<div class="card"><p class="empty">Aún no tienes pagos fijos para este mes. Agrega arriendo, cuentas, cuotas o suscripciones y márcalos al pagarlos.</p></div>`;
  const opts = Array.from({ length: 11 }, (_, i) => `<option value="${i}" ${S.settings.remind === i ? 'selected' : ''}>${i === 0 ? 'El mismo día' : i + (i === 1 ? ' día antes' : ' días antes')}</option>`).join('');
  const can = 'Notification' in window;
  const on = can && S.settings.notify && Notification.permission === 'granted';
  const notif = !can ? `<p class="hint">Este navegador no permite notificaciones; verás los avisos al abrir la app.</p>`
    : on ? `<div class="actions"><button class="btn grow" data-act="notifOff">Desactivar notificaciones</button></div>`
    : `<div class="actions"><button class="btn grow" data-act="notifOn">${ic('bell')} Activar notificaciones</button></div>`;
  return sum + `<div class="sec-h" style="margin:0"><h2>Pagos de ${esc(monthName(ym))}</h2><button class="link" data-act="newFx">+ Agregar pago fijo</button></div>${rows}
    <section class="card"><div class="sec-h"><h2>Recordatorios</h2></div>
    <label class="field"><span>Avisarme antes del vencimiento</span><select id="remindSel" class="inp">${opts}</select></label>
    <p class="hint" style="margin:10px 0">Los pagos por vencer se destacan en Inicio y en la pestaña Pagos cuando abres la app. ${on ? 'Además recibirás una notificación una vez al día al abrirla.' : ''} La app no puede avisarte con el teléfono bloqueado y la app cerrada: se revisa cada vez que la abres.</p>${notif}</section>`;
}
function openFx(id) {
  const f = id ? S.fixed.find(x => x.id === id) : null;
  FX = f ? { ...f } : { id: null, name: '', amount: 0, category: 'otros', account: '', day: 5, remind: null, from: S.month, until: '', order: null };
  const cats = CAT_OUT.map(c => `<option value="${c.id}" ${c.id === FX.category ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  const rem = [`<option value="">Usar el general (${S.settings.remind} ${S.settings.remind === 1 ? 'día' : 'días'})</option>`].concat([0, 1, 2, 3, 5, 7, 10].map(i => `<option value="${i}" ${FX.remind === i ? 'selected' : ''}>${i === 0 ? 'El mismo día' : i + (i === 1 ? ' día antes' : ' días antes')}</option>`)).join('');
  openShell(f ? 'Editar pago fijo' : 'Nuevo pago fijo', `<label class="field"><span>Nombre</span><input id="xName" class="inp" maxlength="60" placeholder="Ej: Arriendo, Internet, Cuota auto" value="${esc(FX.name)}"></label>
    ${moneyField('xAmt', FX.amount, 'Monto (si varía, pon un estimado)')}
    <label class="field"><span>Se paga el día</span><input id="xDay" class="inp" type="number" inputmode="numeric" min="1" max="31" value="${FX.day}"></label>
    <label class="field"><span>Categoría</span><select id="xCat" class="inp">${cats}</select></label>
    <label class="field"><span>Cartera con la que pagas</span><select id="xAcc" class="inp">${accOptions(FX.account, 'Elegir al pagar')}</select></label>
    <label class="field"><span>Avisar antes</span><select id="xRem" class="inp">${rem}</select></label>
    <label class="field"><span>Último mes a pagar (opcional, para cuotas)</span><input id="xUntil" class="inp" type="month" value="${esc(FX.until)}"></label>
    <div class="actions">${f ? `<button class="btn danger" data-act="delFx">Eliminar</button>` : ''}<button class="btn primary grow" data-act="saveFx">Guardar</button></div>`);
}
function saveFx() {
  const name = $('#xName').value.trim(), amount = digits($('#xAmt').value), day = Number($('#xDay').value);
  if (!name) return toast('Escribe un nombre.');
  if (!(amount > 0)) return toast('Ingresa un monto mayor a 0.');
  if (!(day >= 1 && day <= 31)) return toast('El día debe estar entre 1 y 31.');
  const id = FX.id || newId('f'), order = FX.order != null ? FX.order : S.fixed.reduce((m, f) => Math.max(m, f.order || 0), 0) + 1;
  const doc = { name, amount, day, category: $('#xCat').value, account: $('#xAcc').value, remind: $('#xRem').value === '' ? null : Number($('#xRem').value), from: FX.from, until: $('#xUntil').value, order };
  if (write(() => DB.setFx(id, doc), 'Pago fijo guardado')) closeSheet();
}
function openPay(id, ym) {
  const f = S.fixed.find(x => x.id === id); if (!f) return;
  const st = fxState(f, ym);
  PAY = { id, ym, tx: st.tx || null };
  if (st.k === 'paid') {
    openShell('Pago registrado', `<p class="note"><b>${esc(f.name)}</b> · ${esc(monthLabel(ym))}<br>Pagado el ${esc(dayLabel(st.tx.date))} desde ${esc(acctName(st.tx.account))}: <b>${fmt(st.tx.amount)}</b>.</p>
      <p class="note">Si lo marcaste por error, desmárcalo: se elimina el gasto y el dinero vuelve a la cartera.</p>
      <div class="actions"><button class="btn danger grow" data-act="undoPay">Desmarcar pago</button><button class="btn grow" data-act="closeSheet">Cerrar</button></div>`);
    return;
  }
  const acc = acct(f.account) ? f.account : (acct(S.lastAcc) ? S.lastAcc : S.accounts[0].id);
  openShell('Marcar como pagado', `<p class="note"><b>${esc(f.name)}</b> · ${esc(fxText(st))}</p>
    ${moneyField('pAmt', f.amount, 'Monto pagado')}
    <label class="field"><span>Pagado desde</span><select id="pAcc" class="inp">${accOptions(acc)}</select></label>
    <label class="field"><span>Fecha de pago</span><input id="pDate" type="date" class="inp" value="${today()}"></label>
    <div class="actions"><button class="btn primary grow" data-act="doPay">Marcar como pagado</button></div>`);
}
function doPay() {
  const f = S.fixed.find(x => x.id === PAY.id); if (!f) return;
  const amount = digits($('#pAmt').value), account = $('#pAcc').value, date = $('#pDate').value, ym = PAY.ym;
  if (!(amount > 0)) return toast('Ingresa el monto pagado.');
  if (!account) return toast('Elige una cartera.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return toast('Elige la fecha de pago.');
  S.lastAcc = account;
  const doc = { type: 'gasto', amount, description: f.name, category: f.category, account, date, order: Date.now(), fixedId: f.id, fixedMonth: ym };
  if (write(() => DB.setTx(newId('t'), doc), 'Pago registrado')) closeSheet();
}
async function notifOn() {
  if (!('Notification' in window)) return toast('Este navegador no permite notificaciones.');
  let perm = 'denied';
  try { perm = await Notification.requestPermission(); } catch (e) {}
  if (perm !== 'granted') return toast('No se activaron las notificaciones.');
  S.settings.notify = true; persist(); render(); toast('Notificaciones activadas'); checkNotify(true);
}
async function checkNotify(force) {
  try {
    if (!S.settings.notify || !('Notification' in window) || Notification.permission !== 'granted') return;
    if (!force && lsGet('miscarteras.lastNotify') === today()) return;
    const al = alerts(); if (!al.length) return;
    const body = al.slice(0, 4).map(a => a.f.name + ': ' + fxText(a.st).split(' · ')[0].toLowerCase()).join('\n');
    const opts = { body, icon: 'icon-192.png', badge: 'icon-192.png', tag: 'pagos' };
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    const title = al.length === 1 ? '1 pago por vencer' : al.length + ' pagos por vencer';
    if (reg && reg.showNotification) await reg.showNotification(title, opts); else new Notification(title, opts);
    lsSet('miscarteras.lastNotify', today());
  } catch (e) {}
}

// ---------- Arranque ----------
window.addEventListener('popstate', () => { if (HIST) { HIST = false; closeSheet(true); } });
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if (S.tab === 'acc') render(); });
window.addEventListener('appinstalled', () => { deferredInstall = null; toast('App instalada'); if (S.tab === 'acc') render(); });
loadLocal();
render();
checkNotify();
document.addEventListener('visibilitychange', () => { if (!document.hidden) { render(); checkNotify(); } });
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => {}); });
}
