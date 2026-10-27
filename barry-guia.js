/*! Barry guía — Tecno Ofertas · v1.1 (27/10/2026)
 * Mascota que guía la compra en la PÁGINA DE PRODUCTO de la Tienda Nube (no entra al pago).
 * No lee formularios, no guarda datos del cliente, no manda nada a ningún lado.
 * En el navegador del cliente guarda sólo: dónde lo dejó (barryGuiaPos) y si lo escondió (barryGuiaChau, por sesión).
 * Apagado de emergencia: borrar la etiqueta que lo carga (o poner window.BARRY_GUIA_APAGADO = true antes).
 */
(function(){
'use strict';
if (window.__barryGuia || window.BARRY_GUIA_APAGADO) return; window.__barryGuia = 1;

// ---------- configuración ----------
var SCRIPT = document.currentScript;
var BASE = (SCRIPT && SCRIPT.getAttribute('data-base')) || window.BARRY_GUIA_BASE || '';
if (BASE && BASE.slice(-1) !== '/') BASE += '/';
// Productos donde aparece (piloto: sólo la linterna). Los textos son copia de la descripción publicada.
var PRODUCTOS = {
  '374914335': {
    hola: '¡Hola! Soy Barry. ¿Te muestro lo que tiene esta linterna? (Si te molesto, arrastrame a otro lado.)',
    datos: ['Hasta 1000 lúmenes y 240 m de alcance.', 'Imán, cortacinturón y rompevidrios.', 'Batería de 3100 mAh con carga USB-C.'],
    letra: 'Antes de comprar, sabé que es IPX4: aguanta salpicaduras y lluvia liviana, pero no es sumergible.',
    letra2: 'Esto te lo digo antes de que compres: no incluye cargador de pared, y las más de 90 horas son sólo con la luz lateral intermitente.'
  }
};

// ---------- ¿qué producto es? ----------
function idProducto(){
  try { if (window.LS && LS.product && LS.product.id) return String(LS.product.id); } catch(e){}
  var f = document.querySelector('[data-store^="product-form-"]');
  return f ? f.getAttribute('data-store').replace('product-form-','') : '';
}
var ID = idProducto(), P = PRODUCTOS[ID];
if (!P || !BASE) return;

var ss = function(k,v){ try{ if(v===undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k,v);}catch(e){ return null; } };
var ls = function(k,v){ try{ if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v);}catch(e){ return null; } };

function empezar(){
// ---------- estilos (todo con prefijo bg- para no chocar con la tienda) ----------
var css = ''
+ '#bg-barry{position:fixed;z-index:9990;left:8px;bottom:8px;width:96px;height:136px;pointer-events:none;font-family:inherit;'
+ 'transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .3s,left .35s ease,bottom .35s ease}'
+ '#bg-barry.bg-fuera{transform:translateY(160%)}#bg-barry.bg-cede{opacity:.28}#bg-barry.bg-cede *{pointer-events:none!important}'
+ '#bg-barry.bg-arr{transition:none}#bg-barry.bg-arr .bg-cuerpo{transform:scale(1.08) rotate(-4deg);cursor:grabbing}'
+ '#bg-barry .bg-cuerpo{position:relative;width:96px;height:136px;pointer-events:auto;cursor:grab;touch-action:none;transition:transform .15s;'
+ 'filter:drop-shadow(0 6px 8px rgba(0,0,0,.18));-webkit-user-select:none;user-select:none;outline-offset:3px}'
+ '#bg-barry .bg-cuerpo video,#bg-barry .bg-cuerpo img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;max-width:none;margin:0;padding:0;border:0;background:none}'
+ '#bg-barry .bg-globo{pointer-events:auto;position:absolute;bottom:70px;left:calc(100% + 4px);width:max-content;max-width:min(250px,calc(100vw - 130px));'
+ 'box-sizing:border-box;background:#fff;color:#111214;border:2px solid #111214;border-radius:14px;padding:10px 12px;font-size:13.5px;line-height:1.4;'
+ 'box-shadow:3px 3px 0 #111214;text-align:left;transform-origin:0 100%;animation:bg-pop .35s cubic-bezier(.3,1.5,.5,1)}'
+ '#bg-barry.bg-der .bg-globo{left:auto;right:calc(100% + 4px);transform-origin:100% 100%}'
+ '#bg-barry .bg-globo:before{content:"";position:absolute;left:-10px;bottom:14px;border:8px solid transparent;border-right-color:#111214;border-left:0}'
+ '#bg-barry.bg-der .bg-globo:before{left:auto;right:-10px;border-right-color:transparent;border-left:8px solid #111214;border-right:0}'
+ '#bg-barry .bg-acc{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}'
+ '#bg-barry .bg-acc button{font:inherit;font-size:12.5px;font-weight:500;border:1.5px solid #111214;background:#fff;color:#111214;border-radius:999px;padding:4px 10px;cursor:pointer;margin:0;line-height:1.3}'
+ '#bg-barry .bg-acc button.bg-si{background:#D7E626}'
+ '#bg-barry .bg-x{position:absolute;top:-14px;right:-14px;width:32px;height:32px;border-radius:50%;border:2px solid #111214;background:#fff;color:#111214;font:16px/1 sans-serif;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center}'
+ '#bg-barry.bg-der .bg-x{right:auto;left:-14px}'
+ '#bg-llamar{position:fixed;z-index:9990;left:10px;bottom:12px;font:inherit;font-size:13px;font-weight:600;border:2px solid #111214;background:#D7E626;color:#111214;border-radius:999px;padding:8px 14px;box-shadow:2px 2px 0 #111214;cursor:pointer}'
+ '@keyframes bg-pop{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}'
+ '@media (prefers-reduced-motion:reduce){#bg-barry,#bg-barry .bg-globo{transition:none;animation:none}}';
var st = document.createElement('style'); st.id='bg-estilos'; st.textContent = css; document.head.appendChild(st);

// ---------- piezas ----------
var barry = document.createElement('div'); barry.id='bg-barry'; barry.className='bg-fuera';
barry.innerHTML = '<div class="bg-cuerpo" tabindex="0" role="button" aria-label="Barry, el ayudante de Tecno Ofertas. Enter para hablar, flechas para moverlo de lado."></div>'
 + '<div class="bg-globo" hidden><button type="button" class="bg-x" aria-label="Esconder a Barry">×</button><div class="bg-txt" aria-live="polite"></div><div class="bg-acc"></div></div>';
var llamar = document.createElement('button'); llamar.id='bg-llamar'; llamar.type='button'; llamar.hidden=true; llamar.textContent='Llamar a Barry';
document.body.appendChild(barry); document.body.appendChild(llamar);
var cuerpo = barry.querySelector('.bg-cuerpo'), globo = barry.querySelector('.bg-globo'), gTxt = barry.querySelector('.bg-txt'), gAcc = barry.querySelector('.bg-acc');

// ---------- animaciones ----------
var ua = navigator.userAgent;
var esApple = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) || (/Safari/.test(ua) && !/Chrome|Chromium|CriOS|FxiOS|Edg|Android/.test(ua));
var EXT = esApple ? '.webp' : '.webm';   // el iPhone no muestra la transparencia del WebM
var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
var medio, blobs = {}, actual = '', tT = 0;
if (esApple) { medio = document.createElement('img'); medio.alt = 'Barry'; medio.draggable = false; }
else { medio = document.createElement('video'); medio.muted = true; medio.playsInline = true; medio.setAttribute('playsinline',''); medio.setAttribute('aria-hidden','true'); }
cuerpo.appendChild(medio);
function traer(n){
  if (blobs[n] !== undefined) return Promise.resolve(blobs[n]);
  return fetch(BASE + 'tomas/' + n + EXT, {mode:'cors'}).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
    .then(function(b){ blobs[n]=b; return b; }).catch(function(){ blobs[n]=null; return null; });
}
function toma(n, unaVez){
  actual = n;
  traer(n).then(function(b){
    if (actual !== n) return;
    var url = b ? URL.createObjectURL(b) : BASE + 'tomas/' + n + EXT + (esApple ? '?r=' + Date.now() : '');
    if (esApple) { var viejo = medio.src; medio.src = url; if (viejo && viejo.indexOf('blob:') === 0) setTimeout(function(){ URL.revokeObjectURL(viejo); }, 1500); }
    else { medio.loop = !unaVez; medio.src = url; if (quieto) { try{ medio.currentTime = unaVez ? 1.2 : 0; }catch(e){} } else { var p = medio.play(); if (p && p.catch) p.catch(function(){}); } }
  });
  clearTimeout(tT);
  if (!unaVez && n !== 'respira') tT = setTimeout(function(){ if (actual === n) toma('respira'); }, n === 'festeja' ? 5000 : 3400);
}

// ---------- sonido (sólo si el cliente lo pide) ----------
var ac = null, sonido = false;
function blip(t){
  if (!sonido || !ac) return;
  try {
    var o = ac.createOscillator(), g = ac.createGain(), z = ac.currentTime;
    var f = {hola:[520,780], foto:[660,990], festeja:[523,1046]}[t] || [600,800];
    o.type='triangle'; o.frequency.setValueAtTime(f[0],z); o.frequency.exponentialRampToValueAtTime(f[1],z+.12);
    g.gain.setValueAtTime(.0001,z); g.gain.exponentialRampToValueAtTime(.18,z+.02); g.gain.exponentialRampToValueAtTime(.0001,z+.22);
    o.connect(g); g.connect(ac.destination); o.start(z); o.stop(z+.25);
  } catch(e){}
}

// ---------- globo ----------
var tG = 0;
function decir(txt, acc){
  acc = acc || [];
  gTxt.textContent = txt; gAcc.innerHTML = '';
  acc.forEach(function(a){ var b=document.createElement('button'); b.type='button'; b.textContent=a.t; if(a.si) b.className='bg-si'; b.onclick=a.f; gAcc.appendChild(b); });
  globo.hidden = true; void globo.offsetWidth; globo.hidden = false;
  clearTimeout(tG); if (!acc.length) tG = setTimeout(function(){ globo.hidden = true; }, 6500);
  requestAnimationFrame(function(){ ubicar(false); });
}
var visible = function(){ return !escondido; };
var escondido = false, ultimo = Date.now(), paso = 0, dijoLetra = false, vioLetra = false, avisoIdle = false, dijoArr = false;
var toque = function(){ ultimo = Date.now(); };

// ---------- dónde se para: siempre en un lugar sin botones ----------
var M = 8, AL = 136, AN = 96;
var pref = null; try { pref = JSON.parse(ls('barryGuiaPos') || 'null'); } catch(e){}
var cur = {x:M, ab:M}, ancla = null;
function topeArriba(){
  var t = 0;
  document.querySelectorAll('header, .js-head-main, [data-store="head"]').forEach(function(h){
    var cs = getComputedStyle(h); if (cs.position === 'fixed' || cs.position === 'sticky') { var r = h.getBoundingClientRect(); if (r.top <= 2) t = Math.max(t, r.bottom); }
  });
  return t + 6;
}
function cajas(){
  var duras = [], blandas = [], A = innerWidth * innerHeight;
  document.querySelectorAll('a[href],button,input:not([type="hidden"]),select,textarea,iframe,[role="button"],label').forEach(function(el){
    if (el.closest('#bg-barry,#bg-llamar')) return;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return;
    var cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.opacity === '0') return;
    // los enlaces gigantes (por ejemplo la foto entera) cuentan como "evitable", no como botón
    (r.width * r.height > A * 0.2 ? blandas : duras).push(r);
  });
  document.querySelectorAll('[data-store^="product-image-"]').forEach(function(el){ var r = el.getBoundingClientRect(); if (r.width) blandas.push(r); });
  return {duras: duras, blandas: blandas};
}
function cruce(a, b, p){ p = p === undefined ? 6 : p; var w = Math.min(a.right+p, b.right) - Math.max(a.left-p, b.left), h = Math.min(a.bottom+p, b.bottom) - Math.max(a.top-p, b.top); return w > 0 && h > 0 ? w*h : 0; }
function rectEn(x, ab){ var t = innerHeight - ab - AL; return {left:x, right:x+AN, top:t, bottom:t+AL}; }
function rectGlobo(x, ab, lado){
  if (globo.hidden) return null; var w = globo.offsetWidth || 220, h = globo.offsetHeight || 70, b = innerHeight - ab - 70;
  return lado === 'der' ? {left:x-4-w, right:x-4, top:b-h, bottom:b} : {left:x+AN+4, right:x+AN+4+w, top:b-h, bottom:b};
}
function puntaje(x, ab, c){
  var lado = (x + AN/2) > innerWidth/2 ? 'der' : 'izq', r = rectEn(x, ab), g = rectGlobo(x, ab, lado), duro = 0, blando = 0, gd = 0;
  c.duras.forEach(function(b){ duro += cruce(r, b); if (g) gd += cruce(g, b, 2); });
  c.blandas.forEach(function(b){ blando += cruce(r, b, 0); if (g) blando += cruce(g, b, 0) * .5; });
  var q = ancla || pref || {lado:'izq', ab:M};
  var dist = Math.abs(ab - q.ab) + (lado === q.lado ? 0 : 400);
  var tapado = g && g.top - 16 < topeArriba() ? 100000 : 0;
  return {s: duro*60 + gd*40 + blando*.4 + dist + tapado, duro: duro, gd: gd + (tapado ? 1 : 0), lado: lado};
}
function ubicar(forzar){
  if (escondido || barry.classList.contains('bg-arr')) return;
  var c = cajas(), ahora = puntaje(cur.x, cur.ab, c);
  if (!forzar && ahora.duro === 0 && ahora.gd === 0) { barry.classList.remove('bg-cede'); return; }
  var maxAb = Math.max(M, innerHeight - topeArriba() - AL), mejor = null;
  ancla = forzar ? null : {lado: (cur.x + AN/2) > innerWidth/2 ? 'der' : 'izq', ab: cur.ab};
  [M, innerWidth - AN - M].forEach(function(x){ for (var ab = M; ab <= maxAb; ab += 14) { var p = puntaje(x, ab, c); if (!mejor || p.s < mejor.s) { mejor = p; mejor.x = x; mejor.ab = ab; } } });
  ancla = null;
  if (!mejor) return;
  cur = {x: mejor.x, ab: mejor.ab}; pintar(mejor.lado);
  barry.classList.toggle('bg-cede', mejor.duro > 0);
}
function pintar(lado){ barry.classList.toggle('bg-der', lado === 'der'); barry.style.left = cur.x + 'px'; barry.style.bottom = cur.ab + 'px'; }
var tS = 0, ultRev = 0, revPend = 0;
function revisarAlDeslizar(){
  revPend = 0; ultRev = Date.now();
  if (!escondido) barry.classList.toggle('bg-cede', puntaje(cur.x, cur.ab, cajas()).duro > 0);
  else if (!llamar.hidden) ubicarLlamar();
}
addEventListener('scroll', function(){
  var falta = 150 - (Date.now() - ultRev);
  if (!revPend) revPend = setTimeout(revisarAlDeslizar, Math.max(0, falta));
  clearTimeout(tS); tS = setTimeout(function(){ if (escondido) ubicarLlamar(); else ubicar(false); }, 600);
}, {passive:true});
addEventListener('resize', function(){ clearTimeout(tS); tS = setTimeout(function(){ ubicar(true); }, 150); });

// ---------- arrastrar ----------
var arr = null;
cuerpo.addEventListener('pointerdown', function(e){
  if (escondido) return;
  arr = {id:e.pointerId, x0:e.clientX, y0:e.clientY, dx:e.clientX-cur.x, dy:e.clientY-(innerHeight-cur.ab-AL), movio:false};
  try { cuerpo.setPointerCapture(e.pointerId); } catch(err){}
});
cuerpo.addEventListener('pointermove', function(e){
  if (!arr || e.pointerId !== arr.id) return;
  if (!arr.movio && Math.hypot(e.clientX-arr.x0, e.clientY-arr.y0) < 8) return;
  if (!arr.movio) { arr.movio = true; barry.classList.add('bg-arr'); barry.classList.remove('bg-cede'); globo.hidden = true; }
  var x = Math.min(Math.max(e.clientX-arr.dx, M), innerWidth-AN-M), top = Math.min(Math.max(e.clientY-arr.dy, topeArriba()), innerHeight-AL-M);
  cur = {x:x, ab: innerHeight-top-AL}; pintar((x + AN/2) > innerWidth/2 ? 'der' : 'izq');
});
function soltar(e){
  if (!arr || e.pointerId !== arr.id) return;
  var movio = arr.movio; arr = null; barry.classList.remove('bg-arr');
  if (!movio) { tocarBarry(); return; }
  pref = {lado: (cur.x + AN/2) > innerWidth/2 ? 'der' : 'izq', ab: cur.ab}; ls('barryGuiaPos', JSON.stringify(pref)); toque();
  ubicar(true);
  if (!dijoArr) { dijoArr = true; decir('¡Listo! Me quedo por acá. Si te molesto, arrastrame otra vez.'); }
}
cuerpo.addEventListener('pointerup', soltar); cuerpo.addEventListener('pointercancel', soltar);
cuerpo.addEventListener('keydown', function(e){
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tocarBarry(); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { pref = {lado: e.key === 'ArrowLeft' ? 'izq' : 'der', ab: cur.ab}; ls('barryGuiaPos', JSON.stringify(pref)); ubicar(true); }
});
function tocarBarry(){ if (escondido) return; toque(); blip('hola'); toma('festeja'); decir('¡Eso hace cosquillas! Tocá la foto, que ahí está lo bueno.'); }

// ---------- esconder / llamar ----------
function ubicarLlamar(){
  if (llamar.hidden) return;
  var r0 = llamar.getBoundingClientRect(), w = r0.width || 140, h = r0.height || 38, c = cajas(), mejor = null;
  [10, innerWidth - w - 10].forEach(function(x){ for (var ab = 12; ab <= innerHeight - topeArriba() - h; ab += 12) {
    var t = innerHeight - ab - h, r = {left:x, right:x+w, top:t, bottom:t+h}, d = 0;
    c.duras.forEach(function(b){ d += cruce(r, b, 4); });
    var s = d * 60 + ab + (x > 10 ? 200 : 0); if (!mejor || s < mejor.s) mejor = {s:s, x:x, ab:ab}; } });
  if (mejor) { llamar.style.left = mejor.x + 'px'; llamar.style.bottom = mejor.ab + 'px'; }
}
barry.querySelector('.bg-x').addEventListener('click', function(){ escondido = true; ss('barryGuiaChau','1'); globo.hidden = true; barry.classList.add('bg-fuera'); llamar.hidden = false; ubicarLlamar(); });
llamar.addEventListener('click', function(){ escondido = false; ss('barryGuiaChau','0'); llamar.hidden = true; barry.classList.remove('bg-fuera'); ubicar(true); toma('respira'); decir('Acá estoy. Tocá la foto si querés que te cuente algo.'); });

// ---------- el recorrido ----------
// el precio por transferencia se lee de la página en el momento (nunca escrito a mano): si no está, Barry no dice ningún monto
function precioTransferencia(){
  var raiz = document.querySelector('[data-store^="product-info-"]') || document.body, it = document.createNodeIterator(raiz, NodeFilter.SHOW_ELEMENT), el;
  while ((el = it.nextNode())) {
    var t = (el.textContent || '').replace(/\s+/g, ' ');
    var m = t.length < 200 && t.match(/(\$\s?[\d.]+(?:,\d{2})?)\s*con\s+transferencia/i);   // el monto que está justo antes de "con Transferencia"
    if (m) return m[1].replace(/\s/g, '');
  }
  return '';
}
function guiar(){ toque(); traer('sonrie'); toma('busca'); decir('Tocá la foto y te cuento lo importante.'); }
function tocoFoto(){
  toque(); if (escondido) return; blip('foto');
  if (paso < P.datos.length) {
    toma('sonrie'); decir((paso === 0 ? '¡Uy, me encandiló! ' : '') + P.datos[paso]); paso++;
    if (paso === P.datos.length) setTimeout(function(){ if (actual !== 'sonrie' && !escondido) letraChica(); }, 3800);
  } else if (!dijoLetra) letraChica(); else toma('sonrie');
}
var antes = null;
(function(){ var d = document.querySelector('[data-store^="product-description-"]'); if (!d) return;
  var cand = d.querySelectorAll('h1,h2,h3,h4,h5,p,strong,b,div'); for (var i = 0; i < cand.length; i++) { if (/^\s*Antes de comprar/i.test(cand[i].textContent) && cand[i].textContent.length < 60) { antes = cand[i]; break; } } })();
function letraChica(){
  if (dijoLetra) return; dijoLetra = true; vioLetra = true; traer('festeja'); toma('busca');
  var acc = [{t:'Ir a comprar', si:1, f:function(){ var b = document.querySelector('[data-store="product-buy-button"]'); if (b) { b.scrollIntoView({behavior:'smooth', block:'center'}); } }}];
  if (antes) acc.unshift({t:'Ver la letra chica', f:function(){ antes.scrollIntoView({behavior:'smooth', block:'center'}); }});
  decir(P.letra, acc);
}
if (antes && 'IntersectionObserver' in window) new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting && !vioLetra && !escondido && paso > 0) { vioLetra = true; toma('busca'); decir(P.letra2); } }); }, {threshold:.6}).observe(antes);

// clics en la página real (no se frena nada de la tienda: Barry sólo reacciona)
document.addEventListener('click', function(e){
  var t = e.target; if (!t || !t.closest || t.closest('#bg-barry,#bg-llamar')) return;
  if (t.closest('[data-store="product-buy-button"]')) { toque(); if (!escondido) { blip('festeja'); toma('festeja'); var pt = precioTransferencia(); decir(pt ? '¡Buena elección! Pagando por transferencia te sale ' + pt + '.' : '¡Buena elección!'); } return; }
  if (t.closest('[data-store^="product-image-"]') || t.closest('.js-product-thumb, [class*="product-thumb"]')) despuesDelModal(tocoFoto);
}, true);
// si la tienda abre la foto en pantalla completa, Barry espera a que se cierre para hablar (si no, habla escondido detrás)
function hayModal(){
  var w = innerWidth, h = innerHeight, pts = [[w/2,h/2],[w/4,h/3],[3*w/4,2*h/3]], n = 0;
  pts.forEach(function(q){ var el = document.elementFromPoint(q[0], q[1]);
    while (el && el !== document.body) { var cs = getComputedStyle(el); if ((cs.position === 'fixed') && !el.closest('#bg-barry,#bg-llamar')) { var r = el.getBoundingClientRect(); if (r.width * r.height > w * h * .6) { n++; break; } } el = el.parentElement; } });
  return n >= 2;
}
function despuesDelModal(fn){
  setTimeout(function(){ var vueltas = 0; (function esperar(){ if (hayModal() && vueltas++ < 240) return setTimeout(esperar, 500); fn(); })(); }, 450);
}

setInterval(function(){
  if (!avisoIdle && !escondido && !(gAcc.children.length && !globo.hidden) && Date.now() - ultimo > 25000) { avisoIdle = true; toma('busca'); decir('¿Seguís por acá? Más abajo está la ficha técnica completa.'); }
}, 5000);
['pointerdown','wheel','keydown','touchmove'].forEach(function(ev){ document.addEventListener(ev, toque, {passive:true}); });

// ---------- arranque ----------
if (ss('barryGuiaChau') === '1') { escondido = true; llamar.hidden = false; ubicarLlamar(); return; }
// si las animaciones no llegan (se cayó el servidor de archivos), Barry no aparece: nada de globos flotando solos
traer('respira').then(function(bl){
if (!bl) { barry.remove(); llamar.remove(); st.remove(); return; }
ubicar(true); toma('respira');
setTimeout(function(){
  if (escondido) return; barry.classList.remove('bg-fuera');
  decir(P.hola, [
    {t:'🔊 Sí, con sonido', si:1, f:function(){ try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); sonido = true; } catch(e){} blip('hola'); guiar(); }},
    {t:'Sí, sin sonido', f:function(){ sonido = false; guiar(); }}
  ]);
}, 1200);
setTimeout(function(){ traer('busca'); }, 2500);
});
}

// arranca cuando la página ya cargó (no compite con la tienda)
function cuando(){ var go = function(){ setTimeout(empezar, 800); }; if (document.readyState === 'complete') go(); else addEventListener('load', go); }
cuando();
})();
