/* ============================================================================
   AERONEX · Argentina desde el aire
   Mapa interactivo por región operativa con panel de detalle.
   ========================================================================== */
(function () {
  'use strict';
  var A = window.AERONEX;
  var host = document.getElementById('mapStage');
  var panel = document.getElementById('mapPanel');
  var tabs = document.getElementById('regionTabs');
  if (!host || !A) return;

  var svg = window.atlasDrawMap(host, { interactive: true, labels: true, cities: true });
  var actual = null;

  function paint(id) {
    Array.prototype.forEach.call(svg.querySelectorAll('g.region'), function (g) {
      var on = g.getAttribute('data-region') === id;
      g.classList.toggle('is-on', on);
      g.classList.toggle('is-dim', !on);
    });
    Array.prototype.forEach.call(tabs.querySelectorAll('button'), function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-region') === id);
    });
  }

  function detalle(id) {
    if (id === actual) return;
    actual = id;
    var r = A.region(id);
    if (!r) return;
    paint(id);

    var industrias = r.industries.map(function (i) {
      var ind = A.industry(i);
      return '<a class="chip" href="marketplace.html?industria=' + i + '">' + (ind ? ind.name : i) + '</a>';
    }).join('');

    var aeronaves = r.aircraft.map(function (a) {
      var ac = A.aircraft(a);
      return ac ? '<li>' + ac.brand + ' ' + ac.model + ' <span style="color:var(--tx-3)">· ' + ac.category + '</span></li>' : '';
    }).join('');

    var misiones = r.missions.map(function (m) {
      var mi = A.mission(m);
      return mi ? '<a class="chip chip--ac" href="configurador.html?mision=' + m + '">' + mi.name + '</a>' : '';
    }).join('');

    panel.innerHTML = '' +
      '<div class="scene">' + window.atlasScene(r.id) + '</div>' +
      '<div class="mappanel__top">' +
        '<h3>' + r.name + '</h3>' +
        '<p>' + r.full + ' · industria principal: ' + r.primary + '</p>' +
      '</div>' +
      '<div class="mappanel__body">' +
        '<div class="pblock"><h4>Provincias</h4><div class="chips">' +
          r.provinces.map(function (p) { return '<span class="chip">' + p + '</span>'; }).join('') +
        '</div></div>' +
        '<div class="pblock"><h4>Aplicaciones con drones</h4><ul>' +
          r.applications.map(function (a) { return '<li>' + a + '</li>'; }).join('') +
        '</ul></div>' +
        '<div class="pblock"><h4>Aeronaves disponibles</h4><ul>' + aeronaves + '</ul></div>' +
        '<div class="pblock"><h4>Tipos de misión</h4><div class="chips">' + misiones + '</div></div>' +
        '<div class="pblock"><h4>Industrias activas</h4><div class="chips">' + industrias + '</div></div>' +
        '<div class="pblock"><div class="pstats">' +
          r.stats.map(function (s) { return '<div><span>' + s[0] + '</span><b>' + s[1] + '</b></div>'; }).join('') +
          '<div><span>Referencia</span><b>' + r.landmark + '</b></div>' +
        '</div></div>' +
        '<div class="pblock"><p class="pnote">' + r.note + '</p></div>' +
      '</div>';
  }

  /* pestañas de región */
  tabs.innerHTML = A.REGIONS.map(function (r) {
    return '<button type="button" data-region="' + r.id + '">' + r.name + '</button>';
  }).join('');
  tabs.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) detalle(b.getAttribute('data-region'));
  });

  host.addEventListener('region:hover', function (e) { detalle(e.detail); });
  host.addEventListener('region:pick', function (e) { detalle(e.detail); });

  var pedida = new URLSearchParams(location.search).get('region');
  detalle(A.region(pedida) ? pedida : 'patagonia');
})();
