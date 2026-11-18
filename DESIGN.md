---
name: Block n’ Roll
description: Identidad de club, fotografía de pista y energía de camiseta.
colors:
  signal: "#ffb052"
  signal-hover: "#ffc983"
  plum: "#74265f"
  plum-deep: "#291c2d"
  plum-light: "#e6d8ec"
  sand: "#f4dfc9"
  paper: "#f5f3f7"
  light: "#ffffff"
  ink: "#241e29"
  muted: "#615969"
  line: "#c9c0ce"
  field-border: "#97869f"
  error-border: "#9b2a1c"
  error-text: "#8c2417"
  error-bg: "#f8e9e3"
  success-text: "#214c2a"
  success-bg: "#e7f0df"
typography:
  display: {fontFamily: "Feast of Flesh, sans-serif", fontSize: "clamp(3.5rem, 9.2vw, 8.5rem)", fontWeight: 400, lineHeight: 1}
  brand-heading: {fontFamily: "Barlow Condensed, Barlow, sans-serif", fontSize: "clamp(3rem, 5vw, 4.75rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-.015em"}
  headline: {fontFamily: "Barlow, Arial, sans-serif", fontSize: "clamp(2.5rem, 4.6vw, 4.5rem)", fontWeight: 600, lineHeight: 1.05, letterSpacing: "-.035em"}
  hero-title: {fontFamily: "Barlow, Arial, sans-serif", fontSize: "clamp(1.9rem, 3.1vw, 2.8rem)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-.025em"}
  body: {fontFamily: "Barlow, Arial, sans-serif", fontSize: "1.0625rem", fontWeight: 400, lineHeight: 1.55}
  label: {fontFamily: "Barlow, Arial, sans-serif", fontSize: "1rem", fontWeight: 700, lineHeight: 1.55}
rounded:
  control: ".125rem"
  photo: ".4rem"
  details: ".75rem"
  form: "1rem"
  round: "50%"
spacing:
  gutter: "clamp(1.25rem, 5vw, 4rem)"
  section: "clamp(3rem, 5.5vw, 5.5rem)"
  half: ".5rem"
  one: "1rem"
  one-half: "1.5rem"
  two: "2rem"
components:
  button-primary: {backgroundColor: "{colors.signal}", textColor: "{colors.plum-deep}", rounded: "0", padding: ".8rem 1.25rem"}
  button-primary-hover: {backgroundColor: "{colors.signal-hover}"}
  training-action: {textColor: "{colors.plum}", rounded: "0", padding: ".5rem 0"}
  training-action-hover: {textColor: "{colors.plum}"}
  download-link: {textColor: "{colors.plum}", rounded: "0", padding: ".4rem 0"}
  download-link-hover: {textColor: "{colors.plum}"}
  input: {backgroundColor: "{colors.light}", textColor: "{colors.ink}", rounded: "{rounded.control}", padding: ".38rem .55rem", width: "100%"}
  navigation: {backgroundColor: "{colors.plum-deep}", textColor: "{colors.light}"}
  inquiry-option: {rounded: "0", padding: ".6rem 0"}
  inquiry-option-selected: {borderColor: "{colors.plum}"}
  contact-form: {backgroundColor: "{colors.light}", rounded: "{rounded.form}", padding: "clamp(1rem, 3vw, 2rem)"}
  gallery-play: {backgroundColor: "{colors.signal}", textColor: "{colors.ink}", rounded: "{rounded.round}", width: "3.75rem", height: "3.75rem"}
  availability-cell-selected: {backgroundColor: "{colors.plum-light}"}
---

# Design System: Block n’ Roll

## Overview

**Creative North Star: "Vida de club"**

La identidad nace de la camiseta y de la gente en la pista: fondos ciruela casi negros, diagonales moradas y el naranja del balón. La fotografía real del club tiene protagonismo; la composición combina escala, solapamientos y retratos inclinados para transmitir actividad y cercanía.

La expresividad se concentra en la marca, las imágenes y las transiciones entre secciones. Barlow, las filas de información y los controles claros sostienen la lectura y el contacto. La referencia fotográfica de BSC orienta la presencia de personas, sin reproducir su identidad ni su composición.

**Key Characteristics:**
- Fotografía real a sangre y tipografía de marca de gran escala.
- Ciruela, naranja y lavanda enlazados con la identidad del club.
- Diagonales, retratos inclinados y profundidad suave.
- Información de entrenamiento y formularios con estructura legible.

## Colors

### Primary
**Naranja balón** (`signal`, `signal-hover`) identifica acciones principales, reproducción de vídeo, la franja de firma y el foco sobre fondos oscuros.

### Secondary
**Ciruela camiseta** (`plum`) da voz a titulares de marca, enlaces y selecciones. **Ciruela noche** (`plum-deep`) sostiene cabecera, galería, pie y hero. **Lavanda club** (`plum-light`) separa contacto, retratos y selecciones del formulario.

### Neutral
**Papel frío**, **blanco**, **tinta**, **texto secundario** y **línea** (`paper`, `light`, `ink`, `muted`, `line`) organizan lectura, campos y separadores. **Arena** (`sand`) acompaña al segundo retrato. Los colores de error y éxito pertenecen a mensajes y estados del formulario.

**The Action Color Rule.** El naranja conecta identidad y acción; el ciruela identifica enlaces y selecciones sobre superficies claras.

## Typography

**Brand Font:** Feast of Flesh. **Display Font:** Barlow Condensed Black Italic. **Body Font:** Barlow. Las familias se sirven localmente con `font-display: swap`; las cuatro caras del primer viewport se precargan desde el HTML. Regular y SemiBold usan WOFF2, con sus TTF originales como respaldo. Mientras cargan, las reservas locales de Arial, Arial Narrow o Roboto ajustan ancho y métricas verticales para reducir el cambio de distribución. La tipografía final y su cobertura de caracteres se conservan; los cálculos y la regeneración están documentados en `public/fonts/README.md`.

Feast of Flesh se reserva para la marca y las firmas fijas, sin acentos: su archivo carece de vocales acentuadas. Los titulares traducibles de club, galería y contacto usan Barlow Condensed Black Italic en mayúsculas, peso 900 y cursiva real, siguiendo la dirección elegida de letras deportivas, fuertes y compactas. Incluye glifos propios para español y catalán (tildes, diéresis, ñ, ç y punto volado). Barlow contiene navegación, explicación, tarifas, preguntas y formulario; sus archivos locales son Regular y SemiBold, este último declarado para pesos 600–900. Las licencias SIL OFL 1.1 de Barlow Condensed y Barlow están en `public/fonts/`.

La jerarquía es fluida, sin una escala modular única. La marca usa `display`; los titulares de identidad, `brand-heading`; la información de entrenamiento, `headline`; el mensaje principal, `hero-title`. Los párrafos destacados usan 1.125rem/1.65. Las tarifas usan cifras tabulares. Las etiquetas de disponibilidad conservan .875rem (14px).

**The Typography Roles Rule.** La marca conserva su lettering; los titulares traducibles usan la voz deportiva y compacta de Barlow Condensed Black Italic y los datos y acciones mantienen la legibilidad de Barlow. Ningún titular debe mezclar letras de distintas fuentes por falta de glifos.

## Layout

El contenedor compartido mide `min(100% - 2 * var(--gutter), 79rem)`. Márgenes laterales y distancia entre secciones usan los tokens fluidos `gutter` y `section`. Se alternan fotografías y fondos a todo el ancho con contenido centrado.

El hero de escritorio superpone texto sobre fotografía; en móvil la imagen ocupa su propio bloque y el texto se solapa sobre su borde inferior. Club usa dos columnas en proporción .85fr/1.15fr y tres retratos desfasados, con fondos lavanda, arena y ciruela. Hasta 1000px el texto y los entrenadores se apilan; hasta 760px los retratos se distribuyen en dos columnas con el tercero centrado debajo. Galería usa una cuadrícula de doce columnas: cada vídeo ocupa cuatro y cada foto tres, con el segundo vídeo desplazado 4rem; las fotos mantienen proporción 4:5 y los vídeos 16:11. Entrenamientos son filas con descripción, precio y acción. Contacto distribuye información y formulario en proporción .8fr/1.2fr.

Cambios observados: 1000px apila club; 900px ajusta hero y entrenamientos; 860px activa menú móvil; 850px apila contacto; 760px reduce entrenadores y galería a dos columnas; 720px apila cabeceras, hero y detalles de entrenamiento; 540px compacta cabecera y pie; 520px deja el formulario en una columna; 360px compacta la marca y apila las opciones de consulta. A partir de 1600px cambia el encuadre del hero.

La disponibilidad usa tabla de ancho fijo: primera columna 31%; a 520px o menos, 27%, ancho `calc(100% + 1rem)` y márgenes de -.5rem. Sus celdas mantienen altura mínima de 2.75rem. La cabecera fija mide al menos 4.75rem (4.15rem en móvil); los anclajes usan `scroll-padding-top` de 4.75rem, o 4.15rem hasta 860px, y `scroll-margin-top: .75rem`.

## Elevation & Depth

La profundidad combina fotografías, degradados de lectura, una franja naranja inclinada, cambios diagonales de fondo y retratos levantados. Los retratos llevan sombra ambiental `0 16px 32px #291c2d18`; los controles y el formulario se distinguen principalmente por color y borde.

**The Photo Depth Rule.** El relieve acompaña a la fotografía y al material del club; los formularios conservan superficies claras y estables.

El hero entra durante 550ms con `cubic-bezier(.16, 1, .3, 1)`, opacidad .5→1 y desplazamiento vertical 10px→0. Botones y reproducción cambian de color en 160ms; el botón principal baja 1px al activarse. `prefers-reduced-motion: reduce` elimina animaciones, transiciones y desplazamiento suave, incluida la rotación del indicador de envío.

## Shapes

Las acciones principales usan un bloque naranja de cantos rectos con un corte diagonal de .65rem en la esquina inferior derecha y Barlow Condensed Black Italic en mayúsculas. El recorte pertenece al fondo del botón para conservar el contorno de foco completo. Navegación, consultas de plaza, descargas y controles de icono se presentan sin caja. Los campos conservan un radio mínimo de 2px; fotos y formulario mantienen sus radios propios. Los círculos se reservan para reproducción. La fotografía de inicio queda libre de etiquetas y la temporada aparece como texto en la franja naranja, que gira -1.5°. Los retratos giran -4° y 5°, con marco blanco de .5rem. La entrada diagonal de galería usa un recorte triangular.

## Components

- **Botones y enlaces:** acción principal naranja, tipografía deportiva y altura mínima de 3.25rem; enlaces, descargas y acciones de entrenamiento de al menos 2.75rem. Consultas y descargas usan texto subrayado con icono y sin contenedor. El hover aclara el naranja o acentúa el subrayado.
- **Navegación:** fondo ciruela noche, marca en Feast of Flesh, enlaces Barlow y contacto como enlace naranja con flecha. Menú y cierre usan iconos sin caja de al menos 44px. El menú móvil se despliega bajo la cabecera con límite de altura y desplazamiento propio. Abrirlo enfoca su primer enlace; Escape lo cierra y devuelve foco al botón.
- **Galería:** reproducción mediante botón nativo sobre un fotograma del propio vídeo; el icono circular naranja queda abajo a la izquierda. Al pulsarlo, un diálogo nativo amplía el fotograma desde la tarjeta hasta el centro en 440ms, con escala uniforme y recorte animado que revela el formato original. El reproductor conserva la proporción nativa y cabe en la pantalla, con controles nativos y fondo atenuado. Cerrar con Escape, clic fuera o botón devuelve el vídeo a la tarjeta en 240ms y restaura el foco; durante la reproducción se bloquea el desplazamiento sin mover la página. `prefers-reduced-motion` elimina el desplazamiento. En móvil desaparece el desfase del segundo vídeo.
- **Entrenamientos:** filas separadas por líneas, precio de lectura rápida, condiciones sobre papel frío y preguntas mediante `details`/`summary` nativos.
- **Formulario:** superficie blanca sobre lavanda; etiquetas visibles, borde de campo propio y altura mínima de 2.75rem. Las opciones radio se distinguen por el control nativo, peso y subrayado ciruela; la disponibilidad seleccionada usa lavanda. Errores asocian texto al campo y marcan `aria-invalid`; el envío deshabilita el grupo y comunica estado con regiones accesibles.
- **Foco:** contorno global de 3px y separación de 4px; ciruela sobre claro, naranja en hero, galería, cabecera y pie. Opciones radio usan contorno de 2px separado 2px; disponibilidad, 2px con offset -3px; reproducción, offset -5px. Mantener el enlace para saltar al contenido.

## Do's and Don'ts

### Do:
- **Do** usar imágenes, logotipos y tipografía de marca del club.
- **Do** conservar la relación entre naranja de acción, ciruela de identidad y superficies claras de lectura.
- **Do** mantener foco visible, etiquetas, estados de envío y reducción de movimiento.
- **Do** comprobar el contenido en español, catalán e inglés y los anclajes bajo la cabecera fija.

### Don't:
- **Don't** convertir todos los bloques en tarjetas planas idénticas: la identidad implementada usa fotografía, diagonales y solapamientos.
- **Don't** usar Feast of Flesh para párrafos, tarifas o campos.
- **Don't** usar Feast of Flesh para contenido traducible con acentos ni quitar tildes para adaptar el texto a la fuente.
- **Don't** copiar la identidad o la composición de BSC.

Fuente de implementación: `src/styles/global/base.css`, `src/styles/components/` y sus componentes React. Las extensiones de foco, sombras, movimiento y ejemplos viven en `.impeccable/design.json`; sus rampas de color son vistas auxiliares generadas, no tokens adicionales del CSS.
