# Fotografía del sitio

Acá van las fotos de los equipos. El sitio funciona sin ninguna: si un modelo no
tiene foto, la ficha del catálogo muestra la silueta vectorial, que es el estado
por defecto y se ve bien.

## Cómo se conecta una foto

En `assets/data.js`, agregar el campo `foto` a la aeronave con el nombre exacto
del archivo que está en esta carpeta:

```js
{
  id: 'm350-rtk', brand: 'DJI', model: 'Matrice 350 RTK',
  foto: 'dji-m350-rtk.jpg',
  ...
}
```

Si el archivo no existe o no carga, la ficha vuelve sola a la silueta. No rompe.

## Qué tiene que cumplir el archivo

| Qué | Valor |
| --- | --- |
| Proporción | 4:3 apaisada, la ficha recorta a 16:9 desde el centro |
| Ancho mínimo | 1200 px |
| Peso máximo | 250 KB |
| Formato | `.jpg` con calidad 80, o `.webp` |
| Fondo | Oscuro o neutro, el sistema visual del sitio es negro |
| Nombre | `marca-modelo.jpg`, en minúscula y sin acentos |

Las fichas aplican un degradado oscuro arriba y abajo para que las etiquetas de
gama y vendedor se lean sobre la imagen. Una foto con el equipo centrado y aire
alrededor es la que mejor entra.

## De dónde sacarlas, en orden de preferencia

1. **Foto propia del importador o del distribuidor.** Es la mejor opción y además
   es la única que muestra el equipo que realmente se vende en el país.
2. **Kit de prensa del fabricante.** DJI, Parrot, Wingtra, AgEagle, XAG,
   Quantum Systems y Flyability publican material de prensa con condiciones de
   uso. Hay que leerlas: la mayoría lo permite para vender su producto, pero
   pide no alterar la imagen ni sugerir que el fabricante es el vendedor.
3. **Banco de imágenes con licencia comercial paga.** Sirve para fotos de
   contexto, no de producto.

No usar imágenes bajadas de buscadores, de Pinterest ni de sitios de la
competencia. Tampoco archivos con marca de agua.

## Fotos de contexto

Las escenas de las regiones no son fotos: son arte vectorial propio, generado en
`assets/scenery.js`. No hace falta conseguir fotografía de paisaje argentino,
y conviene no mezclar las dos cosas en la misma página.
