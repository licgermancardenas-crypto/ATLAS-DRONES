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

## Estructura

```
assets/data.js           modelo de datos: mercados, industrias, regiones, misiones, aeronaves
assets/geo-argentina.js  mapa vectorial del país por provincia (generado, no editar a mano)
assets/app.js            navegación, moneda, dibujo del mapa y modal de cotización
assets/argentina.js      mapa interactivo con panel por región
assets/market.js         catálogo y filtros
assets/configurator.js   motor de recomendación
styles.css               sistema visual completo
```

Sitio estático puro. Sin compilación, sin dependencias, sin framework.
Se abre haciendo doble clic en `index.html` y se publica subiendo la carpeta.

## Qué editar

Casi todo el contenido sale de **`assets/data.js`**. Ahí se cambian:

- **Precios**: campo `precioUsd` de cada aeronave. Son valores de referencia del
  equipo base, sin payload ni accesorios. Confirmar con cada importador.
- **Cotización del dólar**: constante `FX.USD_ARS`, para mostrar precios en pesos.
- **Catálogo**: agregar o quitar objetos del array `AIRCRAFT`.
- **Industrias, regiones y misiones**: arrays `INDUSTRIES`, `REGIONS` y `MISSIONS`.
- **Nuevos países**: array `MARKETS`, cambiando `status` a `activo`.

Los pesos del motor de recomendación están en `assets/configurator.js`, en las
funciones `missionFit`, `operability`, `industrialValue` y `tco`.

## Datos de referencia

Precios y especificaciones son valores de referencia para dimensionar la
inversión, no cotizaciones formales. Verificar con el proveedor antes de publicar
el sitio como definitivo. El correo de contacto (`contacto@atlasdrones.com.ar`)
es un marcador: reemplazarlo por el real en los cuatro archivos HTML.

## Mapa

`assets/geo-argentina.js` se generó a partir de Natural Earth 10m (dominio
público), proyectado en cónica conforme de Lambert con paralelos estándar 25°S y
50°S. Incluye las 23 provincias continentales y catorce ciudades de referencia.

## Publicación

El sitio se despliega en Vercel directamente desde este repositorio, sin build.
Cada `git push` a `main` publica una versión nueva.
