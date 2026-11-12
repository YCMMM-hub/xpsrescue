/* XPSRescue engine — browser port of the Node convert5 prototype.
   Converts an XPS (.xps/.oxps OPC package) to a PDF entirely in the browser.
   Deps (globals): PDFLib (pdf-lib UMD), fontkit (UMD), fflate (UMD). No upload, no server. */
(function (global) {
  'use strict';
  const { PDFDocument, rgb, degrees, StandardFonts,
    pushGraphicsState, popGraphicsState, moveTo, lineTo, appendBezierCurve, closePath, clip, endPath } = global.PDFLib;
  const { unzipSync, strFromU8 } = global.fflate;
  const K = 72 / 96;

  const hex = s => { if (!s) return null; let h = s.replace('#', '').trim(); if (h.length === 8) h = h.slice(2); const n = parseInt(h, 16); return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255); };
  const hexRGB = s => { let h = s.replace('#', '').trim(); if (h.length === 8) h = h.slice(2); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  function deobf(name, bytes) { const g = name.split('/').pop().split('.')[0].replace(/-/g, ''); const k = hexToBytes(g); const o = bytes.slice(); for (let i = 0; i < 32; i++) o[i] ^= k[15 - (i % 16)]; return o; }
  function hexToBytes(h) { const a = new Uint8Array(h.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(h.substr(i * 2, 2), 16); return a; }
  function decode(u8) { if (u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8); if (u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8); return strFromU8(u8); }

  const ID = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const fromXps = s => { const p = s.split(',').map(Number); return { a: p[0], b: p[1], c: p[2], d: p[3], e: p[4], f: p[5] }; };
  const mul = (P, C) => ({ a: P.a * C.a + P.c * C.b, b: P.b * C.a + P.d * C.b, c: P.a * C.c + P.c * C.d, d: P.b * C.c + P.d * C.d, e: P.a * C.e + P.c * C.f + P.e, f: P.b * C.e + P.d * C.f + P.f });
  const ap = (m, x, y) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
  const scaleOf = m => Math.sqrt(Math.abs(m.a * m.d - m.b * m.c)) || 1;
  const angleOf = m => Math.atan2(m.b, m.a) * 180 / Math.PI;

  // ---- tiny XML walker (DOMParser) returning {tag, attrs, children} ----
  function parseXml(str) {
    const doc = new DOMParser().parseFromString(str, 'application/xml');
    const root = doc.documentElement;
    function conv(el) { const attrs = {}; for (const a of el.attributes) attrs[a.name] = a.value; const children = []; for (const ch of el.children) children.push(conv(ch)); return { tag: el.localName, attrs, children }; }
    return conv(root);
  }

  const stops = (node, tag) => {
    const sc = node.children.find(c => c.tag === tag + '.GradientStops');
    if (!sc) return [];
    return sc.children.filter(c => c.tag === 'GradientStop').map(c => ({ o: parseFloat(c.attrs.Offset), c: hexRGB(c.attrs.Color) })).sort((a, b) => a.o - b.o);
  };
  const css = c => `rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;

  function* geomSegs(data) { const toks = data.replace(/^\s*F[01]\s*/, '').match(/[A-Za-z]|-?\d*\.?\d+/g) || []; let i = 0, cmd; while (i < toks.length) { const t = toks[i]; if (/[A-Za-z]/.test(t)) { cmd = t; i++; if (/[Zz]/.test(t)) yield { z: true }; continue; } const u = cmd.toUpperCase(); const n = (u === 'C') ? 3 : (u === 'Q' || u === 'S') ? 2 : 1; const pts = []; for (let k = 0; k < n && i + 1 < toks.length; k++) { pts.push([+toks[i], +toks[i + 1]]); i += 2; } yield { cmd: u, pts }; } }
  function clipOps(data, m, H) { const ops = []; const dev = (x, y) => { const [X, Y] = ap(m, x, y); return [X * K, (H - Y) * K]; }; for (const s of geomSegs(data)) { if (s.z) { ops.push(closePath()); continue; } if (s.cmd === 'M') { const [x, y] = dev(...s.pts[0]); ops.push(moveTo(x, y)); } else if (s.cmd === 'L') { const [x, y] = dev(...s.pts[0]); ops.push(lineTo(x, y)); } else if (s.cmd === 'C') { const a = dev(...s.pts[0]), b = dev(...s.pts[1]), c = dev(...s.pts[2]); ops.push(appendBezierCurve(a[0], a[1], b[0], b[1], c[0], c[1])); } } return ops; }
  function bboxPage(data, m) { const xs = [], ys = []; for (const s of geomSegs(data)) if (s.pts) for (const [px, py] of s.pts) { const [X, Y] = ap(m, px, py); xs.push(X); ys.push(Y); } return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; }
  function svgPath(data, m) { let out = []; for (const s of geomSegs(data)) { if (s.z) { out.push('Z'); continue; } out.push(s.cmd); for (const [px, py] of s.pts) { const [X, Y] = ap(m, px, py); out.push(X.toFixed(2), Y.toFixed(2)); } } return out.join(' '); }

  // gradient -> PNG bytes via canvas
  function gradientPng(bb, brush, m) {
    const res = Math.min(2, 500 / Math.max(bb.w, bb.h, 1));
    const W = Math.max(2, Math.round(bb.w * res)), Hh = Math.max(2, Math.round(bb.h * res));
    const cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; const ctx = cv.getContext('2d');
    const toC = (gx, gy) => [(gx - bb.x) / bb.w * W, (gy - bb.y) / bb.h * Hh];
    let g;
    if (brush.kind === 'lin') {
      const [sx, sy] = ap(m, ...brush.at.StartPoint.split(',').map(Number));
      const [ex, ey] = ap(m, ...brush.at.EndPoint.split(',').map(Number));
      const s0 = toC(sx, sy), s1 = toC(ex, ey);
      g = ctx.createLinearGradient(s0[0], s0[1], s1[0], s1[1]);
      for (const st of stops(brush.node, 'LinearGradientBrush')) g.addColorStop(Math.max(0, Math.min(1, st.o)), css(st.c));
    } else {
      const [cx, cy] = ap(m, ...brush.at.Center.split(',').map(Number));
      const r = (parseFloat(brush.at.RadiusX) || 1) * scaleOf(m);
      const c0 = toC(cx, cy); const rC = r / bb.w * W;
      g = ctx.createRadialGradient(c0[0], c0[1], 0, c0[0], c0[1], Math.max(1, rC));
      for (const st of stops(brush.node, 'RadialGradientBrush')) g.addColorStop(Math.max(0, Math.min(1, st.o)), css(st.c));
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    const b64 = cv.toDataURL('image/png').split(',')[1];
    const bin = atob(b64); const out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out;
  }

  async function convertToPdf(xpsBytes) {
    const files = unzipSync(xpsBytes instanceof Uint8Array ? xpsBytes : new Uint8Array(xpsBytes));
    const pdf = await PDFDocument.create(); pdf.registerFontkit(global.fontkit);
    const fontByUri = {};
    for (const n of Object.keys(files)) if (/\.odttf$/i.test(n)) { try { fontByUri['/' + n] = await pdf.embedFont(deobf(n, files[n]), { subset: true }); } catch (e) {} }
    const fallback = await pdf.embedFont(StandardFonts.Helvetica);
    const imgCache = {};
    async function img(src) { if (src in imgCache) return imgCache[src]; const k = src.replace(/^\//, ''); let r = null; try { if (/\.png$/i.test(k)) r = await pdf.embedPng(files[k]); else if (/\.jpe?g$/i.test(k)) r = await pdf.embedJpg(files[k]); } catch (e) {} return imgCache[src] = r; }
    const rtOf = kids => { for (const c of kids) if (c.tag && c.tag.endsWith('.RenderTransform')) { const mt = c.children.find(x => x.tag === 'MatrixTransform'); if (mt) return fromXps(mt.attrs.Matrix); } return null; };
    const brushOf = kids => { const pf = kids.find(c => c.tag === 'Path.Fill'); if (!pf) return null; for (const b of pf.children) { if (b.tag === 'LinearGradientBrush') return { kind: 'lin', node: b, at: b.attrs }; if (b.tag === 'RadialGradientBrush') return { kind: 'rad', node: b, at: b.attrs }; if (b.tag === 'ImageBrush') return { kind: 'img', at: b.attrs }; } return null; };

    async function walk(kids, page, H, ctm, alpha) {
      for (const node of kids) {
        const tag = node.tag; if (!tag) continue;
        if (tag.endsWith('.RenderTransform') || tag.endsWith('.Fill') || tag.endsWith('.Clip')) continue;
        const at = node.attrs; const op = at.Opacity !== undefined ? alpha * parseFloat(at.Opacity) : alpha;
        let clipped = false;
        if (at.Clip) { page.pushOperators(pushGraphicsState(), ...clipOps(at.Clip, ctm, H), clip(), endPath()); clipped = true; }
        if (tag === 'Canvas') { const rt = rtOf(node.children); await walk(node.children, page, H, rt ? mul(ctm, rt) : ctm, op); }
        else if (tag === 'Path' && at.Data) {
          const rt = rtOf(node.children); const m = rt ? mul(ctm, rt) : ctm; const brush = brushOf(node.children);
          if (brush && (brush.kind === 'lin' || brush.kind === 'rad')) {
            const bb = bboxPage(at.Data, m);
            if (bb.w > 0 && bb.h > 0) { const png = await pdf.embedPng(gradientPng(bb, brush, m)); page.pushOperators(pushGraphicsState(), ...clipOps(at.Data, m, H), clip(), endPath()); page.drawImage(png, { x: bb.x * K, y: (H - (bb.y + bb.h)) * K, width: bb.w * K, height: bb.h * K }); page.pushOperators(popGraphicsState()); }
          } else if (brush && brush.kind === 'img') {
            const im = await img(brush.at.ImageSource); const bb = bboxPage(at.Data, m); if (im && bb.w > 0) page.drawImage(im, { x: bb.x * K, y: (H - (bb.y + bb.h)) * K, width: bb.w * K, height: bb.h * K, opacity: op });
          } else {
            const fill = hex(at.Fill), stroke = hex(at.Stroke), sw = parseFloat(at.StrokeThickness) || 0;
            const o = { x: 0, y: H * K, scale: K }; if (fill) { o.color = fill; o.opacity = op; } if (stroke) { o.borderColor = stroke; o.borderWidth = (sw || 1) * scaleOf(m) * K; o.borderOpacity = op; }
            try { page.drawSvgPath(svgPath(at.Data, m), o); } catch (e) {}
          }
        }
        else if (tag === 'Glyphs' && at.UnicodeString != null) {
          const font = (at.FontUri && fontByUri[at.FontUri]) || fallback; const em = parseFloat(at.FontRenderingEmSize) || 12;
          const [X, Y] = ap(ctm, parseFloat(at.OriginX) || 0, parseFloat(at.OriginY) || 0);
          const txt = at.UnicodeString;
          try { page.drawText(txt, { x: X * K, y: (H - Y) * K, size: em * scaleOf(ctm) * K, font, color: hex(at.Fill) || rgb(0, 0, 0), opacity: op, rotate: degrees(-angleOf(ctm)) }); } catch (e) {}
        }
        else { await walk(node.children, page, H, ctm, op); }
        if (clipped) page.pushOperators(popGraphicsState());
      }
    }

    const pageNames = Object.keys(files).filter(n => /\.fpage$/i.test(n)).sort();
    if (!pageNames.length) throw new Error('Not a valid XPS (no page found).');
    for (const pn of pageNames) {
      const root = parseXml(decode(files[pn]));
      const fp = root.tag === 'FixedPage' ? root : null; if (!fp) continue;
      const W = parseFloat(fp.attrs.Width), H = parseFloat(fp.attrs.Height);
      const page = pdf.addPage([W * K, H * K]);
      await walk(fp.children, page, H, ID, 1);
    }
    return pdf.save();
  }

  global.XPS = { convertToPdf };
})(window);
