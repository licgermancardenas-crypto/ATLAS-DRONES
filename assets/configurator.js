/* ============================================================================
   AERONEX · Configurador de misión
   Toma los requisitos de la operación y puntúa cada aeronave del catálogo en
   cuatro ejes: ajuste a la misión, operabilidad en Argentina, valor industrial
   y costo total de propiedad a tres años.
   ========================================================================== */
(function () {
  'use strict';
  var A = window.AERONEX;
  var form = document.getElementById('cfgForm');
  if (!form || !A) return;

  var out = document.getElementById('cfgResult');
  /* Devuelve el control del formulario por su atributo name. */
  function campo(name) { return form.querySelector('[name="' + name + '"]'); }
  var clamp = function (n, a, b) { return Math.max(a, Math.min(b, n)); };
  var pct = function (n) { return Math.round(clamp(n, 0, 100)); };

  /* ------------------------------------------------------------ puntuaciones */

  /* Ajuste a la misión: ¿el equipo puede hacer el trabajo pedido? */
  function missionFit(ac, req) {
    var s = 0;
    var need = req.sensors.length ? req.sensors : ['rgb'];
    var cubiertos = need.filter(function (x) { return ac.sensors.indexOf(x) >= 0; }).length;
    var jornada = ac.coverageHaHora * (ac.enduranceMin / 60);
    s += (cubiertos / need.length) * 34;                                   // sensores
    s += clamp(ac.enduranceMin / req.enduranceMin, 0, 1) * 12;             // autonomía
    s += clamp(ac.rangeKm / req.rangeKm, 0, 1) * 8;                        // alcance
    s += (ac.accuracyCm <= req.accuracyCm ? 1 : clamp(req.accuracyCm / ac.accuracyCm, 0, 1)) * 16; // precisión
    s += clamp(ac.payloadKg / Math.max(req.payloadKg, .1), 0, 1) * 8;      // carga útil
    s += (ac.industries.indexOf(req.industry) >= 0 ? 8 : 0);               // industria
    /* cobertura: decisivo cuando la misión abarca miles de hectáreas */
    s += (req.areaHa > 0 ? clamp(jornada / req.areaHa, 0, 1) : clamp(ac.enduranceMin / 55, 0, 1)) * 14;
    return pct(s);
  }

  /* Operabilidad en Argentina: condiciones reales de campo y soporte local. */
  function operability(ac, req) {
    var s = 52, notas = [];
    if (req.env === 'altura') {
      if (ac.ceilingM >= 6000) { s += 20; notas.push('techo de servicio apto para la Puna'); }
      else if (ac.ceilingM >= 5000) { s += 9; }
      else { s -= 14; notas.push('techo de servicio justo sobre 3.500 m'); }
    }
    if (req.env === 'viento') {
      if (ac.windMs >= 14) { s += 20; notas.push('tolera ráfagas patagónicas sostenidas'); }
      else if (ac.windMs >= 12) { s += 11; }
      else { s -= 12; notas.push('margen de viento ajustado para Patagonia'); }
    }
    if (req.env === 'urbano') {
      if (ac.category.indexOf('Ala fija') === 0) { s -= 16; notas.push('el ala fija necesita pista o zona de lanzamiento'); }
      else { s += 13; notas.push('despegue vertical en espacio reducido'); }
    }
    if (req.env === 'humedo') {
      if (/IP5|IP6/.test(ac.ip)) { s += 17; notas.push('sellado ' + ac.ip + ' para humedad del Litoral'); }
      else { s -= 10; notas.push('sellado ' + ac.ip + ', limitado con lluvia'); }
    }
    if (req.env === 'abierto') s += 12;

    if (ac.seller.type === 'importador') { s += 14; notas.push('importador con stock en ' + ac.seller.city); }
    else if (ac.seller.type === 'dealer') { s += 10; notas.push('dealer autorizado en ' + ac.seller.city); }
    else if (ac.seller.type === 'distribuidor') { s += 12; notas.push('distribuidor regional en ' + ac.seller.city); }

    if (req.regulatory === 'bvlos') {
      if (ac.rangeKm >= 12 && ac.enduranceMin >= 40) s += 8;
      else { s -= 10; notas.push('alcance corto para una operación más allá de la vista'); }
    }
    if (req.regulatory === 'urbano' && ac.payloadKg <= 1.2) s += 6;
    return { score: pct(s), notas: notas };
  }

  /* Valor industrial: cuánto trabajo rinde por jornada y en cuántos frentes sirve. */
  function industrialValue(ac, req) {
    var s = 0;
    var jornada = ac.coverageHaHora * (ac.enduranceMin / 60);
    if (req.areaHa > 0) s += clamp(jornada / req.areaHa, 0, 1) * 34;
    else s += clamp(ac.enduranceMin / 55, 0, 1) * 34;
    s += clamp(ac.sensors.length / 5, 0, 1) * 22;                          // versatilidad de sensores
    s += clamp(ac.industries.length / 6, 0, 1) * 22;                       // reutilización entre áreas
    s += clamp(ac.coverageHaHora / 700, 0, 1) * 22;                        // productividad bruta
    return pct(s);
  }

  /* Costo total de propiedad a tres años, en dólares. */
  function tco(ac) {
    var c = ac.costos;
    return {
      equipo: ac.precioUsd,
      payload: c.payload,
      formacion: c.capacitacion,
      baterias: c.baterias,
      servicio: c.servicioAnual * 3,
      total: ac.precioUsd + c.payload + c.capacitacion + c.baterias + c.servicioAnual * 3
    };
  }

  function evaluate(req) {
    return A.AIRCRAFT.map(function (ac) {
      var fit = missionFit(ac, req);
      var op = operability(ac, req);
      var val = industrialValue(ac, req);
      var t = tco(ac);
      var budget = req.budget > 0 ? clamp(req.budget / t.total, 0, 1) : 1;
      var score = fit * .44 + op.score * .24 + val * .2 + budget * 100 * .12;
      return { ac: ac, fit: fit, oper: op.score, notas: op.notas, value: val, tco: t, budget: pct(budget * 100), score: Math.round(score) };
    }).sort(function (a, b) { return b.score - a.score; });
  }

  /* ------------------------------------------------------------- lectura UI */
  function readForm() {
    var misionId = campo('mision').value;
    var m = A.mission(misionId);
    var sensores = Array.prototype.map.call(
      form.querySelectorAll('input[name=sensor]:checked'), function (i) { return i.value; });
    return {
      industry: campo('industria').value,
      mission: m,
      env: campo('entorno').value,
      regulatory: campo('regulatorio').value,
      enduranceMin: +campo('autonomia').value,
      rangeKm: +campo('alcance').value,
      payloadKg: +campo('carga').value,
      accuracyCm: +campo('precision').value,
      budget: +campo('presupuesto').value,
      areaHa: m ? m.profile.areaHa : 0,
      sensors: sensores
    };
  }

  /* Aplica la plantilla de misión a los controles del formulario. */
  function applyMission(id) {
    var m = A.mission(id);
    if (!m) return;
    var p = m.profile;
    campo('entorno').value = p.env;
    campo('regulatorio').value = p.regulatory;
    campo('autonomia').value = p.enduranceMin;
    campo('alcance').value = p.rangeKm;
    campo('carga').value = p.payloadKg;
    campo('precision').value = String(p.accuracyCm);
    if (campo('industria').value !== m.industry) campo('industria').value = m.industry;
    Array.prototype.forEach.call(form.querySelectorAll('input[name=sensor]'), function (i) {
      i.checked = p.sensors.indexOf(i.value) >= 0;
      i.parentElement.classList.toggle('is-on', i.checked);
    });
    syncOutputs();
  }

  function syncOutputs() {
    Array.prototype.forEach.call(form.querySelectorAll('input[type=range]'), function (r) {
      var o = form.querySelector('output[for="' + r.id + '"]');
      if (!o) return;
      var u = r.getAttribute('data-unit') || '';
      o.textContent = (r.name === 'presupuesto' ? window.atlasPrice(+r.value) : r.value + ' ' + u);
    });
  }

  /* Rellena el selector de misiones según la industria elegida. */
  function fillMissions(industria, keep) {
    var opciones = A.MISSIONS.filter(function (m) { return !industria || m.industry === industria; });
    if (!opciones.length) opciones = A.MISSIONS;
    var sel = campo('mision');
    sel.innerHTML = '';
    opciones.forEach(function (m) {
      var o = document.createElement('option');
      o.value = m.id; o.textContent = m.name;
      sel.appendChild(o);
    });
    if (keep && opciones.some(function (m) { return m.id === keep; })) sel.value = keep;
  }

  /* ------------------------------------------------------------------ render */
  function meter(label, value, warm) {
    return '<div class="meter"><div class="meter__head"><span>' + label + '</span><b>' + value + '</b></div>' +
           '<div class="meter__bar' + (warm ? ' warm' : '') + '"><i data-w="' + value + '"></i></div></div>';
  }

  function render(req) {
    var res = evaluate(req);
    var top = res[0];
    var ac = top.ac;
    var tipo = A.sellerType(ac.seller.type);
    var porque = [];
    porque.push(ac.resumen);
    if (top.notas.length) porque.push('En terreno: ' + top.notas.join(', ') + '.');
    porque.push(ac.argentina);

    var html = '' +
      '<article class="reco reveal">' +
        '<span class="reco__tag">Aeronave recomendada</span>' +
        '<p class="reco__brand">' + ac.brand + ' · ' + ac.category + ' · ' + tipo.label + ' en ' + ac.seller.city + '</p>' +
        '<h3>' + ac.model + '</h3>' +
        '<p class="reco__why">' + porque.join(' ') + '</p>' +
        '<div class="meters">' +
          meter('Ajuste a la misión', top.fit) +
          meter('Operabilidad en Argentina', top.oper) +
          meter('Valor industrial', top.value) +
          meter('Ajuste al presupuesto', top.budget, true) +
        '</div>' +
        '<div class="tco">' +
          '<div><span>Equipo</span><b>' + window.atlasPrice(top.tco.equipo) + '</b></div>' +
          '<div><span>Payload</span><b>' + window.atlasPrice(top.tco.payload) + '</b></div>' +
          '<div><span>Formación</span><b>' + window.atlasPrice(top.tco.formacion) + '</b></div>' +
          '<div><span>Servicio 3 años</span><b>' + window.atlasPrice(top.tco.servicio) + '</b></div>' +
          '<div><span>Costo total 3 años</span><b class="accent">' + window.atlasPrice(top.tco.total) + '</b></div>' +
        '</div>' +
        '<button class="btn" type="button" data-quote="' + ac.brand + ' ' + ac.model + ' · ' + (req.mission ? req.mission.name : '') + '">Solicitar cotización</button>' +
      '</article>' +
      '<div class="reveal"><h4 class="eyebrow" style="margin-bottom:14px">Alternativas evaluadas</h4><div class="alts">' +
      res.slice(1, 5).map(function (r, i) {
        return '<div class="alt">' +
          '<span class="alt__rank">' + String(i + 2).padStart(2, '0') + '</span>' +
          '<div class="alt__name"><strong>' + r.ac.brand + ' ' + r.ac.model + '</strong><span>' + r.ac.category + ' · ' + window.atlasPrice(r.tco.total) + ' a 3 años</span></div>' +
          '<div class="alt__score"><strong>' + r.score + '</strong><span>puntaje</span></div>' +
        '</div>';
      }).join('') +
      '</div></div>';

    out.innerHTML = html;
    if (window.atlasWatch) window.atlasWatch(out);
    requestAnimationFrame(function () {
      Array.prototype.forEach.call(out.querySelectorAll('.meter__bar i'), function (i) {
        i.style.width = i.getAttribute('data-w') + '%';
      });
    });
  }

  /* ------------------------------------------------------------------ eventos */
  form.addEventListener('input', function (e) {
    if (e.target.type === 'range') syncOutputs();
    if (e.target.name === 'sensor') e.target.parentElement.classList.toggle('is-on', e.target.checked);
    if (e.target.name === 'industria') { fillMissions(e.target.value); applyMission(campo('mision').value); }
    if (e.target.name === 'mision') applyMission(e.target.value);
    render(readForm());
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); render(readForm()); });
  document.addEventListener('atlas:currency', function () { syncOutputs(); render(readForm()); });

  /* arranque: misión indicada en la URL o la primera de la lista */
  var pedida = new URLSearchParams(location.search).get('mision');
  var inicial = A.mission(pedida) || A.MISSIONS[0];
  campo('industria').value = inicial.industry;
  fillMissions(inicial.industry, inicial.id);
  applyMission(inicial.id);
  render(readForm());
})();
