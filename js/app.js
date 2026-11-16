import { CONFIG, hasLicense, activate } from './license.js';
import { t, LANG, applyStatic } from './i18n.js';

const $ = s => document.querySelector(s);
applyStatic();
const drop = $('#drop'), pick = $('#pick'), pickFolder = $('#pick-folder');
const filesEl = $('#files'), summary = $('#summary'), licenseState = $('#license-state');
const downloadAll = $('#download-all'), paywall = $('#paywall');
let produced = []; // {name, bytes}

function setButtons() { $('#buy').href = CONFIG.checkoutUrl; $('#paywall-buy').href = CONFIG.checkoutUrl; document.querySelectorAll('.price-copy').forEach(e => e.textContent = CONFIG.price); }
setButtons();

function li(name, bytes, ok, msg) {
  const el = document.createElement('li'); el.className = 'file';
  if (ok) { const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.textContent = '⬇ ' + name; a.className = 'link';
    el.appendChild(a);
    if (msg) { const w = document.createElement('div'); w.className = 'warn'; w.textContent = '⚠ ' + msg; el.appendChild(w); }
  } else { el.textContent = '⚠ ' + name + ' — ' + (msg || t('fail')); }
  filesEl.appendChild(el);
}

async function convertOne(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const pdfBytes = await window.XPS.convertToPdf(buf);
  return pdfBytes;
}

// What the engine could not render in the file just converted (it used to be dropped silently).
function lostNote() {
  const w = window.XPS.lastWarnings || {}; const bits = [];
  if (w.images) bits.push(t('l_img', w.images));
  if (w.text) bits.push(t('l_txt', w.text));
  if (w.fonts) bits.push(t('l_font', w.fonts));
  if (w.shapes) bits.push(t('l_shape', w.shapes));
  return bits.length ? t('lost_pre') + bits.join(', ') + '.' + t('lost_post') : '';
}

let busy = false;
const busyEl = document.createElement('p'); busyEl.className = 'summary'; busyEl.setAttribute('aria-live', 'polite'); summary.after(busyEl); let busyTimer = 0;
async function handle(fileList) {
  if (busy) { busyEl.textContent = t('wait'); clearTimeout(busyTimer); busyTimer = setTimeout(() => { busyEl.textContent = ''; }, 5000); return; } // two drops at once used to open the free batch ZIP
  busy = true; try { await handleInner(fileList); } finally { busy = false; }
}
async function handleInner(fileList) {
  const files = [...fileList].filter(f => /\.(xps|oxps)$/i.test(f.name));
  if (!files.length) { summary.textContent = t('choose'); return; }
  filesEl.innerHTML = ''; produced = []; downloadAll.hidden = true;

  if (files.length > 1 && !(await hasLicense())) { openPaywall(); summary.textContent = t('batch', files.length); return; }

  summary.textContent = t('converting', files.length);
  let done = 0, lossy = 0;
  for (const f of files) {
    const outName = f.name.replace(/\.(xps|oxps)$/i, '.pdf');
    try { const bytes = await convertOne(f); const note = lostNote(); if (note) lossy++; produced.push({ name: outName, bytes }); li(outName, bytes, true, note); done++; }
    catch (e) { li(f.name, null, false, (LANG !== 'en' && t('bad_file')) || e.message); }
  }
  const ds = t('done', done, files.length); summary.textContent = (done ? ds : ds.replace(/ — .*$/, '.')) + (lossy ? t('lossy', lossy) : '');
  if (produced.length > 1) downloadAll.hidden = false;
}

downloadAll.addEventListener('click', () => {
  const map = {}; for (const p of produced) map[p.name] = p.bytes;
  const zip = window.fflate.zipSync(map); const url = URL.createObjectURL(new Blob([zip], { type: 'application/zip' }));
  const a = document.createElement('a'); a.href = url; a.download = 'xps-to-pdf.zip'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
});

pick.addEventListener('change', e => { handle(e.target.files); e.target.value = ''; });
pickFolder.addEventListener('change', e => { handle(e.target.files); e.target.value = ''; });
['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => handle(e.dataTransfer.files));

// paywall
function openPaywall() { paywall.hidden = false; }
$('#close-paywall').addEventListener('click', () => paywall.hidden = true);
$('#activate').addEventListener('submit', async e => {
  e.preventDefault(); const code = $('#code').value;
  if (await activate(code)) { paywall.hidden = true; $('#code-msg').textContent = ''; licenseState.textContent = t('active_long'); }
  else { $('#code-msg').textContent = t('code_bad'); }
});
hasLicense().then(ok => { if (ok) licenseState.textContent = t('active'); });
