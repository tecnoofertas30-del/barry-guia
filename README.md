# Barry guía — Tecno Ofertas

Mascota animada que guía la compra en la **página de producto** de la Tienda Nube de Tecno Ofertas (www.tecnoofertass.com.ar).
Piloto: sólo en la linterna (producto 374914335). No entra al pago.

- `barry-guia.js`: todo el comportamiento (≈20 KB). No lee formularios ni manda datos a ningún lado.
  En el navegador del cliente guarda sólo dónde dejó a Barry y si lo escondió.
- `tomas/`: las 5 animaciones (WebM para Android/compu, WebP para iPhone).

Se carga desde Google Tag Manager con la versión fija (commit) y control de integridad (SRI).
**Para apagarlo:** en Google Tag Manager, pausar la etiqueta "Barry guía" y publicar.
