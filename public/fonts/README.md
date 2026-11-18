# Fuentes locales

- **Feast of Flesh BB**: archivos existentes del proyecto, reservados para marca y firmas fijas. No contienen las vocales acentuadas necesarias para español y catalán.
- **Barlow Condensed Black Italic**: titulares traducibles de carácter deportivo, fuerte y compacto. Fuente de Jeremy Tribby, obtenida del [repositorio oficial de Google Fonts](https://github.com/google/fonts/tree/main/ofl/barlowcondensed). El WOFF2 conserva todos los glifos del TTF original; se convirtió con FontTools sin modificar los contornos ni eliminar caracteres. Licencia: [BarlowCondensed-OFL.txt](BarlowCondensed-OFL.txt).
- **Barlow Regular y SemiBold**: texto, información y controles. Licencia: [Barlow-OFL.txt](Barlow-OFL.txt).

Barlow Condensed incluye ÁÉÍÓÚ, ÀÈÒ, ÏÜ, ÑÇ, sus minúsculas y el punto volado. Se ha comprobado también la cobertura de los titulares actuales en español, catalán e inglés. Mantener la ortografía original en las traducciones.

Regular y SemiBold se sirven en WOFF2 (38.456 y 39.788 bytes), conservando los TTF originales como respaldo. El HTML precarga las cuatro fuentes usadas en el primer viewport; sus URL coinciden con las declaraciones CSS para evitar descargas duplicadas.

Las reservas locales de `src/styles/global/font-fallbacks.css` ajustan ancho, ascendente, descendente e interlineado. Se calcularon con las métricas de estos archivos y el texto publicado en español, catalán e inglés. Arial/Arial Narrow cubren sistemas que las incluyen; Roboto cubre dispositivos Android que permiten resolver esas fuentes locales. Las familias genéricas siguen disponibles si no existen. Las reservas no descargan fuentes adicionales y son aproximaciones para textos nuevos.

Los anchos del texto del hero conservan su medida con Barlow mediante `em`: 17ch de SemiBold equivalen a 9.656em, y 33ch/36ch de Regular a 18.645em/20.34em. Esto evita que la anchura del carácter cero de la reserva cambie la longitud de línea durante la carga.

Para regenerar WOFF2 y comprobar que se conserva la cobertura y el espaciado: `python scripts/prepare-fonts.py` (requiere `fonttools[woff]`, usado con FontTools 4.68.0). Para recalcular reservas, añadir `--arial-dir` con el directorio de fuentes del sistema y, opcionalmente, `--roboto` y `--roboto-italic` con referencias oficiales de esas familias. Las fuentes del sistema no se copian ni se redistribuyen. Roboto se obtuvo de [Google Fonts](https://github.com/google/fonts/tree/main/ofl/roboto) solo para calcular las métricas. Método: [Chrome, Improved font fallbacks](https://developer.chrome.com/blog/font-fallbacks).
