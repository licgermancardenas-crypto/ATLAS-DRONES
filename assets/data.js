/* ============================================================================
   ATLAS DRONES / plataforma AERONEX
   Modelo de datos. Mercado inicial: Argentina. Estructura lista para LATAM.

   IMPORTANTE — DATOS DE REFERENCIA
   Precios y especificaciones son valores de referencia para la demo comercial.
   Confirmar con cada importador o fabricante antes de publicar en producción.
   Tipo de cambio y precios se editan solo en este archivo.
   ========================================================================== */

window.AERONEX = (function () {
  'use strict';

  /* --- Mercados. Argentina activo, el resto queda modelado para la expansión. --- */
  var MARKETS = [
    { code: 'AR', name: 'Argentina',  currency: 'ARS', locale: 'es-AR', status: 'activo',        flag: 'AR' },
    { code: 'BR', name: 'Brasil',     currency: 'BRL', locale: 'pt-BR', status: 'en preparación', flag: 'BR' },
    { code: 'CL', name: 'Chile',      currency: 'CLP', locale: 'es-CL', status: 'en preparación', flag: 'CL' },
    { code: 'UY', name: 'Uruguay',    currency: 'UYU', locale: 'es-UY', status: 'en preparación', flag: 'UY' },
    { code: 'PY', name: 'Paraguay',   currency: 'PYG', locale: 'es-PY', status: 'evaluación',     flag: 'PY' },
    { code: 'BO', name: 'Bolivia',    currency: 'BOB', locale: 'es-BO', status: 'evaluación',     flag: 'BO' },
    { code: 'PE', name: 'Perú',       currency: 'PEN', locale: 'es-PE', status: 'evaluación',     flag: 'PE' },
    { code: 'CO', name: 'Colombia',   currency: 'COP', locale: 'es-CO', status: 'evaluación',     flag: 'CO' },
    { code: 'MX', name: 'México',     currency: 'MXN', locale: 'es-MX', status: 'evaluación',     flag: 'MX' }
  ];

  /* Cotización de referencia para mostrar precios en pesos. Actualizar periódicamente. */
  var FX = { USD_ARS: 1350, actualizado: '2026-09' };

  /* --- Tipos de vendedor. La plataforma no vende: conecta oferta y demanda. --- */
  var SELLER_TYPES = [
    { id: 'importador',  label: 'Importador',            desc: 'Nacionaliza equipo y garantiza stock con factura local.' },
    { id: 'distribuidor',label: 'Distribuidor',          desc: 'Cobertura regional, logística y financiación.' },
    { id: 'dealer',      label: 'Dealer autorizado',     desc: 'Venta certificada por marca, con garantía oficial.' },
    { id: 'fabricante',  label: 'Fabricante',            desc: 'Producción propia, integración de payload a medida.' },
    { id: 'servicios',   label: 'Proveedor de servicios',desc: 'Opera la misión llave en mano, sin comprar la aeronave.' }
  ];

  /* --- Industrias argentinas. El orden define la taxonomía de toda la interfaz. --- */
  var INDUSTRIES = [
    { id: 'agro',        name: 'Agricultura',            hint: 'Pampa Húmeda, Córdoba, Santa Fe',      regions: ['centro','litoral','cuyo'] },
    { id: 'oil-gas',     name: 'Petróleo y gas',         hint: 'Vaca Muerta, Neuquén',                 regions: ['patagonia'] },
    { id: 'mineria',     name: 'Minería',                hint: 'Triángulo del Litio, Salta, San Juan', regions: ['noa','cuyo'] },
    { id: 'energia',     name: 'Energía',                hint: 'Eólica patagónica, solar cuyana',      regions: ['patagonia','cuyo','noa'] },
    { id: 'construccion',name: 'Construcción',           hint: 'AMBA, Córdoba, Rosario',               regions: ['baires','centro'] },
    { id: 'geoespacial', name: 'Geoespacial y mapeo',    hint: 'Catastro y cartografía',               regions: ['baires','centro','noa'] },
    { id: 'seguridad',   name: 'Seguridad pública',      hint: 'Policías provinciales, defensa civil', regions: ['baires','centro'] },
    { id: 'inspeccion',  name: 'Inspección industrial',  hint: 'Refinerías, plantas, silos',           regions: ['patagonia','baires','litoral'] },
    { id: 'logistica',   name: 'Logística',              hint: 'Última milla y plantas',               regions: ['baires','centro'] },
    { id: 'puertos',     name: 'Puertos',                hint: 'Rosario, Bahía Blanca, Buenos Aires',  regions: ['litoral','baires'] },
    { id: 'forestal',    name: 'Forestal',               hint: 'Misiones, Corrientes',                 regions: ['litoral'] },
    { id: 'ganaderia',   name: 'Ganadería',              hint: 'Corrientes, La Pampa, Buenos Aires',   regions: ['litoral','centro','baires'] },
    { id: 'ambiental',   name: 'Monitoreo ambiental',    hint: 'Humedales, glaciares, incendios',      regions: ['patagonia','litoral'] },
    { id: 'cine',        name: 'Cinematografía',         hint: 'Producción publicitaria y de ficción', regions: ['baires','patagonia','cuyo'] },
    { id: 'inmobiliario',name: 'Inmobiliario',           hint: 'Barrios cerrados y desarrollos',       regions: ['baires','centro'] },
    { id: 'gobierno',    name: 'Gobierno y municipios',  hint: 'Catastro y obra pública',              regions: ['baires','centro','noa','litoral'] }
  ];

  /* --- Regiones operativas. Cada una alimenta el mapa interactivo. --- */
  var REGIONS = [
    {
      id: 'noa', name: 'NOA', full: 'Noroeste Argentino',
      provinces: ['Jujuy','Salta','Tucumán','Catamarca','La Rioja','Santiago del Estero'],
      primary: 'Minería',
      industries: ['mineria','energia','geoespacial','agro'],
      applications: ['Topografía de mina a cielo abierto','Medición de acopios y pilas de lixiviación','Relevamiento de salares de litio','Control de caminos mineros'],
      missions: ['relevar-mina','medir-acopios','parque-solar','mapear-municipio'],
      aircraft: ['m350-rtk','wingtra-gen2','m4e'],
      landmark: 'Triángulo del Litio',
      note: 'Operación en altura sostenida. Puna sobre 3.500 m, aire menos denso y rendimiento de batería reducido.',
      stats: [['Altitud de trabajo','3.000 a 4.500 m'],['Ventana de vuelo','Mañana temprano'],['Dato clave','Volumen de acopio']]
    },
    {
      id: 'centro', name: 'CENTRO', full: 'Región Pampeana',
      provinces: ['Córdoba','Santa Fe','La Pampa'],
      primary: 'Agricultura',
      industries: ['agro','ganaderia','geoespacial','gobierno'],
      applications: ['Agricultura de precisión','Monitoreo de cultivo con índice verde','Imágenes multiespectrales','Prescripción de siembra variable'],
      missions: ['monitorear-2000-ha','monitorear-ganado','mapear-municipio','modelo-3d'],
      aircraft: ['m3m','ebee-x','agras-t50'],
      landmark: 'Pampa Húmeda',
      note: 'Superficies extensas y parcelas continuas. Premia autonomía y cobertura por vuelo antes que maniobrabilidad.',
      stats: [['Superficie típica','500 a 5.000 ha'],['Ventana de vuelo','Campaña gruesa'],['Dato clave','NDVI por lote']]
    },
    {
      id: 'cuyo', name: 'CUYO', full: 'Región de Cuyo',
      provinces: ['Mendoza','San Juan','San Luis'],
      primary: 'Agricultura y minería',
      industries: ['agro','mineria','energia','cine'],
      applications: ['Manejo de viñedos por cuartel','Control de riego y estrés hídrico','Topografía minera','Inspección de parques solares'],
      missions: ['monitorear-2000-ha','relevar-mina','parque-solar','modelo-3d'],
      aircraft: ['m3m','m350-rtk','m4e'],
      landmark: 'Valle de Uco',
      note: 'Terreno de pendiente y microclimas de montaña. El vuelo sigue la topografía, no la línea recta.',
      stats: [['Altitud de trabajo','700 a 2.000 m'],['Ventana de vuelo','Todo el año'],['Dato clave','Vigor por cuartel']]
    },
    {
      id: 'patagonia', name: 'PATAGONIA', full: 'Patagonia',
      provinces: ['Neuquén','Río Negro','Chubut','Santa Cruz','Tierra del Fuego'],
      primary: 'Petróleo y gas',
      industries: ['oil-gas','energia','ambiental','inspeccion'],
      applications: ['Inspección de ductos y locaciones','Detección de fugas y venteos','Inspección de aerogeneradores','Monitoreo ambiental de cuenca'],
      missions: ['inspeccionar-ducto','inspeccionar-aerogenerador','monitoreo-ambiental','inspeccionar-electrica'],
      aircraft: ['m350-rtk','evo-max-4t','wingtra-gen2'],
      landmark: 'Vaca Muerta',
      note: 'Viento sostenido y distancias largas entre locaciones. El limitante real es la resistencia al viento, no el alcance.',
      stats: [['Viento habitual','40 a 70 km/h'],['Ventana de vuelo','Ráfagas bajas'],['Dato clave','Integridad de ducto']]
    },
    {
      id: 'baires', name: 'BUENOS AIRES', full: 'Buenos Aires y AMBA',
      provinces: ['Buenos Aires','Ciudad Autónoma de Buenos Aires'],
      primary: 'Construcción e infraestructura',
      industries: ['construccion','geoespacial','inmobiliario','seguridad','logistica','gobierno'],
      applications: ['Avance de obra mes a mes','Mapeo urbano y catastro','Gemelo digital de desarrollo','Apoyo aéreo a seguridad pública'],
      missions: ['mapear-obra','modelo-3d','mapear-municipio','inspeccionar-puerto'],
      aircraft: ['m4e','anafi-usa','m350-rtk'],
      landmark: 'AMBA',
      note: 'Espacio aéreo controlado y densidad urbana. Toda misión arranca por la autorización, no por la aeronave.',
      stats: [['Autorización','ANAC previa'],['Ventana de vuelo','Coordinada'],['Dato clave','Avance certificado']]
    },
    {
      id: 'litoral', name: 'LITORAL', full: 'Litoral y NEA',
      provinces: ['Entre Ríos','Corrientes','Misiones','Chaco','Formosa'],
      primary: 'Agricultura y forestal',
      industries: ['agro','forestal','puertos','ambiental','ganaderia'],
      applications: ['Inventario forestal','Control de plantaciones','Relevamiento portuario','Monitoreo de humedales'],
      missions: ['monitorear-2000-ha','monitorear-incendios','inspeccionar-puerto','monitoreo-ambiental'],
      aircraft: ['ebee-x','m3m','m4e'],
      landmark: 'Corredor del Paraná',
      note: 'Humedad alta y cobertura vegetal densa. Sellado del equipo y sensor térmico pesan más que la velocidad.',
      stats: [['Humedad','Alta todo el año'],['Ventana de vuelo','Amanecer'],['Dato clave','Inventario por rodal']]
    }
  ];

  /* --- Plantillas de misión. Cada una define el perfil técnico que exige. --- */
  var MISSIONS = [
    {
      id: 'inspeccionar-ducto', name: 'Inspeccionar un ducto', industry: 'oil-gas', regions: ['patagonia'],
      example: 'Traza de 60 km en Vaca Muerta, Neuquén',
      profile: { areaHa: 0, lineKm: 60, rangeKm: 15, enduranceMin: 45, accuracyCm: 10, payloadKg: 1.0, sensors: ['termico','zoom','rgb'], env: 'viento', regulatory: 'bvlos' },
      needs: 'Vuelo lineal de larga distancia, cámara térmica para detectar fugas y tolerancia a viento sostenido.'
    },
    {
      id: 'monitorear-2000-ha', name: 'Monitorear 2.000 hectáreas', industry: 'agro', regions: ['centro','litoral','cuyo'],
      example: 'Lote de maíz en el sur de Córdoba',
      profile: { areaHa: 2000, lineKm: 0, rangeKm: 10, enduranceMin: 55, accuracyCm: 30, payloadKg: 0.5, sensors: ['multiespectral','rgb'], env: 'abierto', regulatory: 'estandar' },
      needs: 'Máxima cobertura por vuelo y sensor multiespectral para índice de vegetación por lote.'
    },
    {
      id: 'relevar-mina', name: 'Relevar una operación minera', industry: 'mineria', regions: ['noa','cuyo'],
      example: 'Cantera a cielo abierto en San Juan',
      profile: { areaHa: 400, lineKm: 0, rangeKm: 8, enduranceMin: 40, accuracyCm: 3, payloadKg: 1.2, sensors: ['rgb','rtk','lidar'], env: 'altura', regulatory: 'estandar' },
      needs: 'Posicionamiento RTK o PPK, techo de servicio alto y repetibilidad mensual del mismo plan de vuelo.'
    },
    {
      id: 'medir-acopios', name: 'Medir acopios', industry: 'mineria', regions: ['noa','litoral','baires'],
      example: 'Pilas de mineral en Salta',
      profile: { areaHa: 60, lineKm: 0, rangeKm: 4, enduranceMin: 25, accuracyCm: 3, payloadKg: 0.8, sensors: ['rgb','rtk'], env: 'altura', regulatory: 'estandar' },
      needs: 'Precisión centimétrica para cálculo de volumen auditable y vuelo corto repetible.'
    },
    {
      id: 'inspeccionar-aerogenerador', name: 'Inspeccionar un aerogenerador', industry: 'energia', regions: ['patagonia'],
      example: 'Parque eólico en Chubut',
      profile: { areaHa: 0, lineKm: 0, rangeKm: 3, enduranceMin: 30, accuracyCm: 1, payloadKg: 1.2, sensors: ['zoom','rgb','termico'], env: 'viento', regulatory: 'estandar' },
      needs: 'Vuelo estacionario estable con viento, zoom óptico y detección de obstáculos cercana a la pala.'
    },
    {
      id: 'mapear-obra', name: 'Mapear una obra en construcción', industry: 'construccion', regions: ['baires','centro'],
      example: 'Desarrollo residencial en zona norte del AMBA',
      profile: { areaHa: 40, lineKm: 0, rangeKm: 3, enduranceMin: 30, accuracyCm: 3, payloadKg: 0.8, sensors: ['rgb','rtk'], env: 'urbano', regulatory: 'urbano' },
      needs: 'Precisión topográfica, vuelo urbano autorizado y entrega mensual comparable.'
    },
    {
      id: 'monitorear-ganado', name: 'Monitorear ganado', industry: 'ganaderia', regions: ['centro','litoral','baires'],
      example: 'Campo ganadero en Corrientes',
      profile: { areaHa: 800, lineKm: 0, rangeKm: 8, enduranceMin: 40, accuracyCm: 50, payloadKg: 0.6, sensors: ['termico','rgb'], env: 'abierto', regulatory: 'estandar' },
      needs: 'Sensor térmico para conteo al amanecer y autonomía para recorrer potreros lejanos.'
    },
    {
      id: 'parque-solar', name: 'Relevar un parque solar', industry: 'energia', regions: ['noa','cuyo'],
      example: 'Planta fotovoltaica en Jujuy',
      profile: { areaHa: 300, lineKm: 0, rangeKm: 6, enduranceMin: 40, accuracyCm: 10, payloadKg: 1.0, sensors: ['termico','rgb'], env: 'altura', regulatory: 'estandar' },
      needs: 'Termografía radiométrica para detectar celdas calientes y vuelo automatizado en grilla.'
    },
    {
      id: 'inspeccionar-electrica', name: 'Inspeccionar infraestructura eléctrica', industry: 'inspeccion', regions: ['patagonia','centro','baires'],
      example: 'Línea de alta tensión en Río Negro',
      profile: { areaHa: 0, lineKm: 45, rangeKm: 12, enduranceMin: 45, accuracyCm: 10, payloadKg: 1.2, sensors: ['zoom','termico','rgb'], env: 'viento', regulatory: 'bvlos' },
      needs: 'Zoom óptico para aisladores, térmica para puntos calientes y vuelo lineal de largo alcance.'
    },
    {
      id: 'monitorear-incendios', name: 'Monitorear incendios forestales', industry: 'ambiental', regions: ['litoral','patagonia','centro'],
      example: 'Islas del Delta del Paraná',
      profile: { areaHa: 1200, lineKm: 0, rangeKm: 12, enduranceMin: 45, accuracyCm: 100, payloadKg: 1.0, sensors: ['termico','rgb'], env: 'abierto', regulatory: 'bvlos' },
      needs: 'Térmica de rango amplio, transmisión en vivo al puesto de mando y despegue desde vehículo.'
    },
    {
      id: 'modelo-3d', name: 'Crear un modelo 3D de una propiedad', industry: 'inmobiliario', regions: ['baires','cuyo','centro'],
      example: 'Bodega y viñedo en Mendoza',
      profile: { areaHa: 15, lineKm: 0, rangeKm: 2, enduranceMin: 25, accuracyCm: 3, payloadKg: 0.5, sensors: ['rgb'], env: 'abierto', regulatory: 'estandar' },
      needs: 'Vuelo oblicuo, buena resolución de cámara y facilidad de operación para equipos chicos.'
    },
    {
      id: 'mapear-municipio', name: 'Mapear un municipio', industry: 'gobierno', regions: ['baires','centro','noa'],
      example: 'Casco urbano de una ciudad intermedia',
      profile: { areaHa: 2500, lineKm: 0, rangeKm: 12, enduranceMin: 55, accuracyCm: 5, payloadKg: 0.8, sensors: ['rgb','rtk'], env: 'urbano', regulatory: 'urbano' },
      needs: 'Ala fija o VTOL por cobertura, precisión catastral y coordinación con espacio aéreo controlado.'
    },
    {
      id: 'monitoreo-ambiental', name: 'Monitorear un área ambiental', industry: 'ambiental', regions: ['patagonia','litoral'],
      example: 'Humedal del Delta o cuenca de un río patagónico',
      profile: { areaHa: 900, lineKm: 0, rangeKm: 10, enduranceMin: 45, accuracyCm: 30, payloadKg: 0.8, sensors: ['multiespectral','rgb','termico'], env: 'humedo', regulatory: 'estandar' },
      needs: 'Series comparables en el tiempo, sensor multiespectral para calidad de agua y vegetación, y equipo sellado para humedad.'
    },
    {
      id: 'inspeccionar-puerto', name: 'Inspeccionar un puerto', industry: 'puertos', regions: ['litoral','baires'],
      example: 'Terminal granaria del Gran Rosario',
      profile: { areaHa: 120, lineKm: 0, rangeKm: 5, enduranceMin: 35, accuracyCm: 5, payloadKg: 1.0, sensors: ['rgb','rtk','zoom'], env: 'urbano', regulatory: 'urbano' },
      needs: 'Relevamiento de muelles y silos, medición de stock y coordinación con operación portuaria activa.'
    }
  ];

  var SENSOR_LABEL = {
    rgb: 'RGB alta resolución', termico: 'Térmico radiométrico', multiespectral: 'Multiespectral',
    zoom: 'Zoom óptico', rtk: 'RTK / PPK', lidar: 'LiDAR', pulverizacion: 'Pulverización'
  };

  var ENV_LABEL = {
    abierto: 'Campo abierto', altura: 'Altura sobre 3.000 m', viento: 'Viento sostenido',
    urbano: 'Entorno urbano', humedo: 'Humedad y lluvia'
  };

  /* --- Flota disponible en el mercado argentino.
         precioUsd: valor de referencia del equipo base, sin payload ni accesorios. --- */
  var AIRCRAFT = [
    {
      id: 'm4e', brand: 'DJI', model: 'Matrice 4E', category: 'Multirrotor', tier: 'Inspección y mapeo',
      precioUsd: 9500, enduranceMin: 49, rangeKm: 20, payloadKg: 1.0, ceilingM: 6000, windMs: 12, ip: 'IP54',
      sensors: ['rgb','zoom','rtk','termico'], accuracyCm: 3, coverageHaHora: 200,
      industries: ['construccion','geoespacial','inspeccion','seguridad','inmobiliario','gobierno'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 900, servicioAnual: 700, baterias: 1200 },
      resumen: 'Multirrotor compacto de inspección con cámara múltiple y RTK integrado. El caballo de batalla para obra, catastro y relevamiento urbano.',
      argentina: 'Servicio técnico y repuestos disponibles en el AMBA. La opción más fácil de sostener operativamente.'
    },
    {
      id: 'm350-rtk', brand: 'DJI', model: 'Matrice 350 RTK', category: 'Multirrotor pesado', tier: 'Industrial',
      precioUsd: 16500, enduranceMin: 55, rangeKm: 20, payloadKg: 2.7, ceilingM: 7000, windMs: 15, ip: 'IP55',
      sensors: ['rgb','zoom','termico','rtk','lidar'], accuracyCm: 3, coverageHaHora: 240,
      industries: ['oil-gas','mineria','energia','inspeccion','geoespacial','ambiental','logistica'],
      seller: { type: 'distribuidor', city: 'Neuquén' },
      costos: { payload: 9000, capacitacion: 1800, servicioAnual: 1600, baterias: 2600 },
      resumen: 'Plataforma industrial de carga intercambiable. Admite LiDAR, térmica radiométrica y zoom en la misma misión.',
      argentina: 'Estándar de facto en Vaca Muerta y en minería del NOA. Techo de servicio apto para Puna y sellado para viento patagónico.'
    },
    {
      id: 'm3m', brand: 'DJI', model: 'Mavic 3 Multispectral', category: 'Multirrotor', tier: 'Agro',
      precioUsd: 6800, enduranceMin: 43, rangeKm: 15, payloadKg: 0.3, ceilingM: 6000, windMs: 12, ip: 'IP43',
      sensors: ['multiespectral','rgb','rtk'], accuracyCm: 3, coverageHaHora: 200,
      industries: ['agro','ganaderia','forestal','ambiental'],
      seller: { type: 'dealer', city: 'Córdoba' },
      costos: { payload: 0, capacitacion: 700, servicioAnual: 500, baterias: 900 },
      resumen: 'Cuatro bandas multiespectrales más RGB en un equipo liviano. Pensado para prescripción agronómica, no para inspección pesada.',
      argentina: 'La puerta de entrada de la agricultura de precisión en la Pampa Húmeda. Red de dealers agro en Córdoba y Santa Fe.'
    },
    {
      id: 'wingtra-gen2', brand: 'Wingtra', model: 'WingtraOne GEN II', category: 'VTOL ala fija', tier: 'Topografía',
      precioUsd: 32000, enduranceMin: 59, rangeKm: 10, payloadKg: 0.8, ceilingM: 5000, windMs: 12, ip: 'IP43',
      sensors: ['rgb','rtk'], accuracyCm: 1, coverageHaHora: 700,
      industries: ['mineria','geoespacial','gobierno','construccion','energia'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 4500, capacitacion: 2500, servicioAnual: 2200, baterias: 1800 },
      resumen: 'Despega en vertical y vuela como ala fija. Cubre en un vuelo lo que un multirrotor tarda una jornada en relevar.',
      argentina: 'Rinde donde hay superficie: campaña minera del NOA, catastro municipal y grandes relevamientos pampeanos.'
    },
    {
      id: 'ebee-x', brand: 'AgEagle', model: 'eBee X', category: 'Ala fija', tier: 'Cobertura extendida',
      precioUsd: 24000, enduranceMin: 90, rangeKm: 8, payloadKg: 0.3, ceilingM: 5000, windMs: 12, ip: 'IP43',
      sensors: ['rgb','multiespectral','rtk','termico'], accuracyCm: 3, coverageHaHora: 500,
      industries: ['agro','forestal','ambiental','geoespacial','gobierno'],
      seller: { type: 'distribuidor', city: 'Rosario' },
      costos: { payload: 3800, capacitacion: 1600, servicioAnual: 1400, baterias: 700 },
      resumen: 'Ala fija de lanzamiento manual con hasta hora y media de vuelo. Máxima superficie por batería del catálogo.',
      argentina: 'Pensada para el corredor agrícola y el inventario forestal del Litoral, donde las parcelas son continuas.'
    },
    {
      id: 'evo-max-4t', brand: 'Autel', model: 'EVO Max 4T', category: 'Multirrotor', tier: 'Inspección táctica',
      precioUsd: 9200, enduranceMin: 42, rangeKm: 20, payloadKg: 0.5, ceilingM: 7000, windMs: 12, ip: 'IP43',
      sensors: ['termico','zoom','rgb'], accuracyCm: 10, coverageHaHora: 160,
      industries: ['inspeccion','seguridad','oil-gas','energia','ambiental'],
      seller: { type: 'dealer', city: 'Mendoza' },
      costos: { payload: 0, capacitacion: 900, servicioAnual: 800, baterias: 1100 },
      resumen: 'Navegación autónoma sin señal satelital y cuatro sensores integrados. Fuerte en respuesta rápida y entornos sin referencia.',
      argentina: 'Alternativa a la flota DJI para organismos que necesitan diversificar proveedor.'
    },
    {
      id: 'anafi-usa', brand: 'Parrot', model: 'ANAFI USA', category: 'Multirrotor liviano', tier: 'Seguridad pública',
      precioUsd: 7200, enduranceMin: 32, rangeKm: 8, payloadKg: 0.2, ceilingM: 4500, windMs: 14, ip: 'IP53',
      sensors: ['termico','zoom','rgb'], accuracyCm: 50, coverageHaHora: 90,
      industries: ['seguridad','gobierno','ambiental','inspeccion'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 800, servicioAnual: 600, baterias: 800 },
      resumen: 'Plegable, liviano y con zoom de 32 aumentos. Diseñado para desplegar en minutos con datos cifrados.',
      argentina: 'Perfil de defensa civil y policía provincial, donde el despliegue rápido pesa más que la precisión topográfica.'
    },
    {
      id: 'agras-t50', brand: 'DJI', model: 'Agras T50', category: 'Multirrotor agrícola', tier: 'Aplicación',
      precioUsd: 27000, enduranceMin: 18, rangeKm: 5, payloadKg: 40, ceilingM: 4500, windMs: 10, ip: 'IP67',
      sensors: ['pulverizacion','rgb','rtk'], accuracyCm: 10, coverageHaHora: 21,
      industries: ['agro','forestal'],
      seller: { type: 'distribuidor', city: 'Santa Fe' },
      costos: { payload: 0, capacitacion: 2200, servicioAnual: 2400, baterias: 5200 },
      resumen: 'Dron de aplicación con tanque de 40 litros y radar de terreno. No releva: pulveriza y siembra.',
      argentina: 'Crecimiento fuerte en Santa Fe y Entre Ríos para aplicación selectiva y lotes anegados donde no entra el pulverizador.'
    },
    {
      id: 'm4t', brand: 'DJI', model: 'Matrice 4T', category: 'Multirrotor', tier: 'Térmico',
      precioUsd: 11200, enduranceMin: 49, rangeKm: 20, payloadKg: 1.0, ceilingM: 6000, windMs: 12, ip: 'IP54',
      sensors: ['termico','zoom','rgb','rtk'], accuracyCm: 5, coverageHaHora: 180,
      industries: ['energia','inspeccion','seguridad','oil-gas','ambiental','ganaderia'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 1000, servicioAnual: 900, baterias: 1300 },
      resumen: 'Versión térmica del Matrice 4, con zoom largo y reflector. Pensada para inspección nocturna y búsqueda.',
      argentina: 'Muy requerido en parques solares del NOA y en control de infraestructura eléctrica.'
    },
    {
      id: 'm3e', brand: 'DJI', model: 'Mavic 3 Enterprise', category: 'Multirrotor liviano', tier: 'Mapeo liviano',
      precioUsd: 5200, enduranceMin: 45, rangeKm: 15, payloadKg: 0.1, ceilingM: 6000, windMs: 12, ip: 'IP43',
      sensors: ['rgb','zoom','rtk'], accuracyCm: 3, coverageHaHora: 200,
      industries: ['construccion','geoespacial','inmobiliario','gobierno','agro'],
      seller: { type: 'dealer', city: 'Rosario' },
      costos: { payload: 0, capacitacion: 600, servicioAnual: 450, baterias: 850 },
      resumen: 'Cámara de 20 MP con obturador mecánico y RTK opcional en un equipo que entra en una mochila. Mapea con precisión topográfica sin flota ni cuadrilla.',
      argentina: 'El primer equipo profesional de la mayoría de los estudios de agrimensura y las constructoras medianas del país.'
    },
    {
      id: 'm3t', brand: 'DJI', model: 'Mavic 3 Thermal', category: 'Multirrotor liviano', tier: 'Térmico liviano',
      precioUsd: 6300, enduranceMin: 45, rangeKm: 15, payloadKg: 0.1, ceilingM: 6000, windMs: 12, ip: 'IP43',
      sensors: ['termico','zoom','rgb'], accuracyCm: 10, coverageHaHora: 150,
      industries: ['seguridad','inspeccion','ambiental','energia','ganaderia'],
      seller: { type: 'dealer', city: 'Córdoba' },
      costos: { payload: 0, capacitacion: 700, servicioAnual: 500, baterias: 850 },
      resumen: 'Térmica radiométrica de 640 por 512 y zoom de 56 aumentos en formato plegable. Resuelve el 80 % de la inspección liviana a un tercio del costo industrial.',
      argentina: 'Entrada habitual de bomberos voluntarios, cooperativas eléctricas y productores ganaderos al vuelo térmico.'
    },
    {
      id: 'm30t', brand: 'DJI', model: 'Matrice 30T', category: 'Multirrotor', tier: 'Industrial compacto',
      precioUsd: 14500, enduranceMin: 41, rangeKm: 15, payloadKg: 0.2, ceilingM: 7000, windMs: 15, ip: 'IP55',
      sensors: ['termico','zoom','rgb','rtk'], accuracyCm: 5, coverageHaHora: 170,
      industries: ['seguridad','inspeccion','oil-gas','energia','gobierno','ambiental'],
      seller: { type: 'distribuidor', city: 'Neuquén' },
      costos: { payload: 0, capacitacion: 1400, servicioAnual: 1200, baterias: 2100 },
      resumen: 'Sensores industriales sellados en un cuerpo plegable. Aguanta lluvia y ráfaga con el rendimiento de una plataforma de carga, sin el volumen de una.',
      argentina: 'Plataforma preferida de brigadas de emergencia y de inspección de líneas en la Norpatagonia.'
    },
    {
      id: 'm4d-dock', brand: 'DJI', model: 'Matrice 4D + Dock 3', category: 'Dron en caja', tier: 'Operación desatendida',
      precioUsd: 38000, enduranceMin: 54, rangeKm: 25, payloadKg: 0.5, ceilingM: 6000, windMs: 12, ip: 'IP55',
      sensors: ['rgb','zoom','termico','rtk'], accuracyCm: 3, coverageHaHora: 210,
      industries: ['oil-gas','energia','inspeccion','puertos','seguridad','mineria','gobierno'],
      seller: { type: 'distribuidor', city: 'Neuquén' },
      costos: { payload: 0, capacitacion: 3200, servicioAnual: 4800, baterias: 0 },
      resumen: 'Aeronave y hangar automático en un solo producto. Despega según cronograma, vuela la ruta guardada y vuelve a cargar sin nadie en el sitio.',
      argentina: 'La apuesta de los yacimientos y las terminales portuarias que necesitan la misma pasada todos los días sin mover una cuadrilla.'
    },
    {
      id: 'skydio-x10', brand: 'Skydio', model: 'X10', category: 'Multirrotor', tier: 'Inspección autónoma',
      precioUsd: 19000, enduranceMin: 40, rangeKm: 12, payloadKg: 0.3, ceilingM: 5000, windMs: 13, ip: 'IP54',
      sensors: ['rgb','termico','zoom'], accuracyCm: 5, coverageHaHora: 120,
      industries: ['seguridad','inspeccion','energia','gobierno','construccion'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 2600, servicioAnual: 2000, baterias: 1600 },
      resumen: 'Vuela solo entre estructuras usando visión en seis direcciones. El piloto elige qué inspeccionar, no cómo esquivar.',
      argentina: 'Alternativa de origen estadounidense para organismos con restricciones de proveedor. Soporte por importador único.'
    },
    {
      id: 'anafi-ai', brand: 'Parrot', model: 'ANAFI Ai', category: 'Multirrotor liviano', tier: 'Fotogrametría 4G',
      precioUsd: 9500, enduranceMin: 32, rangeKm: 8, payloadKg: 0.2, ceilingM: 5000, windMs: 12, ip: 'IP53',
      sensors: ['rgb','rtk'], accuracyCm: 3, coverageHaHora: 110,
      industries: ['geoespacial','construccion','gobierno','inspeccion'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 1100, servicioAnual: 700, baterias: 900 },
      resumen: 'Enlace 4G en lugar de radio: el alcance lo define la cobertura celular, no la antena. Fotogrametría con software abierto y datos propios.',
      argentina: 'Encaja donde hay señal y hace falta trazabilidad del dato: catastro municipal y obra pública.'
    },
    {
      id: 'trinity-pro', brand: 'Quantum Systems', model: 'Trinity Pro', category: 'VTOL ala fija', tier: 'Cobertura extendida',
      precioUsd: 29000, enduranceMin: 90, rangeKm: 10, payloadKg: 0.7, ceilingM: 4500, windMs: 13, ip: 'IP43',
      sensors: ['rgb','multiespectral','rtk','termico'], accuracyCm: 2, coverageHaHora: 750,
      industries: ['agro','geoespacial','gobierno','mineria','forestal','ambiental'],
      seller: { type: 'distribuidor', city: 'Córdoba' },
      costos: { payload: 5200, capacitacion: 2400, servicioAnual: 2000, baterias: 1500 },
      resumen: 'Hora y media de vuelo con despegue vertical y payload intercambiable. Cubre miles de hectáreas por jornada sin necesitar pista.',
      argentina: 'Competidor directo de Wingtra en campaña agrícola extensiva y relevamiento minero del NOA.'
    },
    {
      id: 'agras-t25', brand: 'DJI', model: 'Agras T25', category: 'Multirrotor agrícola', tier: 'Aplicación',
      precioUsd: 16000, enduranceMin: 15, rangeKm: 4, payloadKg: 20, ceilingM: 4500, windMs: 10, ip: 'IP67',
      sensors: ['pulverizacion','rgb','rtk'], accuracyCm: 10, coverageHaHora: 12,
      industries: ['agro','forestal','ganaderia'],
      seller: { type: 'dealer', city: 'Entre Ríos' },
      costos: { payload: 0, capacitacion: 1600, servicioAnual: 1500, baterias: 3200 },
      resumen: 'Tanque de 20 litros y peso de despegue que una sola persona maneja. La escala chica de la aplicación aérea.',
      argentina: 'Pensado para contratistas que arrancan y para lotes de menos de 200 hectáreas donde el T50 no se amortiza.'
    },
    {
      id: 'p100pro', brand: 'XAG', model: 'P100 Pro', category: 'Multirrotor agrícola', tier: 'Aplicación',
      precioUsd: 21000, enduranceMin: 15, rangeKm: 4, payloadKg: 50, ceilingM: 4000, windMs: 10, ip: 'IP67',
      sensors: ['pulverizacion','rgb','rtk'], accuracyCm: 10, coverageHaHora: 18,
      industries: ['agro','forestal'],
      seller: { type: 'distribuidor', city: 'Santa Fe' },
      costos: { payload: 0, capacitacion: 1800, servicioAnual: 1900, baterias: 4200 },
      resumen: 'Cincuenta kilos de carga entre pulverización y esparcido de sólidos. Cambia el tanque por la tolva y siembra cobertura.',
      argentina: 'Segunda marca de aplicación con red propia en la zona núcleo. Repuestos y baterías fuera del circuito DJI.'
    },
    {
      id: 'flycart30', brand: 'DJI', model: 'FlyCart 30', category: 'Multirrotor de carga', tier: 'Logística aérea',
      precioUsd: 23000, enduranceMin: 18, rangeKm: 16, payloadKg: 30, ceilingM: 6000, windMs: 12, ip: 'IP55',
      sensors: ['rgb'], accuracyCm: 50, coverageHaHora: 0,
      industries: ['logistica','oil-gas','mineria','energia'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 2000, servicioAnual: 2200, baterias: 3400 },
      resumen: 'Treinta kilos de carga por cabrestante o por bodega. No releva ni inspecciona: mueve repuestos, muestras y herramienta.',
      argentina: 'Caso claro en yacimientos y minas donde el camión tarda tres horas en un tramo que el aire resuelve en quince minutos.'
    },
    {
      id: 'elios3', brand: 'Flyability', model: 'Elios 3', category: 'Multirrotor confinado', tier: 'Espacio confinado',
      precioUsd: 48000, enduranceMin: 12, rangeKm: 1, payloadKg: 0.4, ceilingM: 3000, windMs: 8, ip: 'IP44',
      sensors: ['lidar','rgb','termico'], accuracyCm: 3, coverageHaHora: 5,
      industries: ['inspeccion','puertos','oil-gas','mineria','energia'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 7500, capacitacion: 4200, servicioAnual: 3600, baterias: 2200 },
      resumen: 'Jaula esférica y LiDAR para volar donde no hay señal satelital ni margen de error: silos, tanques, chimeneas y galerías.',
      argentina: 'Reemplaza andamio y parada de planta en refinerías, cementeras y terminales granarias del Gran Rosario.'
    },
    {
      id: 'inspire3', brand: 'DJI', model: 'Inspire 3', category: 'Cinematográfico', tier: 'Cine y publicidad',
      precioUsd: 17000, enduranceMin: 28, rangeKm: 15, payloadKg: 0.9, ceilingM: 5000, windMs: 12, ip: 'Sin sellado',
      sensors: ['rgb','rtk'], accuracyCm: 3, coverageHaHora: 60,
      industries: ['cine','inmobiliario','gobierno'],
      seller: { type: 'dealer', city: 'Buenos Aires' },
      costos: { payload: 3000, capacitacion: 1500, servicioAnual: 1400, baterias: 2800 },
      resumen: 'Sensor full frame de 8K con lentes intercambiables y repetición de trayectoria al centímetro. La misma toma, cuadro por cuadro, todas las veces.',
      argentina: 'Estándar de la producción publicitaria porteña y de los rodajes de ficción en Patagonia y Cuyo.'
    },
    {
      id: 'alta-x', brand: 'Freefly', model: 'Alta X', category: 'Multirrotor pesado', tier: 'Carga cinematográfica',
      precioUsd: 42000, enduranceMin: 25, rangeKm: 5, payloadKg: 16, ceilingM: 4500, windMs: 15, ip: 'IP43',
      sensors: ['rgb'], accuracyCm: 50, coverageHaHora: 30,
      industries: ['cine','energia','construccion','geoespacial'],
      seller: { type: 'importador', city: 'Buenos Aires' },
      costos: { payload: 0, capacitacion: 2800, servicioAnual: 2600, baterias: 4600 },
      resumen: 'Levanta dieciséis kilos: cámara de cine con óptica pesada, o el sensor científico que no entra en ninguna otra plataforma.',
      argentina: 'Se alquila más de lo que se compra. Productoras grandes y relevamientos con LiDAR de porte lo contratan por jornada.'
    }
  ];

  /* --- Utilidades de consulta. --- */
  function byId(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  function formatUsd(n) {
    return 'USD ' + Math.round(n).toLocaleString('es-AR');
  }
  function formatArs(n) {
    var ars = n * FX.USD_ARS;
    if (ars >= 1e6) return '$ ' + (ars / 1e6).toFixed(1).replace('.', ',') + ' M';
    return '$ ' + Math.round(ars).toLocaleString('es-AR');
  }
  function price(n, currency) {
    return currency === 'ARS' ? formatArs(n) : formatUsd(n);
  }

  return {
    MARKETS: MARKETS, FX: FX, SELLER_TYPES: SELLER_TYPES, INDUSTRIES: INDUSTRIES,
    REGIONS: REGIONS, MISSIONS: MISSIONS, AIRCRAFT: AIRCRAFT,
    SENSOR_LABEL: SENSOR_LABEL, ENV_LABEL: ENV_LABEL,
    industry: function (id) { return byId(INDUSTRIES, id); },
    region: function (id) { return byId(REGIONS, id); },
    mission: function (id) { return byId(MISSIONS, id); },
    aircraft: function (id) { return byId(AIRCRAFT, id); },
    sellerType: function (id) { return byId(SELLER_TYPES, id); },
    price: price, formatUsd: formatUsd, formatArs: formatArs
  };
})();
