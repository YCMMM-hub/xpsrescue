// Interface strings for the XPSRescue web converter. Language: ?lang=xx, else the browser language, else English.
// Texts were written without native review (see STUDIO.md): the product name "Batch Pass" is kept in every language.
const SUP = ['en', 'fr', 'de', 'es', 'it', 'pt'];
const q = new URLSearchParams(location.search).get('lang');
const nav = ((navigator.language || 'en').slice(0, 2) || 'en').toLowerCase();
export const LANG = SUP.includes(q) ? q : (q ? 'en' : (SUP.includes(nav) ? nav : 'en'));

const D = {
  en: {},
  fr: {
    h1: 'Ouvrir un fichier XPS sans Windows — le convertir en PDF', lead: 'Transformez les fichiers XPS et OpenXPS de Microsoft en PDF, directement dans votre navigateur.',
    promises: '<li><b>Vos fichiers restent sur votre appareil</b> — rien n’est envoyé.</li><li><b>Gratuit</b> pour un fichier à la fois. Sans compte, sans filigrane.</li><li><b>Dossiers entiers : <span class="price-copy">€9</span> une fois</b> — tous les fichiers convertis dans un seul ZIP.</li>',
    drop_title: 'Déposez un fichier .xps ici', drop_sub: 'ou cliquez pour choisir — le PDF est prêt en environ une seconde', folder: 'Choisir un dossier entier', dl_all: 'Tout télécharger en ZIP',
    pricing_h2: 'Tarifs',
    plans: '<div class="plan"><h3>Gratuit</h3><p class="amount">€0</p><ul><li>Un fichier à la fois, autant de fois que vous voulez</li><li>PDF pleine qualité</li><li>Sans filigrane, sans compte</li></ul></div><div class="plan featured"><h3>Batch Pass</h3><p class="amount"><span class="price-copy">€9</span> <small>paiement unique</small></p><ul><li>Dossiers entiers en une fois</li><li>Un ZIP avec tous les PDF</li><li>À vie, sans abonnement</li><li>Remboursement sous 30 jours</li></ul><a id="buy" class="btn" href="#" target="_blank" rel="noopener">Acheter le Batch Pass</a></div>',
    paywall_title: 'Convertir des dossiers entiers d’un coup', paywall_p: 'La version gratuite convertit un fichier à la fois. Le <b>Batch Pass</b> convertit tous les fichiers déposés et livre un seul ZIP — un paiement, sans abonnement, remboursement sous 30 jours.',
    paywall_buy: 'Acheter pour <span class="price-copy">€9</span>', paywall_label: 'Déjà payé ? Saisissez le code d’activation affiché après le paiement :', activate: 'Activer', not_now: 'Pas maintenant',
    foot: 'XPSRescue n’est pas affilié à Microsoft. XPS est une marque de Microsoft Corporation.',
    bad_file: 'fichier XPS illisible ou endommagé', title: 'Ouvrir et convertir des fichiers XPS en PDF — gratuit, dans votre navigateur | XPSRescue', desc: 'Ouvrez d’anciens fichiers XPS (.xps/.oxps) de Microsoft et convertissez-les en PDF directement dans votre navigateur. Vos fichiers restent sur votre appareil. Gratuit pour un fichier, Batch Pass à 9 € pour les dossiers.', guides_h2: 'Guides',
    choose: 'Veuillez choisir un fichier .xps ou .oxps.', batch: n => `${n} fichiers — le Batch Pass les convertit tous d’un coup.`, converting: n => `Conversion de ${n} fichier${n > 1 ? 's' : ''}…`,
    done: (d, n) => `${d} sur ${n} converti${d > 1 ? 's' : ''} — rien n’a quitté votre appareil.`, lossy: n => ` ⚠ ${n} fichier${n > 1 ? 's' : ''} avec du contenu non rendu (voir ci-dessous).`, fail: 'conversion impossible',
    code_bad: 'Ce code n’est pas reconnu.', active_long: '✓ Batch Pass actif — convertissez autant de fichiers que vous voulez.', active: '✓ Batch Pass actif.', wait: 'Veuillez patienter : une conversion est en cours.',
    lost_pre: 'Non rendu dans le PDF : ', lost_post: ' Comparez avec l’original avant de le jeter.', l_img: n => `${n} image${n > 1 ? 's' : ''}`, l_txt: n => `${n} passage${n > 1 ? 's' : ''} de texte (caractères que la police de secours ne sait pas dessiner)`, l_font: n => `${n} police${n > 1 ? 's' : ''} intégrée${n > 1 ? 's' : ''}`, l_shape: n => `${n} forme${n > 1 ? 's' : ''}`,
  },
  de: {
    h1: 'XPS-Dateien ohne Windows öffnen — als PDF umwandeln', lead: 'Wandeln Sie Microsoft-XPS- und OpenXPS-Dateien direkt im Browser in PDF um.',
    promises: '<li><b>Ihre Dateien bleiben auf Ihrem Gerät</b> — nichts wird hochgeladen.</li><li><b>Kostenlos</b> für eine Datei nach der anderen. Ohne Konto, ohne Wasserzeichen.</li><li><b>Ganze Ordner: <span class="price-copy">€9</span> einmalig</b> — alle Dateien in einer ZIP-Datei.</li>',
    drop_title: 'XPS-Datei hier ablegen', drop_sub: 'oder klicken zum Auswählen — das PDF ist in etwa einer Sekunde fertig', folder: 'Ganzen Ordner wählen', dl_all: 'Alles als ZIP herunterladen',
    pricing_h2: 'Preise',
    plans: '<div class="plan"><h3>Kostenlos</h3><p class="amount">€0</p><ul><li>Eine Datei nach der anderen, so oft Sie möchten</li><li>PDF in voller Qualität</li><li>Ohne Wasserzeichen, ohne Konto</li></ul></div><div class="plan featured"><h3>Batch Pass</h3><p class="amount"><span class="price-copy">€9</span> <small>einmalig</small></p><ul><li>Ganze Ordner auf einmal</li><li>Eine ZIP-Datei mit allen PDFs</li><li>Dauerhaft, kein Abo</li><li>30 Tage Rückerstattung</li></ul><a id="buy" class="btn" href="#" target="_blank" rel="noopener">Batch Pass kaufen</a></div>',
    paywall_title: 'Ganze Ordner auf einmal umwandeln', paywall_p: 'Die kostenlose Version wandelt eine Datei nach der anderen um. Der <b>Batch Pass</b> wandelt alle abgelegten Dateien um und liefert eine ZIP-Datei — einmal zahlen, kein Abo, 30 Tage Rückerstattung.',
    paywall_buy: 'Kaufen für <span class="price-copy">€9</span>', paywall_label: 'Schon bezahlt? Geben Sie den Aktivierungscode ein, der nach der Zahlung angezeigt wird:', activate: 'Aktivieren', not_now: 'Jetzt nicht',
    foot: 'XPSRescue steht in keiner Verbindung zu Microsoft. XPS ist eine Marke der Microsoft Corporation.',
    bad_file: 'XPS-Datei nicht lesbar oder beschädigt', title: 'XPS-Dateien öffnen und in PDF umwandeln — kostenlos, im Browser | XPSRescue', desc: 'Öffnen Sie alte Microsoft-XPS-Dateien (.xps/.oxps) und wandeln Sie sie direkt im Browser in PDF um. Ihre Dateien bleiben auf Ihrem Gerät. Kostenlos für eine Datei, Batch Pass für 9 € für Ordner.', guides_h2: 'Anleitungen',
    choose: 'Bitte wählen Sie eine .xps- oder .oxps-Datei.', batch: n => `${n} Dateien — der Batch Pass wandelt alle auf einmal um.`, converting: n => n > 1 ? `${n} Dateien werden umgewandelt…` : '1 Datei wird umgewandelt…',
    done: (d, n) => `${d} von ${n} umgewandelt — nichts hat Ihr Gerät verlassen.`, lossy: n => ` ⚠ ${n} Datei${n > 1 ? 'en' : ''} mit nicht dargestelltem Inhalt (siehe unten).`, fail: 'Umwandlung nicht möglich',
    code_bad: 'Dieser Code wurde nicht erkannt.', active_long: '✓ Batch Pass aktiv — wandeln Sie so viele Dateien um, wie Sie möchten.', active: '✓ Batch Pass aktiv.', wait: 'Bitte warten: Eine Umwandlung läuft noch.',
    lost_pre: 'Im PDF nicht dargestellt: ', lost_post: ' Vergleichen Sie mit dem Original, bevor Sie es löschen.', l_img: n => `${n} Bild${n > 1 ? 'er' : ''}`, l_txt: n => `${n} Textstelle${n > 1 ? 'n' : ''} (Zeichen, die die Ersatzschrift nicht darstellen kann)`, l_font: n => `${n} eingebettete Schrift${n > 1 ? 'en' : ''}`, l_shape: n => `${n} Form${n > 1 ? 'en' : ''}`,
  },
  es: {
    h1: 'Abre archivos XPS sin Windows — conviértelos a PDF', lead: 'Convierte archivos XPS y OpenXPS de Microsoft a PDF directamente en tu navegador.',
    promises: '<li><b>Tus archivos se quedan en tu dispositivo</b> — no se sube nada.</li><li><b>Gratis</b>, un archivo cada vez. Sin cuenta, sin marca de agua.</li><li><b>Carpetas enteras: <span class="price-copy">€9</span> una vez</b> — todos los archivos en un solo ZIP.</li>',
    drop_title: 'Suelta un archivo .xps aquí', drop_sub: 'o haz clic para elegir — el PDF está listo en un segundo aproximadamente', folder: 'Elegir una carpeta entera', dl_all: 'Descargar todo en un ZIP',
    pricing_h2: 'Precios',
    plans: '<div class="plan"><h3>Gratis</h3><p class="amount">€0</p><ul><li>Un archivo cada vez, tantas veces como quieras</li><li>PDF de calidad completa</li><li>Sin marca de agua, sin cuenta</li></ul></div><div class="plan featured"><h3>Batch Pass</h3><p class="amount"><span class="price-copy">€9</span> <small>pago único</small></p><ul><li>Carpetas enteras de una vez</li><li>Un ZIP con todos los PDF</li><li>De por vida, sin suscripción</li><li>Reembolso en 30 días</li></ul><a id="buy" class="btn" href="#" target="_blank" rel="noopener">Comprar el Batch Pass</a></div>',
    paywall_title: 'Convierte carpetas enteras de una vez', paywall_p: 'La versión gratuita convierte un archivo cada vez. El <b>Batch Pass</b> convierte todos los archivos que sueltes y te da un único ZIP — un pago, sin suscripción, reembolso en 30 días.',
    paywall_buy: 'Comprar por <span class="price-copy">€9</span>', paywall_label: '¿Ya pagaste? Introduce el código de activación que se muestra tras el pago:', activate: 'Activar', not_now: 'Ahora no',
    foot: 'XPSRescue no está afiliado a Microsoft. XPS es una marca de Microsoft Corporation.',
    bad_file: 'archivo XPS ilegible o dañado', title: 'Abrir y convertir archivos XPS a PDF — gratis, en tu navegador | XPSRescue', desc: 'Abre archivos XPS (.xps/.oxps) antiguos de Microsoft y conviértelos a PDF directamente en tu navegador. Tus archivos se quedan en tu dispositivo. Gratis para un archivo, Batch Pass de 9 € para carpetas.', guides_h2: 'Guías',
    choose: 'Elige un archivo .xps o .oxps.', batch: n => `${n} archivos — el Batch Pass los convierte todos de una vez.`, converting: n => `Convirtiendo ${n} archivo${n > 1 ? 's' : ''}…`,
    done: (d, n) => `${d} de ${n} convertido${d > 1 ? 's' : ''} — nada salió de tu dispositivo.`, lossy: n => ` ⚠ ${n} archivo${n > 1 ? 's' : ''} con contenido que no se pudo representar (mira más abajo).`, fail: 'no se pudo convertir',
    code_bad: 'No se reconoce ese código.', active_long: '✓ Batch Pass activo — convierte todos los archivos que quieras.', active: '✓ Batch Pass activo.', wait: 'Espera: hay una conversión en curso.',
    lost_pre: 'No representado en el PDF: ', lost_post: ' Compáralo con el original antes de descartarlo.', l_img: n => `${n} imagen${n > 1 ? 'es' : ''}`, l_txt: n => `${n} fragmento${n > 1 ? 's' : ''} de texto (caracteres que la fuente de reserva no puede dibujar)`, l_font: n => `${n} fuente${n > 1 ? 's' : ''} incrustada${n > 1 ? 's' : ''}`, l_shape: n => `${n} forma${n > 1 ? 's' : ''}`,
  },
  it: {
    h1: 'Apri i file XPS senza Windows — convertili in PDF', lead: 'Trasforma i file XPS e OpenXPS di Microsoft in PDF direttamente nel browser.',
    promises: '<li><b>I tuoi file restano sul tuo dispositivo</b> — non viene caricato nulla.</li><li><b>Gratis</b> un file alla volta. Senza account, senza filigrana.</li><li><b>Cartelle intere: <span class="price-copy">€9</span> una tantum</b> — tutti i file in un unico ZIP.</li>',
    drop_title: 'Trascina qui un file .xps', drop_sub: 'o clicca per scegliere — il PDF è pronto in circa un secondo', folder: 'Scegli una cartella intera', dl_all: 'Scarica tutto in ZIP',
    pricing_h2: 'Prezzi',
    plans: '<div class="plan"><h3>Gratis</h3><p class="amount">€0</p><ul><li>Un file alla volta, quante volte vuoi</li><li>PDF in qualità piena</li><li>Senza filigrana, senza account</li></ul></div><div class="plan featured"><h3>Batch Pass</h3><p class="amount"><span class="price-copy">€9</span> <small>una tantum</small></p><ul><li>Cartelle intere in un colpo solo</li><li>Un ZIP con tutti i PDF</li><li>A vita, senza abbonamento</li><li>Rimborso entro 30 giorni</li></ul><a id="buy" class="btn" href="#" target="_blank" rel="noopener">Acquista il Batch Pass</a></div>',
    paywall_title: 'Converti cartelle intere in un colpo solo', paywall_p: 'La versione gratuita converte un file alla volta. Il <b>Batch Pass</b> converte tutti i file trascinati e fornisce un unico ZIP — un solo pagamento, senza abbonamento, rimborso entro 30 giorni.',
    paywall_buy: 'Acquista a <span class="price-copy">€9</span>', paywall_label: 'Hai già pagato? Inserisci il codice di attivazione mostrato dopo il pagamento:', activate: 'Attiva', not_now: 'Non ora',
    foot: 'XPSRescue non è affiliato a Microsoft. XPS è un marchio di Microsoft Corporation.',
    bad_file: 'file XPS illeggibile o danneggiato', title: 'Apri e converti file XPS in PDF — gratis, nel browser | XPSRescue', desc: 'Apri i vecchi file XPS (.xps/.oxps) di Microsoft e convertili in PDF direttamente nel browser. I tuoi file restano sul tuo dispositivo. Gratis per un file, Batch Pass a 9 € per le cartelle.', guides_h2: 'Guide',
    choose: 'Scegli un file .xps o .oxps.', batch: n => `${n} file — il Batch Pass li converte tutti in un colpo solo.`, converting: n => `Conversione di ${n} file…`,
    done: (d, n) => `${d} di ${n} convertit${d > 1 ? 'i' : 'o'} — nulla ha lasciato il tuo dispositivo.`, lossy: n => ` ⚠ ${n} file con contenuto non riprodotto (vedi sotto).`, fail: 'conversione non riuscita',
    code_bad: 'Codice non riconosciuto.', active_long: '✓ Batch Pass attivo — converti quanti file vuoi.', active: '✓ Batch Pass attivo.', wait: 'Attendi: una conversione è ancora in corso.',
    lost_pre: 'Non riprodotto nel PDF: ', lost_post: ' Confronta con l’originale prima di eliminarlo.', l_img: n => `${n} immagin${n > 1 ? 'i' : 'e'}`, l_txt: n => `${n} brano${n > 1 ? 'i' : ''} di testo (caratteri che il carattere di riserva non sa disegnare)`, l_font: n => `${n} font incorporat${n > 1 ? 'i' : 'o'}`, l_shape: n => `${n} form${n > 1 ? 'e' : 'a'}`,
  },
  pt: {
    h1: 'Abra arquivos XPS sem o Windows — converta em PDF', lead: 'Transforme arquivos XPS e OpenXPS da Microsoft em PDF diretamente no navegador.',
    promises: '<li><b>Seus arquivos ficam no seu dispositivo</b> — nada é enviado.</li><li><b>Grátis</b> um arquivo por vez. Sem conta, sem marca d’água.</li><li><b>Pastas inteiras: <span class="price-copy">€9</span> uma vez</b> — todos os arquivos em um único ZIP.</li>',
    drop_title: 'Solte um arquivo .xps aqui', drop_sub: 'ou clique para escolher — o PDF fica pronto em cerca de um segundo', folder: 'Escolher uma pasta inteira', dl_all: 'Baixar tudo em ZIP',
    pricing_h2: 'Preços',
    plans: '<div class="plan"><h3>Grátis</h3><p class="amount">€0</p><ul><li>Um arquivo por vez, quantas vezes quiser</li><li>PDF em qualidade total</li><li>Sem marca d’água, sem conta</li></ul></div><div class="plan featured"><h3>Batch Pass</h3><p class="amount"><span class="price-copy">€9</span> <small>pagamento único</small></p><ul><li>Pastas inteiras de uma vez</li><li>Um ZIP com todos os PDFs</li><li>Para sempre, sem assinatura</li><li>Reembolso em 30 dias</li></ul><a id="buy" class="btn" href="#" target="_blank" rel="noopener">Comprar o Batch Pass</a></div>',
    paywall_title: 'Converta pastas inteiras de uma vez', paywall_p: 'A versão grátis converte um arquivo por vez. O <b>Batch Pass</b> converte todos os arquivos soltos e entrega um único ZIP — um pagamento, sem assinatura, reembolso em 30 dias.',
    paywall_buy: 'Comprar por <span class="price-copy">€9</span>', paywall_label: 'Já pagou? Digite o código de ativação mostrado após o pagamento:', activate: 'Ativar', not_now: 'Agora não',
    foot: 'O XPSRescue não é afiliado à Microsoft. XPS é uma marca da Microsoft Corporation.',
    bad_file: 'arquivo XPS ilegível ou danificado', title: 'Abrir e converter arquivos XPS em PDF — grátis, no navegador | XPSRescue', desc: 'Abra arquivos XPS (.xps/.oxps) antigos da Microsoft e converta-os em PDF diretamente no navegador. Seus arquivos ficam no seu dispositivo. Grátis para um arquivo, Batch Pass de €9 para pastas.', guides_h2: 'Guias',
    choose: 'Escolha um arquivo .xps ou .oxps.', batch: n => `${n} arquivos — o Batch Pass converte todos de uma vez.`, converting: n => `Convertendo ${n} arquivo${n > 1 ? 's' : ''}…`,
    done: (d, n) => `${d} de ${n} convertido${d > 1 ? 's' : ''} — nada saiu do seu dispositivo.`, lossy: n => ` ⚠ ${n} arquivo${n > 1 ? 's' : ''} com conteúdo não renderizado (veja abaixo).`, fail: 'não foi possível converter',
    code_bad: 'Esse código não foi reconhecido.', active_long: '✓ Batch Pass ativo — converta quantos arquivos quiser.', active: '✓ Batch Pass ativo.', wait: 'Aguarde: uma conversão ainda está em andamento.',
    lost_pre: 'Não renderizado no PDF: ', lost_post: ' Compare com o original antes de descartá-lo.', l_img: n => `${n} imagem${n > 1 ? 'ns' : ''}`, l_txt: n => `${n} trecho${n > 1 ? 's' : ''} de texto (caracteres que a fonte de reserva não consegue desenhar)`, l_font: n => `${n} fonte${n > 1 ? 's' : ''} incorporada${n > 1 ? 's' : ''}`, l_shape: n => `${n} forma${n > 1 ? 's' : ''}`,
  },
};
const EN = {
  bad_file: null,
  choose: 'Please choose a .xps or .oxps file.', batch: n => `${n} files — the Batch Pass converts them all at once.`, converting: n => `Converting ${n} file${n > 1 ? 's' : ''}…`,
  done: (d, n) => `${d} of ${n} converted — nothing left your device.`, lossy: n => ` ⚠ ${n} file${n > 1 ? 's' : ''} with content that could not be rendered (see below).`, fail: 'could not convert',
  code_bad: 'That code was not recognised.', active_long: '✓ Batch Pass active — convert as many files as you like.', active: '✓ Batch Pass active.', wait: 'Please wait: a conversion is still running.',
  lost_pre: 'Not rendered in the PDF: ', lost_post: ' Compare with the original before discarding it.', l_img: n => `${n} picture${n > 1 ? 's' : ''}`, l_txt: n => `${n} piece${n > 1 ? 's' : ''} of text (characters the fallback font cannot draw)`, l_font: n => `${n} embedded font${n > 1 ? 's' : ''}`, l_shape: n => `${n} shape${n > 1 ? 's' : ''}`,
};
export const t = (k, ...a) => { const v = (D[LANG] && D[LANG][k] !== undefined) ? D[LANG][k] : EN[k]; return typeof v === 'function' ? v(...a) : v; };

// Translate the static page. English stays untouched (it is the indexed reference version).
export function applyStatic() {
  if (LANG === 'en') return;
  document.documentElement.lang = LANG;
  const set = (sel, k, html) => { const e = document.querySelector(sel); if (e && D[LANG][k] !== undefined) e[html ? 'innerHTML' : 'textContent'] = D[LANG][k]; };
  set('.hero h1', 'h1'); set('.hero .lead', 'lead'); set('.promises', 'promises', true);
  set('.drop-title', 'drop_title'); set('.drop-sub', 'drop_sub'); set('#download-all', 'dl_all');
  const folder = document.querySelector('label.btn.ghost'); if (folder) { const tn = [...folder.childNodes].find(n => n.nodeType === 3); if (tn) tn.nodeValue = D[LANG].folder; }
  set('#pricing h2', 'pricing_h2'); set('.plans', 'plans', true);
  set('#pw-title', 'paywall_title'); const pw = document.querySelector('#paywall .card > p'); if (pw) pw.innerHTML = D[LANG].paywall_p;
  set('#paywall-buy', 'paywall_buy', true); set('#activate label', 'paywall_label'); set('#activate button', 'activate'); set('#close-paywall', 'not_now');
  const foot = document.querySelector('footer p'); if (foot) foot.textContent = D[LANG].foot;
  document.title = D[LANG].title; const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', D[LANG].desc);
  const pn = document.querySelector('header nav a[href="#pricing"]'); if (pn) pn.textContent = D[LANG].pricing_h2;
  set('.guides h2', 'guides_h2');
  // Guides: show only those written for this language when the home page lists some (English ones stay for English visitors).
  const G = { fr: ['ouvrir-fichier-xps', 'visionneuse-xps-windows-11', 'ouvrir-fichier-oxps', 'convertir-xps-en-pdf'], de: ['xps-datei-oeffnen', 'xps-viewer-windows-11'], es: ['abrir-archivo-xps', 'visor-xps-windows-11'], it: ['aprire-file-xps'], pt: ['abrir-arquivo-xps'] }[LANG] || [];
  const lis = [...document.querySelectorAll('.guides li')]; const mine = lis.filter(li => G.some(g => (li.querySelector('a') || {}).href && li.querySelector('a').href.includes(g + '.html')));
  if (mine.length) lis.forEach(li => { li.hidden = !mine.includes(li); });
  // Long English-only sections are covered by the localized guides: hide them instead of leaving mixed-language text.
  document.querySelectorAll('.why, .how, .faq').forEach(e => { e.hidden = true; });
  document.querySelectorAll('header nav a[href="#how"], header nav a[href="#faq"]').forEach(a => { a.hidden = true; });
}
