// Batch Pass licence — same pattern as PubRescue. The activation code is shown by
// Stripe after payment; the app stores only the SHA-256 of valid codes.
export const CONFIG = {
  // TODO: replace with the real Stripe Payment Link once the product is created.
  checkoutUrl: '#',
  // SHA-256 hashes of valid activation codes (generate with the same tool as PubRescue).
  codeHashes: [],
  price: '€9',
};
const KEY = 'xpsrescue.license';

export async function sha256Hex(text) {
  const data = new TextEncoder().encode(text.trim().toUpperCase());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export async function isValidCode(code) { if (!code || !code.trim()) return false; return CONFIG.codeHashes.includes(await sha256Hex(code)); }
export function loadLicense() { try { return localStorage.getItem(KEY) || ''; } catch { return ''; } }
export async function hasLicense() { return isValidCode(loadLicense()); }
export async function activate(code) { if (!(await isValidCode(code))) return false; try { localStorage.setItem(KEY, code.trim().toUpperCase()); } catch {} return true; }
