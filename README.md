# ATLAS DRONES · plataforma AERONEX

Marketplace e inteligencia de drones profesionales e industriales para Argentina.

No es una tienda online de drones. Es la plataforma donde una empresa argentina
descubre, compara, configura y adquiere tecnología aérea según la misión que
tiene que resolver, la región donde opera y el presupuesto con el que cuenta.

Mercado inicial: Argentina. El modelo de datos ya contempla la expansión a Brasil,
Chile, Uruguay, Paraguay, Bolivia, Perú, Colombia y México.

## Páginas

| Archivo | Qué es |
| --- | --- |
| `index.html` | Portada: posicionamiento, industrias, regiones, misiones y tipos de vendedor |
| `argentina.html` | Argentina desde el aire: mapa interactivo por región operativa |
| `marketplace.html` | Catálogo filtrable con precios en pesos y dólares |
| `configurador.html` | Configurador de misión con recomendación de aeronave |
| `404.html` | Página de error, la sirve Vercel sola |

## Estructura

```
assets/data.js           modelo de datos: mercados, industrias, regiones, misiones, aeronaves
assets/geo-argentina.js  mapa vectorial del país por provincia (generado, no editar a mano)
assets/scenery.js        escenas ilustradas por región, en SVG
assets/app.js            navegación, moneda, dibujo del mapa y modal de cotización
assets/argentina.js      mapa interactivo con panel por región
assets/market.js         catálogo y filtros
assets/configurator.js   motor de recomendación
styles.css               sistema visual completo
img/                     fotografía de equipos, ver img/LEEME.md
vercel.json              cabeceras, caché y política de seguridad del despliegue
sitemap.xml robots.txt   indexación
```

Sitio estático puro. Sin compilación, sin dependencias, sin framework.
Se abre haciendo doble clic en `index.html` y se publica subiendo la carpeta.

## Qué editar

Casi todo el contenido sale de **`assets/data.js`**. Ahí se cambian:

- **Precios**: campo `precioUsd` de cada aeronave. Son valores de referencia del
  equipo base, sin payload ni accesorios. Confirmar con cada importador.
- **Cotización del dólar**: constante `FX.USD_ARS`, para mostrar precios en pesos.
- **Catálogo**: agregar o quitar objetos del array `AIRCRAFT`. Hoy son 22 equipos.
- **Industrias, regiones y misiones**: arrays `INDUSTRIES`, `REGIONS` y `MISSIONS`.
- **Nuevos países**: array `MARKETS`, cambiando `status` a `activo`.

Los contadores de la portada se leen del modelo, así que crecen solos al sumar
equipos o misiones. No hay números escritos a mano que se desactualicen.

Los pesos del motor de recomendación están en `assets/configurator.js`, en las
funciones `missionFit`, `operability`, `industrialValue` y `tco`.

## Antes de publicar como definitivo

Tres marcadores hay que reemplazar por los valores reales:

1. **Dominio.** Todo el sitio apunta a `https://atlasdrones.com.ar`. Aparece en
   los cuatro HTML (canónica y etiquetas para compartir), en `sitemap.xml` y en
   `robots.txt`. Si el dominio final es otro, hay que cambiarlo en esos lugares.
2. **Correo de contacto.** `contacto@atlasdrones.com.ar` es un marcador y está en
   los cuatro archivos HTML más el 404.
3. **Precios y especificaciones.** Son valores de referencia para dimensionar la
   inversión, no cotizaciones formales. Verificar con cada proveedor.

## Imágenes

El sitio no depende de fotografía: funciona completo sin una sola foto.

- Las **escenas de región** son arte vectorial propio (`assets/scenery.js`), una
  por cada región operativa, dibujadas según lo que el terreno le exige al vuelo.
- Las **fichas del catálogo** muestran una silueta vectorial según el tipo de
  plataforma. Si una aeronave declara el campo `foto`, se usa esa imagen y la
  silueta queda de respaldo por si el archivo falla. Las condiciones que tiene
  que cumplir el archivo están en `img/LEEME.md`.
- La **imagen para compartir** (`img/og.png`, 1200 × 630) se usa en WhatsApp,
  LinkedIn y Twitter. Se regenera a mano si cambian los números de la portada.

## Mapa

`assets/geo-argentina.js` se generó a partir de Natural Earth 10m (dominio
público), proyectado en cónica conforme de Lambert con paralelos estándar 25°S y
50°S. Incluye las 23 provincias continentales y catorce ciudades de referencia.

## Publicación

El sitio se despliega en Vercel directamente desde este repositorio, sin build.
Cada `git push` a `main` publica una versión nueva.

`vercel.json` define las cabeceras: caché corta para HTML, CSS y JavaScript para
que un despliegue se vea al instante, caché larga para las imágenes, y una
política de seguridad de contenido que solo habilita las fuentes de Google. Si
en algún momento se agrega un script externo, analítica incluida, hay que
declararlo ahí o el navegador lo bloquea sin avisar.
