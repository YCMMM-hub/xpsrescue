import { CONFIG, hasLicense, activate } from './license.js';

const $ = s => document.querySelector(s);
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
  } else { el.textContent = '⚠ ' + name + ' — ' + (msg || 'could not convert'); }
  filesEl.appendChild(el);
}

async function convertOne(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const pdfBytes = await window.XPS.convertToPdf(buf);
  return pdfBytes;
}

async function handle(fileList) {
  const files = [...fileList].filter(f => /\.(xps|oxps)$/i.test(f.name));
  if (!files.length) { summary.textContent = 'Please choose a .xps or .oxps file.'; return; }
  filesEl.innerHTML = ''; produced = []; downloadAll.hidden = true;

  if (files.length > 1 && !(await hasLicense())) { openPaywall(); summary.textContent = files.length + ' files — the Batch Pass converts them all at once.'; return; }

  summary.textContent = 'Converting ' + files.length + ' file' + (files.length > 1 ? 's' : '') + '…';
  let done = 0;
  for (const f of files) {
    const outName = f.name.replace(/\.(xps|oxps)$/i, '.pdf');
    try { const bytes = await convertOne(f); produced.push({ name: outName, bytes }); li(outName, bytes, true); done++; }
    catch (e) { li(f.name, null, false, e.message); }
  }
  summary.textContent = done + ' of ' + files.length + ' converted — nothing left your device.';
  if (produced.length > 1) downloadAll.hidden = false;
}

downloadAll.addEventListener('click', () => {
  const map = {}; for (const p of produced) map[p.name] = p.bytes;
  const zip = window.fflate.zipSync(map); const url = URL.createObjectURL(new Blob([zip], { type: 'application/zip' }));
  const a = document.createElement('a'); a.href = url; a.download = 'xps-to-pdf.zip'; a.click();
});

pick.addEventListener('change', e => handle(e.target.files));
pickFolder.addEventListener('change', e => handle(e.target.files));
['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', e => handle(e.dataTransfer.files));

// paywall
function openPaywall() { paywall.hidden = false; }
$('#close-paywall').addEventListener('click', () => paywall.hidden = true);
$('#activate').addEventListener('submit', async e => {
  e.preventDefault(); const code = $('#code').value;
  if (await activate(code)) { paywall.hidden = true; $('#code-msg').textContent = ''; licenseState.textContent = '✓ Batch Pass active — convert as many files as you like.'; }
  else { $('#code-msg').textContent = 'That code was not recognised.'; }
});
hasLicense().then(ok => { if (ok) licenseState.textContent = '✓ Batch Pass active.'; });
