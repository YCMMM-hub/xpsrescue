// Cookieless analytics (GoatCounter). No-ops until an endpoint is configured.
const GOATCOUNTER = ''; // e.g. 'https://xpsrescue.goatcounter.com/count'
if (GOATCOUNTER) {
  window.goatcounter = { no_onload: false, endpoint: GOATCOUNTER };
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.setAttribute('data-goatcounter', GOATCOUNTER);
  document.head.appendChild(s);
}
