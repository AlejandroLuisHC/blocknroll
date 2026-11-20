# Documentación legal de la web

Estado: implementación local preparada; textos en borrador. No equivale a una validación jurídica ni permite dar por cumplidas las obligaciones operativas del club.

## Datos del titular verificados

El Registre d’Entitats Esportives identifica a **BLOCK AND ROLL CLUB DE VOLEY PLAYA** con el número **20312** y el domicilio **C/ de la Muntanya, núm. 101, baix, 08026 Barcelona**. El correo de la ficha coincide con el de la web. El aviso legal describe al titular como club deportivo sin ánimo de lucro, de acuerdo con el artículo 5 de la Ley del deporte de Cataluña, y refleja el destino de las cuotas indicado por el club. [Ficha del registro](https://analisi.transparenciacatalunya.cat/resource/qrgc-u7pk.json?n_m_registre=20312) · [Ley del deporte de Cataluña](https://www.boe.es/buscar/act.php?id=DOGC-f-2000-90007#a5)

## Información que falta

Completar `src/config/legal.ts` a partir de documentación oficial:

- NIF de la entidad.
- Proveedor real de envío de correo. El README menciona Maileroo, pero todavía no está confirmado para el despliegue vigente.
- Servicio que recibe y conserva los mensajes, cuentas con acceso y contratos aplicables. El correo público es `blocknroll.bcnclub@gmail.com`; no demuestra qué dirección usa `MAIL_TO`.
- Países de tratamiento y garantías de transferencias internacionales para Vercel y los proveedores reales de envío y recepción. Completar el texto en español, catalán e inglés tras revisar sus contratos, subencargados y configuración; no afirmar que todos los datos permanecen en la UE por defecto.

Mientras falte información, las páginas y el formulario muestran una advertencia de borrador. Las páginas legales tienen `noindex` y quedan fuera del sitemap. Esto identifica contenido incompleto; no es una medida que autorice su publicación definitiva. No se ha desactivado el formulario existente ni se ha publicado ningún cambio.

## Comportamiento implementado

- Aviso legal, privacidad y cookies disponibles en español, catalán e inglés, con HTML prerenderizado, títulos, canónicas y alternates propios.
- Enlaces permanentes en el pie y un párrafo breve junto al envío, con la identidad del responsable, la finalidad y la posibilidad de ejercer derechos (primera capa conforme al artículo 11 de la LOPDGDD). La información detallada —bases jurídicas, proveedores, conservación, derechos y solicitudes relativas a menores— sigue en la política de privacidad. Esta se abre en otra pestaña desde el formulario para conservar su borrador.
- La solicitud de entrenamiento se documenta sobre medidas precontractuales (art. 6.1.b RGPD); las demás consultas, sobre interés legítimo en responderlas (art. 6.1.f). Confirmar que esta distinción refleja el funcionamiento real y documentar la ponderación aplicable a las consultas generales.
- No se añade una aceptación genérica obligatoria de privacidad ni un consentimiento publicitario. No existe suscripción comercial en este formulario.
- El idioma depende de la URL. Se retira el detector que escribía en `localStorage`; no se crean nuevas cookies ni preferencias persistentes. Una preferencia antigua puede seguir en el navegador hasta que su propietario la borre.
- No se incorpora analítica, publicidad ni contenido incrustado de terceros. Instagram y mapas siguen siendo enlaces. El alojamiento puede tener comportamientos adicionales que hay que comprobar en producción.

## Antes de publicar como documentación definitiva

1. Confirmar los datos anteriores, completar la configuración y revisar los textos con el titular real. Si la actividad la gestionan varias personas sin entidad propia, determinar quién decide los fines y medios y si existe corresponsabilidad; no resolverlo poniendo tres nombres sin más.
2. Confirmar y documentar el plazo o criterio de conservación. Los textos usan el criterio de duración de la gestión y seguimiento de la consulta, seguido de supresión o bloqueo cuando corresponda. Establecer quién limpia los buzones, las copias y las exportaciones; este cambio no programa borrados de correo.
3. Revisar contratos de encargo, accesos a los buzones, medidas de seguridad y atención a derechos. Revisar también permisos de imágenes y material audiovisual del club, especialmente menores; los textos de la web no obtienen esas autorizaciones.
4. Revisar los campos del formulario y su tratamiento de solicitudes sobre menores. No usar el texto libre para recoger salud u otra información sensible.
5. Ejecutar `npm run lint`, `npm run test:run` y `npm run build`.
6. En el despliegue real, abrir las doce rutas en un navegador limpio; revisar red, cookies, almacenamiento y herramientas que pueda inyectar el alojamiento. Verificar también tras rechazos y cambios de configuración. Si aparece tecnología no exenta, bloquearla hasta consentimiento y añadir las opciones de aceptar, rechazar, configurar y retirar el permiso.
7. Comprobar el formulario con una consulta de prueba controlada, su recepción y quién accede; verificar que los proveedores descritos coinciden con los reales. Las pruebas locales no envían correos reales.

## Fuentes

- [AEPD: información por capas](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion).
- [AEPD: guía sobre cookies](https://www.aepd.es/guias/guia-cookies.pdf).
- [LSSI, artículo 10](https://www.boe.es/eli/es/l/2002/07/11/34/con#a10).
- [RGPD, artículos 6, 13, 21, 26 y 28](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).
- [LOPDGDD, artículo 11: información básica por capas](https://www.boe.es/eli/es/lo/2018/12/05/3/con#a11).
- [Generalitat: Registro de Entidades Deportivas](https://esport.gencat.cat/ca/arees_dactuacio/entitats-esportives/registre-dentitats-esportives-ree/).
- [Generalitat: NIF y certificado digital de entidades](https://web.gencat.cat/ca/entitats/gestionar-entitats/NIF-certificat-digital).
