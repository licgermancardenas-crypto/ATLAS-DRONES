/* ============================================================================
   ATLAS DRONES · plataforma AERONEX
   Comportamiento compartido: navegación, animación de entrada, moneda,
   dibujo del mapa y modal de cotización.
   ========================================================================== */
(function () {
  'use strict';
  var A = window.AERONEX;

  /* ---------------------------------------------------------------- navegación */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* marca el enlace de la página actual */
  var here = location.pathname.split('/').pop() || 'index.html';
  Array.prototype.forEach.call(document.querySelectorAll('.nav__links a'), function (a) {
    var href = a.getAttribute('href') || '';
    if (href === here || (here === 'index.html' && href === './')) a.classList.add('is-active');
  });

  /* ------------------------------------------------------- animación de entrada */
  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })
    : null;

  function watch(root) {
    var nodes = (root || document).querySelectorAll('.reveal:not(.is-in)');
    Array.prototype.forEach.call(nodes, function (n, i) {
      n.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
      if (io) io.observe(n); else n.classList.add('is-in');
    });
  }
  watch(document);
  window.atlasWatch = watch;

  /* ------------------------------------------------------------------- moneda */
  var CUR_KEY = 'atlas-currency';
  var currency = 'USD';
  try { currency = localStorage.getItem(CUR_KEY) || 'USD'; } catch (e) {}

  function setCurrency(c) {
    currency = c;
    try { localStorage.setItem(CUR_KEY, c); } catch (e) {}
    document.dispatchEvent(new CustomEvent('atlas:currency', { detail: c }));
    Array.prototype.forEach.call(document.querySelectorAll('[data-cur]'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-cur') === c);
    });
  }
  window.atlasCurrency = function () { return currency; };
  window.atlasPrice = function (usd) { return A.price(usd, currency); };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cur]');
    if (b) setCurrency(b.getAttribute('data-cur'));
  });
  setCurrency(currency);

  /* --------------------------------------------------------------- mapa (SVG) */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs) {
    var n = document.createElementNS(SVG_NS, name);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* Dibuja el mapa dentro de `host`.
     opts.interactive  agrupa por región y emite eventos de hover y click.
     opts.cities       muestra las ciudades de referencia.
     opts.labels       muestra el nombre de cada región. */
  function drawMap(host, opts) {
    if (!host || !window.AR_GEO) return null;
    opts = opts || {};
    var geo = window.AR_GEO;
    var svg = el('svg', {
      viewBox: '0 0 ' + geo.width + ' ' + geo.height,
      role: 'img', 'aria-label': 'Mapa de Argentina por región operativa'
    });

    var groups = {};
    geo.provinces.forEach(function (p) {
      if (!groups[p.region]) {
        var g = el('g', { 'class': 'region', 'data-region': p.region });
        groups[p.region] = g;
        svg.appendChild(g);
      }
      var path = el('path', { 'class': 'prov', d: p.d, 'data-province': p.id });
      if (opts.interactive) {
        var t = el('title'); t.textContent = p.name + ' · ' + (A.region(p.region) || {}).name;
        path.appendChild(t);
      }
      groups[p.region].appendChild(path);
    });

    /* etiqueta de región en el centro de sus provincias */
    if (opts.labels) {
      Object.keys(groups).forEach(function (rid) {
        var ps = geo.provinces.filter(function (p) { return p.region === rid; });
        var cx = ps.reduce(function (a, p) { return a + p.cx; }, 0) / ps.length;
        var cy = ps.reduce(function (a, p) { return a + p.cy; }, 0) / ps.length;
        var r = A.region(rid);
        var label = el('text', { 'class': 'rlabel', x: cx.toFixed(1), y: cy.toFixed(1) });
        label.textContent = r ? r.name : rid;
        groups[rid].appendChild(label);
      });
    }

    if (opts.cities && geo.cities) {
      var gc = el('g', { 'class': 'cities' });
      geo.cities.forEach(function (c) {
        if (opts.majorOnly && !c.major) return;
        gc.appendChild(el('circle', { 'class': 'city-dot', cx: c.x, cy: c.y, r: c.major ? 3.4 : 2.2 }));
        if (c.major) {
          var t = el('text', { 'class': 'city-name', x: c.x + 7, y: c.y + 3.5 });
          t.textContent = c.name;
          gc.appendChild(t);
        }
      });
      svg.appendChild(gc);
    }

    host.appendChild(svg);

    if (opts.interactive) {
      svg.addEventListener('pointerover', function (e) {
        var g = e.target.closest('g.region');
        if (g) host.dispatchEvent(new CustomEvent('region:hover', { detail: g.getAttribute('data-region') }));
      });
      svg.addEventListener('click', function (e) {
        var g = e.target.closest('g.region');
        if (g) host.dispatchEvent(new CustomEvent('region:pick', { detail: g.getAttribute('data-region') }));
      });
    }
    return svg;
  }
  window.atlasDrawMap = drawMap;

  /* ------------------------------------------------------ modal de cotización */
  var modal = document.getElementById('quoteModal');
  if (modal) {
    var ctxLabel = modal.querySelector('#quoteContext');
    var subject = modal.querySelector('#quoteSubject');
    var lastFocus = null;

    function open(ctx) {
      lastFocus = document.activeElement;
      if (ctxLabel) ctxLabel.textContent = ctx || 'Consulta general';
      if (subject) subject.value = ctx || 'Consulta general';
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      var f = modal.querySelector('input,select,textarea');
      if (f) f.focus();
    }
    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    window.atlasQuote = open;

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-quote]');
      if (t) { e.preventDefault(); open(t.getAttribute('data-quote')); return; }
      if (e.target.closest('[data-close]') || e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  /* Los formularios no tienen backend: arman un correo con los datos cargados.
     Para recibir las consultas en una base, conectar aquí un servicio de formularios. */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-mailto]'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.formnote');
      var data = new FormData(form);
      var faltan = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        if (!String(f.value || '').trim()) faltan.push(f.previousElementSibling ? f.previousElementSibling.textContent : f.name);
      });
      if (faltan.length) {
        if (note) { note.className = 'formnote err'; note.textContent = 'Faltan datos: ' + faltan.join(', ') + '.'; }
        return;
      }
      var lineas = [];
      data.forEach(function (v, k) { if (v) lineas.push(k.toUpperCase() + ': ' + v); });
      var to = form.getAttribute('data-mailto');
      var asunto = 'Cotización · ' + (data.get('asunto') || 'ATLAS DRONES');
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(asunto) +
                      '&body=' + encodeURIComponent(lineas.join('\n'));
      if (note) { note.className = 'formnote ok'; note.textContent = 'Se abrió tu cliente de correo con la consulta lista para enviar.'; }
    });
  });

  /* ---------------------------------------------------------------- año actual */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (n) {
    n.textContent = new Date().getFullYear();
  });
})();
