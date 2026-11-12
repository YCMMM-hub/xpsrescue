// Batch Pass licence — same pattern as PubRescue. The activation code is shown by
// Stripe after payment; the app stores only the SHA-256 of valid codes.
export const CONFIG = {
  // Stripe Payment Link for the XPSRescue Batch Pass (€9 one-time).
  checkoutUrl: 'https://buy.stripe.com/4gM4gy13lf07dP0ePX4AU04',
  // SHA-256 hashes of valid activation codes (shown by Stripe after payment).
  codeHashes: ['65adb510f29b2c66d9f122c268f530456c32f9e9c29a029353073dce3d4f5c75'],
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
