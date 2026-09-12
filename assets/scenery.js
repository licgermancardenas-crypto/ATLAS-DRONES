/* ============================================================================
   AERONEX · Escenografía
   Arte vectorial original: una escena por región operativa, dibujada con la
   paleta del sistema. No usa fotografía de terceros ni depende de archivos
   externos, así que pesa nada y escala a cualquier tamaño.

   Cada escena responde al terreno que la región le impone al vuelo:
   la Puna es altura, la Pampa es superficie, la Patagonia es viento,
   el Litoral es agua, Cuyo es pendiente y el AMBA es densidad construida.

   Uso:  window.atlasScene('patagonia')  ->  string con el <svg>
   ========================================================================== */
(function () {
  'use strict';

  var W = 640, H = 300;

  /* ---------------------------------------------------------------- utilidades */

  /* Cierra una silueta de terreno contra el borde inferior del cuadro. */
  function terreno(d) { return d + ' L' + W + ',' + H + ' L0,' + H + ' Z'; }

  /* Abanico de líneas que nacen en un punto de fuga y bajan hasta el pie. */
  function surcos(vx, vy, desde, hasta, paso, color, op) {
    var out = '', x;
    for (x = desde; x <= hasta; x += paso) {
      out += '<path d="M' + vx + ',' + vy + ' L' + x + ',' + H + '" stroke="' + color +
             '" stroke-width=".7" fill="none" opacity="' + op + '"/>';
    }
    return out;
  }

  /* Banda horizontal de agua con ondulación. */
  function agua(y, amp, color, op) {
    var d = 'M0,' + y, x;
    for (x = 0; x <= W; x += 40) {
      d += ' q20,' + (-amp) + ' 40,0';
    }
    return '<path d="' + d + '" stroke="' + color + '" stroke-width="1.4" fill="none" opacity="' + op + '"/>';
  }

  /* Mancha de copa de árbol: círculos superpuestos sobre una línea de monte. */
  function monte(cx, cy, r, color, op) {
    return '<g fill="' + color + '" opacity="' + op + '">' +
      '<circle cx="' + (cx - r * .8) + '" cy="' + (cy + r * .3) + '" r="' + r * .75 + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
      '<circle cx="' + (cx + r * .85) + '" cy="' + (cy + r * .35) + '" r="' + r * .7 + '"/>' +
      '</g>';
  }

  /* Cumbre nevada: se recorta sobre las dos laderas del pico, nunca suelta. */
  function nieve(ax, ay, px, py, nx, ny, t) {
    var lx = ax + (px - ax) * t, ly = ay + (py - ay) * t;
    var rx = ax + (nx - ax) * t, ry = ay + (ny - ay) * t;
    var mx = (lx + rx) / 2, my = (ly + ry) / 2;
    return '<path d="M' + ax + ',' + ay + ' L' + rx.toFixed(1) + ',' + ry.toFixed(1) +
      ' L' + (mx + (rx - mx) * .45).toFixed(1) + ',' + (my - 4).toFixed(1) +
      ' L' + mx.toFixed(1) + ',' + (my + 3).toFixed(1) +
      ' L' + (mx + (lx - mx) * .45).toFixed(1) + ',' + (my - 5).toFixed(1) +
      ' L' + lx.toFixed(1) + ',' + ly.toFixed(1) + ' Z"/>';
  }

  /* Aerogenerador visto de frente. */
  function molino(x, base, alto) {
    var cy = base - alto;
    return '<g stroke="rgba(233,237,243,.5)" stroke-width="1.6" fill="none" stroke-linecap="round">' +
      '<path d="M' + x + ',' + base + ' L' + x + ',' + cy + '"/>' +
      '<path d="M' + x + ',' + cy + ' L' + (x - alto * .42) + ',' + (cy - alto * .2) + '"/>' +
      '<path d="M' + x + ',' + cy + ' L' + (x + alto * .38) + ',' + (cy - alto * .26) + '"/>' +
      '<path d="M' + x + ',' + cy + ' L' + (x + alto * .1) + ',' + (cy + alto * .44) + '"/>' +
      '</g>';
  }

  /* Torre de perforación: la silueta de Vaca Muerta. */
  function torre(x, base, alto) {
    var top = base - alto, a = alto * .18;
    return '<g stroke="rgba(233,237,243,.42)" stroke-width="1.4" fill="none">' +
      '<path d="M' + (x - a) + ',' + base + ' L' + (x - a * .3) + ',' + top +
        ' L' + (x + a * .3) + ',' + top + ' L' + (x + a) + ',' + base + '"/>' +
      '<path d="M' + (x - a * .78) + ',' + (base - alto * .3) + ' L' + (x + a * .78) + ',' + (base - alto * .3) + '"/>' +
      '<path d="M' + (x - a * .55) + ',' + (base - alto * .6) + ' L' + (x + a * .55) + ',' + (base - alto * .6) + '"/>' +
      '<path d="M' + (x - a) + ',' + base + ' L' + (x + a * .78) + ',' + (base - alto * .3) + '"/>' +
      '<path d="M' + (x + a) + ',' + base + ' L' + (x - a * .78) + ',' + (base - alto * .3) + '"/>' +
      '</g>';
  }

  /* Grúa torre: la silueta del AMBA en obra. */
  function grua(x, base, alto) {
    var top = base - alto;
    return '<g stroke="rgba(240,179,35,.55)" stroke-width="1.5" fill="none">' +
      '<path d="M' + x + ',' + base + ' L' + x + ',' + top + '"/>' +
      '<path d="M' + (x - 46) + ',' + top + ' L' + (x + 74) + ',' + top + '"/>' +
      '<path d="M' + x + ',' + (top - 16) + ' L' + (x + 74) + ',' + top + '"/>' +
      '<path d="M' + x + ',' + (top - 16) + ' L' + (x - 46) + ',' + top + '"/>' +
      '<path d="M' + (x + 54) + ',' + top + ' L' + (x + 54) + ',' + (top + 26) + '"/>' +
      '</g>';
  }

  /* Aeronave y traza de vuelo. Es el sujeto de toda escena. */
  function vuelo(traza, dx, dy, escala) {
    var s = escala || 1;
    return '<path class="scene__track" d="' + traza + '"/>' +
      '<g class="scene__craft" transform="translate(' + dx + ',' + dy + ') scale(' + s + ')">' +
        '<path d="M-11,-3 L-4,-3 M4,-3 L11,-3 M-11,4 L-4,4 M4,4 L11,4"/>' +
        '<rect x="-4.5" y="-2.5" width="9" height="6" rx="2"/>' +
        '<path d="M-4,-2.5 L-9.5,-7.5 M4,-2.5 L9.5,-7.5 M-4,3.5 L-9.5,8.5 M4,3.5 L9.5,8.5"/>' +
        '<circle cx="0" cy="4.6" r="1.6"/>' +
      '</g>';
  }

  /* ------------------------------------------------------------------ escenas */

  var ESCENAS = {

    /* NOA · Puna y salares. Altura sostenida, aire delgado, luz dura. */
    noa: {
      cielo: ['#241309', '#7d3f18'],
      brillo: '#e9a13c',
      alt: 'Cordón de la Puna sobre un salar del Triángulo del Litio, con la aeronave relevando pilas de acopio.',
      pintar: function () {
        return '' +
          '<circle cx="486" cy="74" r="34" fill="#f0b323" opacity=".22"/>' +
          '<circle cx="486" cy="74" r="16" fill="#f5c453" opacity=".55"/>' +
          /* cordón lejano */
          '<path d="' + terreno('M0,166 L38,138 L60,156 L96,108 L126,148 L156,128 L190,158 L226,114 ' +
            'L258,150 L292,134 L330,162 L368,122 L402,154 L440,138 L478,164 L516,130 L556,156 L596,142 L640,160') +
          '" fill="#5c3320" opacity=".62"/>' +
          /* cordón intermedio */
          '<path d="' + terreno('M0,192 L52,178 L104,190 L156,174 L214,192 L272,180 L330,194 ' +
            'L392,178 L452,192 L512,182 L578,194 L640,184') +
          '" fill="#2e1a12" opacity=".9"/>' +
          /* salar */
          '<path d="' + terreno('M0,214 L640,208') + '" fill="#120c09"/>' +
          '<g stroke="#e9a13c" fill="none" opacity=".2">' +
            '<path d="M0,230 L640,226" stroke-width=".6"/>' +
            '<path d="M0,250 L640,244" stroke-width=".7"/>' +
            '<path d="M0,276 L640,268" stroke-width=".8"/>' +
          '</g>' +
          /* piletas de evaporación en perspectiva */
          '<g opacity=".55">' +
            '<path d="M72,240 L236,236 L262,266 L54,272 Z" fill="#5ec8f5" opacity=".4"/>' +
            '<path d="M288,236 L430,233 L470,262 L306,266 Z" fill="#35d39a" opacity=".32"/>' +
            '<path d="M96,278 L300,272 L340,300 L62,300 Z" fill="#5ec8f5" opacity=".25"/>' +
          '</g>' +
          vuelo('M20,120 C160,84 300,138 430,104 S600,132 640,110', 430, 104);
      }
    },

    /* CENTRO · Pampa Húmeda. Superficie continua hasta donde llega la vista. */
    centro: {
      cielo: ['#07131c', '#1d4b46'],
      brillo: '#7fd6b0',
      alt: 'Horizonte plano de la Pampa Húmeda con los surcos de un lote convergiendo hacia el punto de fuga.',
      pintar: function () {
        return '' +
          '<circle cx="188" cy="150" r="42" fill="#f0b323" opacity=".14"/>' +
          '<circle cx="188" cy="152" r="13" fill="#f0b323" opacity=".5"/>' +
          /* línea de monte al fondo */
          '<path d="' + terreno('M0,190 Q160,183 320,188 T640,184') + '" fill="#10281f"/>' +
          monte(58, 182, 9, '#16352a', .9) + monte(214, 184, 7, '#16352a', .85) +
          monte(402, 183, 10, '#16352a', .9) + monte(556, 185, 8, '#16352a', .85) +
          /* surcos del lote */
          '<path d="' + terreno('M0,196 L640,192') + '" fill="#0a1a13"/>' +
          surcos(320, 192, -380, 1020, 46, '#35d39a', .2) +
          '<g stroke="#35d39a" fill="none" opacity=".14">' +
            '<path d="M0,214 L640,212" stroke-width=".6"/>' +
            '<path d="M0,244 L640,240" stroke-width=".7"/>' +
            '<path d="M0,284 L640,278" stroke-width=".8"/>' +
          '</g>' +
          vuelo('M40,96 C180,72 300,118 440,88 S610,110 640,92', 440, 88);
      }
    },

    /* CUYO · Andes y viñedo. El vuelo sigue la topografía, no la línea recta. */
    cuyo: {
      cielo: ['#0d1424', '#3c3054'],
      brillo: '#b9a2e8',
      alt: 'Frente cordillerano con nieve sobre las terrazas de un viñedo del Valle de Uco.',
      pintar: function () {
        return '' +
          '<circle cx="64" cy="58" r="26" fill="#cfd8ef" opacity=".18"/>' +
          '<circle cx="64" cy="58" r="11" fill="#e9edf3" opacity=".45"/>' +
          /* cordillera */
          '<path d="' + terreno('M0,178 L48,118 L86,144 L120,84 L150,116 L182,68 L214,110 L248,62 ' +
            'L286,114 L318,90 L352,128 L386,96 L420,132 L456,102 L492,138 L530,110 L566,144 L604,122 L640,148') +
          '" fill="#494066" opacity=".75"/>' +
          /* nieve en las cumbres */
          '<g fill="#e9edf3" opacity=".45">' +
            nieve(120, 84, 86, 144, 150, 116, .34) +
            nieve(182, 68, 150, 116, 214, 110, .34) +
            nieve(248, 62, 214, 110, 286, 114, .32) +
            nieve(386, 96, 352, 128, 420, 132, .3) +
          '</g>' +
          /* lomada intermedia */
          '<path d="' + terreno('M0,196 L110,178 L240,198 L390,176 L520,198 L640,182') +
          '" fill="#221d31"/>' +
          /* terrazas de viñedo en pendiente */
          '<path d="' + terreno('M0,226 L200,212 L420,230 L640,214') + '" fill="#13101b"/>' +
          '<g stroke="#8fdcff" fill="none" opacity=".18">' +
            '<path d="M0,242 Q200,228 420,246 T640,230" stroke-width=".7"/>' +
            '<path d="M0,262 Q200,246 420,266 T640,248" stroke-width=".8"/>' +
            '<path d="M0,286 Q200,268 420,290 T640,270" stroke-width=".9"/>' +
          '</g>' +
          vuelo('M24,140 C130,96 230,150 330,106 S520,140 640,104', 330, 106);
      }
    },

    /* PATAGONIA · Meseta y viento. El limitante real no es el alcance. */
    patagonia: {
      cielo: ['#050d14', '#153a4e'],
      brillo: '#5ec8f5',
      alt: 'Mesetas escalonadas de la estepa con aerogeneradores y una torre de perforación bajo viento sostenido.',
      pintar: function () {
        return '' +
          /* rachas de viento */
          '<g stroke="#8fdcff" fill="none" opacity=".2" stroke-linecap="round">' +
            '<path d="M40,52 L188,48" stroke-width="1.1"/>' +
            '<path d="M232,66 L410,60" stroke-width="1"/>' +
            '<path d="M96,84 L300,78" stroke-width=".9"/>' +
            '<path d="M366,96 L582,88" stroke-width="1.1"/>' +
            '<path d="M452,42 L618,36" stroke-width=".9"/>' +
          '</g>' +
          /* mesetas escalonadas */
          '<path d="' + terreno('M0,174 L118,174 L148,154 L298,154 L328,170 L468,170 L498,148 L640,148') +
          '" fill="#11303d" opacity=".85"/>' +
          molino(196, 154, 40) + molino(252, 154, 32) + molino(552, 148, 44) +
          '<path d="' + terreno('M0,206 L160,200 L320,210 L480,198 L640,208') + '" fill="#0c2430"/>' +
          torre(430, 206, 54) +
          /* bajada de la costa */
          '<path d="' + terreno('M0,244 L200,236 L420,250 L640,238') + '" fill="#071419"/>' +
          '<g stroke="#5ec8f5" fill="none" opacity=".16">' +
            '<path d="M0,266 L640,258" stroke-width=".7"/>' +
            '<path d="M0,288 L640,278" stroke-width=".8"/>' +
          '</g>' +
          vuelo('M18,112 C150,132 260,92 396,118 S560,96 640,120', 396, 118);
      }
    },

    /* BUENOS AIRES · AMBA. Espacio aéreo controlado y densidad construida. */
    baires: {
      cielo: ['#05080f', '#132440'],
      brillo: '#5ec8f5',
      alt: 'Perfil construido del AMBA con una grúa de obra y el río de fondo.',
      pintar: function () {
        var torres = [
          [10, 142, 34], [48, 118, 26], [80, 156, 30], [116, 96, 24], [146, 136, 32],
          [184, 160, 22], [212, 124, 30], [248, 150, 26], [280, 108, 28], [314, 146, 34],
          [354, 128, 24], [384, 162, 30], [420, 114, 26], [452, 150, 32], [490, 134, 28],
          [524, 158, 24], [554, 122, 30], [590, 148, 26], [622, 160, 18]
        ];
        var edificios = torres.map(function (t) {
          return '<rect x="' + t[0] + '" y="' + t[1] + '" width="' + t[2] + '" height="' + (232 - t[1]) + '" ' +
                 'fill="#0f1c2e" stroke="rgba(94,200,245,.22)" stroke-width=".6"/>';
        }).join('');
        /* ventanas encendidas, sembradas de forma estable */
        var luces = '', i, t, fx, fy;
        for (i = 0; i < torres.length; i++) {
          t = torres[i];
          for (fy = t[1] + 8; fy < 226; fy += 14) {
            for (fx = t[0] + 5; fx < t[0] + t[2] - 4; fx += 9) {
              if ((fx * 7 + fy * 13 + i * 29) % 5 < 2) {
                luces += '<rect x="' + fx + '" y="' + fy + '" width="3" height="4" fill="#f0b323" opacity=".5"/>';
              }
            }
          }
        }
        return '' +
          /* río al fondo */
          '<path d="' + terreno('M0,172 L640,166') + '" fill="#0d1e2e" opacity=".7"/>' +
          agua(150, 5, '#5ec8f5', .18) + agua(160, 4, '#5ec8f5', .12) +
          edificios + luces +
          grua(300, 232, 108) +
          /* avenida en primer plano */
          '<path d="' + terreno('M0,232 L640,232') + '" fill="#080e18"/>' +
          surcos(320, 234, -260, 900, 64, '#5ec8f5', .14) +
          vuelo('M26,78 C140,58 280,96 420,68 S580,88 640,66', 420, 68);
      }
    },

    /* LITORAL · Delta y selva. Humedad alta y cobertura vegetal densa. */
    litoral: {
      cielo: ['#081310', '#1b4030'],
      brillo: '#35d39a',
      alt: 'Brazos del Paraná entre monte cerrado, con niebla baja al amanecer.',
      pintar: function () {
        var copas = '', x;
        for (x = -10; x < W + 20; x += 26) {
          copas += monte(x, 186 + ((x * 5) % 9) - 4, 12 + ((x * 3) % 7), '#0f2a1c', .95);
        }
        return '' +
          '<circle cx="158" cy="118" r="46" fill="#f0b323" opacity=".12"/>' +
          '<circle cx="158" cy="120" r="15" fill="#f0b323" opacity=".42"/>' +
          /* isla lejana */
          '<path d="' + terreno('M0,178 Q140,170 300,176 T640,172') + '" fill="#122f21" opacity=".8"/>' +
          /* niebla baja */
          '<g fill="#e9edf3">' +
            '<rect x="0" y="164" width="640" height="7" opacity=".08"/>' +
            '<rect x="0" y="176" width="640" height="5" opacity=".06"/>' +
          '</g>' +
          copas +
          /* brazo de río */
          '<path d="' + terreno('M0,212 Q160,206 320,214 T640,208') + '" fill="#0c2630"/>' +
          agua(226, 6, '#5ec8f5', .26) + agua(244, 7, '#5ec8f5', .2) +
          agua(264, 8, '#5ec8f5', .16) + agua(286, 9, '#5ec8f5', .12) +
          /* camalotes */
          monte(96, 250, 7, '#14331f', .8) + monte(392, 268, 9, '#14331f', .75) +
          vuelo('M30,104 C150,134 280,92 400,124 S560,98 640,126', 400, 124);
      }
    }
  };

  /* ------------------------------------------------------------------ salida */

  var serie = 0;

  /* Devuelve el SVG de la región pedida. Sin coincidencia, cae en la Pampa. */
  function escena(id) {
    var e = ESCENAS[id] || ESCENAS.centro;
    var uid = id + '-' + (++serie);
    var g = 'sky-' + uid;
    return '<svg class="scene__svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
        'aria-label="' + e.alt + '" preserveAspectRatio="xMidYMid slice">' +
        '<defs>' +
          '<linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + e.cielo[0] + '"/>' +
            '<stop offset="1" stop-color="' + e.cielo[1] + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="h-' + uid + '" cx=".5" cy=".62" r=".7">' +
            '<stop offset="0" stop-color="' + e.brillo + '" stop-opacity=".22"/>' +
            '<stop offset="1" stop-color="' + e.brillo + '" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#' + g + ')"/>' +
        '<rect width="' + W + '" height="' + H + '" fill="url(#h-' + uid + ')"/>' +
        e.pintar() +
        /* velo inferior: funde la escena con el fondo de la página */
        '<rect y="' + (H - 110) + '" width="' + W + '" height="110" fill="url(#fade-' + uid + ')"/>' +
        '<defs><linearGradient id="fade-' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#07080a" stop-opacity="0"/>' +
          '<stop offset="1" stop-color="#07080a" stop-opacity=".92"/>' +
        '</linearGradient></defs>' +
      '</svg>';
  }

  window.atlasScene = escena;
  window.atlasSceneAlt = function (id) { return (ESCENAS[id] || ESCENAS.centro).alt; };
})();
