/* ============================================================================
   AERONEX · Marketplace
   Catálogo filtrable por industria, categoría, tipo de vendedor y presupuesto.
   ========================================================================== */
(function () {
  'use strict';
  var A = window.AERONEX;
  var grid = document.getElementById('shopGrid');
  if (!grid || !A) return;

  var fIndustria = document.getElementById('fIndustria');
  var fCategoria = document.getElementById('fCategoria');
  var fVendedor  = document.getElementById('fVendedor');
  var fOrden     = document.getElementById('fOrden');
  var count      = document.getElementById('shopCount');

  /* silueta genérica según el tipo de plataforma */
  function silhouette(cat) {
    if (cat.indexOf('Ala fija') >= 0 || cat.indexOf('VTOL') >= 0) {
      return '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 12v40M8 30h48M14 30l4-6M50 30l-4-6M24 52h16"/><circle cx="32" cy="30" r="4"/></svg>';
    }
    if (cat.indexOf('agrícola') >= 0) {
      return '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="22" y="24" width="20" height="16" rx="4"/><path d="M22 28L10 18M42 28l12-10M22 36L10 46M42 36l12 10"/><circle cx="10" cy="18" r="7"/><circle cx="54" cy="18" r="7"/><circle cx="10" cy="46" r="7"/><circle cx="54" cy="46" r="7"/><path d="M26 44h12"/></svg>';
    }
    return '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="24" y="26" width="16" height="12" rx="3"/><path d="M24 28L12 16M40 28l12-12M24 36L12 48M40 36l12 12"/><circle cx="12" cy="16" r="6"/><circle cx="52" cy="16" r="6"/><circle cx="12" cy="48" r="6"/><circle cx="52" cy="48" r="6"/><circle cx="32" cy="41" r="3"/></svg>';
  }

  function card(ac) {
    var tipo = A.sellerType(ac.seller.type);
    var sensores = ac.sensors.slice(0, 3).map(function (s) { return A.SENSOR_LABEL[s]; }).join(' · ');
    return '' +
      '<article class="gear reveal">' +
        '<div class="gear__vis">' + silhouette(ac.category) +
          '<span class="gear__tier">' + ac.tier + '</span>' +
          '<span class="gear__seller">' + tipo.label + '</span>' +
        '</div>' +
        '<div class="gear__body">' +
          '<span class="gear__brand">' + ac.brand + ' · ' + ac.category + '</span>' +
          '<h3>' + ac.model + '</h3>' +
          '<p>' + ac.resumen + '</p>' +
          '<dl class="specs">' +
            '<div><dt>Autonomía</dt><dd>' + ac.enduranceMin + ' min</dd></div>' +
            '<div><dt>Alcance</dt><dd>' + ac.rangeKm + ' km</dd></div>' +
            '<div><dt>Carga útil</dt><dd>' + ac.payloadKg + ' kg</dd></div>' +
            '<div><dt>Precisión</dt><dd>±' + ac.accuracyCm + ' cm</dd></div>' +
          '</dl>' +
          '<div class="chips"><span class="chip">' + sensores + '</span><span class="chip chip--sol">' + ac.seller.city + '</span></div>' +
          '<div class="gear__foot">' +
            '<div class="gear__price"><strong>' + window.atlasPrice(ac.precioUsd) + '</strong><span>Referencia, equipo base</span></div>' +
            '<button class="btn btn--sm" type="button" data-quote="' + ac.brand + ' ' + ac.model + '">Solicitar cotización</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function apply() {
    var ind = fIndustria.value, cat = fCategoria.value, ven = fVendedor.value, ord = fOrden.value;
    var list = A.AIRCRAFT.filter(function (ac) {
      if (ind && ac.industries.indexOf(ind) < 0) return false;
      if (cat && ac.category !== cat) return false;
      if (ven && ac.seller.type !== ven) return false;
      return true;
    });
    if (ord === 'precio') list.sort(function (a, b) { return a.precioUsd - b.precioUsd; });
    else if (ord === 'autonomia') list.sort(function (a, b) { return b.enduranceMin - a.enduranceMin; });
    else if (ord === 'cobertura') list.sort(function (a, b) { return b.coverageHaHora - a.coverageHaHora; });

    grid.innerHTML = list.length
      ? list.map(card).join('')
      : '<p class="lead">No hay equipos que cumplan ese filtro. Probá ampliar la búsqueda o pedinos una cotización a medida.</p>';
    count.textContent = list.length + (list.length === 1 ? ' equipo' : ' equipos');
    if (window.atlasWatch) window.atlasWatch(grid);
  }

  /* poblar filtros desde el modelo de datos */
  A.INDUSTRIES.forEach(function (i) {
    fIndustria.insertAdjacentHTML('beforeend', '<option value="' + i.id + '">' + i.name + '</option>');
  });
  A.AIRCRAFT.map(function (a) { return a.category; })
    .filter(function (v, i, arr) { return arr.indexOf(v) === i; })
    .forEach(function (c) { fCategoria.insertAdjacentHTML('beforeend', '<option value="' + c + '">' + c + '</option>'); });
  A.SELLER_TYPES.forEach(function (s) {
    fVendedor.insertAdjacentHTML('beforeend', '<option value="' + s.id + '">' + s.label + '</option>');
  });

  [fIndustria, fCategoria, fVendedor, fOrden].forEach(function (f) { f.addEventListener('change', apply); });
  document.addEventListener('atlas:currency', apply);

  var pedida = new URLSearchParams(location.search).get('industria');
  if (pedida && A.industry(pedida)) fIndustria.value = pedida;
  apply();
})();
