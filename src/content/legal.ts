import type { LegalPageKind } from "../config/legal";

type LegalDocument = {
  title: string;
  description: string;
  intro: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
};

type LegalCopy = {
  navigation: string;
  contents: string;
  home: string;
  updated: string;
  draft: string;
  pending: string;
  notApplicable: string;
  identity: string;
  fields: { holderName: string; taxId: string; address: string; registration: string; email: string };
  providers: string;
  providerFields: { hosting: string; delivery: string; inbox: string; transfers: string };
  aepd: string;
  form: {
    controller: string; purpose: string; rights: string;
    more: string; newTab: string; draft: string;
  };
  pages: Record<LegalPageKind, LegalDocument>;
};

export const LEGAL_COPY: Record<"es" | "ca" | "en", LegalCopy> = {
  es: {
    navigation: "Información legal", contents: "En esta página", home: "Volver a la web del club",
    updated: "Última revisión", pending: "Pendiente de confirmar", notApplicable: "No procede",
    draft: "Borrador: faltan por confirmar los datos del titular y de los proveedores. Esta documentación debe completarse antes de publicarse como definitiva.",
    identity: "Titular y contacto",
    fields: { holderName: "Titular / responsable del tratamiento", taxId: "NIF", address: "Domicilio", registration: "Registro y número de inscripción", email: "Contacto y protección de datos" },
    providers: "Proveedores y transferencias internacionales",
    providerFields: { hosting: "Alojamiento de la web", delivery: "Envío de las consultas", inbox: "Recepción y conservación del correo", transfers: "Países de tratamiento y garantías de las transferencias" },
    aepd: "Agencia Española de Protección de Datos (AEPD)",
    form: {
      controller: "Responsable:",
      purpose: "Usamos tus datos para atender tu consulta o solicitud de entrenamiento.",
      rights: "Puedes ejercer tus derechos según la",
      more: "Política de privacidad", newTab: "se abre en otra pestaña",
      draft: "Borrador pendiente de completar.",
    },
    pages: {
      notice: {
        title: "Aviso legal", description: "Identificación del titular, contacto y condiciones de uso de la web de Block n’ Roll.",
        intro: "Esta web presenta la actividad de Block n’ Roll, un club deportivo sin ánimo de lucro, y permite solicitar información sobre sus entrenamientos. Las cuotas de entrenamiento se destinan a cubrir gastos de la actividad deportiva del club.",
        sections: [
          { id: "actividad", title: "Información y solicitudes", paragraphs: ["El formulario sirve para realizar consultas y solicitar una clase de prueba o información sobre entrenamientos. Su envío no confirma una plaza, una reserva ni la contratación de un servicio.", "Las modalidades, tarifas y condiciones publicadas corresponden a la temporada indicada. El club debe confirmar la disponibilidad y las condiciones aplicables antes de formalizar una inscripción. La ubicación de entrenamiento no equivale al domicilio legal del titular."] },
          { id: "uso", title: "Uso de la web", paragraphs: ["Utiliza la web y sus canales de contacto de forma lícita y respetuosa. No envíes contenidos ilícitos, suplantaciones de identidad ni información personal de terceros sin una base que lo permita."] },
          { id: "contenidos", title: "Contenidos e imágenes", paragraphs: ["Los textos, fotografías, vídeos, logotipos y demás contenidos están sujetos a los derechos que correspondan a sus titulares y a las licencias aplicables. Su publicación no concede una autorización general para reutilizarlos. Para solicitar un uso del material del club, escribe al correo de contacto."] },
          { id: "enlaces", title: "Enlaces a otros servicios", paragraphs: ["Los enlaces a Instagram, mapas y otros sitios externos llevan a servicios gestionados por sus respectivos titulares. Al abrirlos se aplican sus propias condiciones y políticas de privacidad."] },
          { id: "contacto", title: "Correcciones y contacto", paragraphs: ["Si detectas información incorrecta, un problema de acceso o un contenido que afecte a tus derechos, comunícalo al correo indicado. Este aviso no limita los derechos que te reconoce la normativa aplicable."] },
        ],
      },
      privacy: {
        title: "Política de privacidad", description: "Cómo se utilizan los datos del formulario de Block n’ Roll y cómo ejercer tus derechos.",
        intro: "Aquí explicamos qué ocurre con tus datos cuando visitas la web o nos envías una consulta.",
        sections: [
          { id: "datos", title: "Qué datos se recogen", paragraphs: ["El formulario solicita nombre y correo electrónico para poder responderte. Puedes añadir teléfono y, en las consultas de entrenamiento, modalidad, nivel, número de jugadores y disponibilidad. También se recibe el texto que escribas en una consulta general. Sin nombre y correo no podemos tramitar el formulario.", "El mensaje se envía por correo al equipo del club. El alojamiento y los servicios de correo también pueden tratar datos técnicos, como la dirección IP y los registros necesarios para prestar y proteger sus servicios.", "Para las solicitudes relativas a menores de edad, el contacto debe realizarlo su madre, padre o tutor. Evita incluir información de salud, documentos de identidad o datos de otras personas en los campos de texto."] },
          { id: "finalidad", title: "Para qué y con qué base jurídica", paragraphs: ["Las solicitudes de prueba, plaza o entrenamiento se gestionan para atender las medidas precontractuales que solicitas, conforme al artículo 6.1.b del RGPD.", "Las demás consultas se atienden por el interés legítimo del responsable en responder a las comunicaciones recibidas, conforme al artículo 6.1.f del RGPD. Puedes oponerte a este tratamiento por motivos relacionados con tu situación particular.", "Los datos del formulario no se utilizan para suscribirte a publicidad. No se realizan decisiones automatizadas ni perfiles con los datos de las consultas."] },
          { id: "conservacion", title: "Durante cuánto tiempo", paragraphs: ["Las consultas se conservan mientras sea necesario para responderlas y realizar el seguimiento que hayas solicitado. Al finalizar su gestión, deben suprimirse, salvo los datos que deban mantenerse bloqueados durante los plazos legalmente exigibles para atender posibles responsabilidades.", "Si después formalizas una inscripción, los tratamientos necesarios para gestionar tu relación con el club deberán informarse en ese momento. La información de este formulario no sustituye a la documentación de inscripción."] },
          { id: "destinatarios", title: "Quién puede acceder", paragraphs: ["Pueden acceder las personas del club encargadas de atender las consultas y los proveedores de alojamiento y correo que intervienen en su envío, recepción y conservación. No se venden los datos de las consultas. Las comunicaciones a autoridades se realizarán cuando exista una obligación legal.", "Los proveedores, los países de tratamiento y las garantías aplicables a las transferencias internacionales se detallan en el apartado de proveedores de esta política."] },
          { id: "derechos", title: "Tus derechos", paragraphs: ["Puedes solicitar el acceso, la rectificación y la supresión de tus datos, así como la limitación del tratamiento, la oposición y la portabilidad cuando procedan. Escribe al correo de protección de datos indicado e identifica la solicitud; solo se pedirá información adicional de identidad cuando sea necesaria.", "Si un tratamiento se basa en tu consentimiento, puedes retirarlo en cualquier momento sin afectar a la licitud del tratamiento anterior. Puedes reclamar ante la Agencia Española de Protección de Datos si consideras que se han vulnerado tus derechos."] },
        ],
      },
      cookies: {
        title: "Cookies y almacenamiento", description: "Información sobre cookies, idioma, almacenamiento en el navegador y enlaces externos de Block n’ Roll.",
        intro: "La web está preparada para funcionar sin cookies de analítica ni publicidad.",
        sections: [
          { id: "idioma", title: "Idioma y formulario", paragraphs: ["El idioma se determina por la dirección que visitas: español en /, catalán en /ca e inglés en /en. Esta versión no necesita guardar la preferencia de idioma en cookies, localStorage ni sessionStorage.", "El borrador del formulario se mantiene en memoria mientras permaneces en la página. No se guarda en el almacenamiento del navegador y se pierde al recargar o salir. Solo se envía al pulsar el botón de envío."] },
          { id: "seguimiento", title: "Analítica, publicidad y contenido externo", paragraphs: ["El código de esta versión no incorpora herramientas de analítica, píxeles publicitarios ni vídeos o mapas incrustados de terceros. Las fuentes, las imágenes y los vídeos del club se sirven como archivos del propio sitio.", "Instagram y mapas se ofrecen mediante enlaces. Al abrir un servicio externo, este puede utilizar cookies y tratar datos conforme a su propia política."] },
          { id: "tecnicas", title: "Servicios técnicos y consentimiento", paragraphs: ["Las tecnologías estrictamente necesarias para la comunicación o para prestar un servicio expresamente solicitado pueden estar exentas de consentimiento. El proveedor de alojamiento se identifica en la política de privacidad.", "Esta web no ofrece un panel de consentimiento porque no incorpora herramientas opcionales de analítica o publicidad. Puedes consultar el contenido y enviar una consulta sin aceptar ese tipo de seguimiento."] },
          { id: "control", title: "Control desde el navegador", paragraphs: ["Puedes consultar y eliminar las cookies y los datos guardados por un sitio desde los ajustes de privacidad de tu navegador. Si visitaste una versión anterior que guardaba el idioma, puedes eliminar también esa preferencia desde dichos ajustes."] },
        ],
      },
    },
  },
  ca: {
    navigation: "Informació legal", contents: "En aquesta pàgina", home: "Tornar a la web del club",
    updated: "Última revisió", pending: "Pendent de confirmar", notApplicable: "No escau",
    draft: "Esborrany: falten per confirmar les dades del titular i dels proveïdors. Cal completar aquesta documentació abans de publicar-la com a definitiva.",
    identity: "Titular i contacte",
    fields: { holderName: "Titular / responsable del tractament", taxId: "NIF", address: "Domicili", registration: "Registre i número d’inscripció", email: "Contacte i protecció de dades" },
    providers: "Proveïdors i transferències internacionals",
    providerFields: { hosting: "Allotjament de la web", delivery: "Enviament de les consultes", inbox: "Recepció i conservació del correu", transfers: "Països de tractament i garanties de les transferències" },
    aepd: "Agència Espanyola de Protecció de Dades (AEPD)",
    form: {
      controller: "Responsable:",
      purpose: "Fem servir les teves dades per atendre la consulta o sol·licitud d’entrenament.",
      rights: "Pots exercir els teus drets segons la",
      more: "Política de privacitat", newTab: "s’obre en una altra pestanya",
      draft: "Esborrany pendent de completar.",
    },
    pages: {
      notice: {
        title: "Avís legal", description: "Identificació del titular, contacte i condicions d’ús de la web de Block n’ Roll.",
        intro: "Aquesta web presenta l’activitat de Block n’ Roll, un club esportiu sense ànim de lucre, i permet demanar informació sobre els entrenaments. Les quotes d’entrenament es destinen a cobrir despeses de l’activitat esportiva del club.",
        sections: [
          { id: "activitat", title: "Informació i sol·licituds", paragraphs: ["El formulari serveix per fer consultes i demanar una classe de prova o informació sobre entrenaments. Enviar-lo no confirma cap plaça, reserva ni contractació d’un servei.", "Les modalitats, les tarifes i les condicions publicades corresponen a la temporada indicada. El club ha de confirmar la disponibilitat i les condicions aplicables abans de formalitzar una inscripció. La ubicació d’entrenament no equival al domicili legal del titular."] },
          { id: "us", title: "Ús de la web", paragraphs: ["Fes servir la web i els canals de contacte de manera lícita i respectuosa. No enviïs continguts il·lícits, suplantacions d’identitat ni informació personal de tercers sense una base que ho permeti."] },
          { id: "continguts", title: "Continguts i imatges", paragraphs: ["Els textos, les fotografies, els vídeos, els logotips i la resta de continguts estan subjectes als drets dels seus titulars i a les llicències aplicables. Publicar-los no concedeix una autorització general per reutilitzar-los. Per demanar l’ús del material del club, escriu al correu de contacte."] },
          { id: "enllacos", title: "Enllaços a altres serveis", paragraphs: ["Els enllaços a Instagram, mapes i altres webs porten a serveis gestionats pels seus titulars respectius. Quan els obres s’apliquen les seves condicions i polítiques de privacitat."] },
          { id: "contacte", title: "Correccions i contacte", paragraphs: ["Si detectes informació incorrecta, un problema d’accés o un contingut que afecti els teus drets, comunica-ho al correu indicat. Aquest avís no limita els drets que et reconeix la normativa aplicable."] },
        ],
      },
      privacy: {
        title: "Política de privacitat", description: "Com s’utilitzen les dades del formulari de Block n’ Roll i com exercir els teus drets.",
        intro: "Aquí expliquem què passa amb les teves dades quan visites la web o ens envies una consulta.",
        sections: [
          { id: "dades", title: "Quines dades es recullen", paragraphs: ["El formulari demana nom i correu electrònic per poder respondre’t. Pots afegir telèfon i, en les consultes d’entrenament, modalitat, nivell, nombre de jugadors i disponibilitat. També es rep el text que escriguis en una consulta general. Sense nom i correu no podem tramitar el formulari.", "El missatge s’envia per correu a l’equip del club. L’allotjament i els serveis de correu també poden tractar dades tècniques, com ara l’adreça IP i els registres necessaris per prestar i protegir els seus serveis.", "Per a les sol·licituds relatives a menors d’edat, el contacte l’ha de fer la mare, el pare o el tutor. Evita incloure informació de salut, documents d’identitat o dades d’altres persones als camps de text."] },
          { id: "finalitat", title: "Per a què i amb quina base jurídica", paragraphs: ["Les sol·licituds de prova, plaça o entrenament es gestionen per atendre les mesures precontractuals que demanes, d’acord amb l’article 6.1.b del RGPD.", "Les altres consultes s’atenen per l’interès legítim del responsable a respondre les comunicacions rebudes, d’acord amb l’article 6.1.f del RGPD. Pots oposar-te a aquest tractament per motius relacionats amb la teva situació particular.", "Les dades del formulari no es fan servir per subscriure’t a publicitat. No es prenen decisions automatitzades ni es creen perfils amb les dades de les consultes."] },
          { id: "conservacio", title: "Durant quant de temps", paragraphs: ["Les consultes es conserven mentre calgui per respondre-les i fer el seguiment que hagis demanat. En acabar-ne la gestió, s’han de suprimir, llevat de les dades que s’hagin de mantenir bloquejades durant els terminis legalment exigibles per atendre possibles responsabilitats.", "Si després formalitzes una inscripció, caldrà informar-te en aquell moment dels tractaments necessaris per gestionar la teva relació amb el club. La informació d’aquest formulari no substitueix la documentació d’inscripció."] },
          { id: "destinataris", title: "Qui hi pot accedir", paragraphs: ["Hi poden accedir les persones del club encarregades d’atendre les consultes i els proveïdors d’allotjament i correu que intervenen en l’enviament, la recepció i la conservació. No es venen les dades de les consultes. Es comunicaran a les autoritats quan hi hagi una obligació legal.", "Els proveïdors, els països de tractament i les garanties aplicables a les transferències internacionals es detallen a l’apartat de proveïdors d’aquesta política."] },
          { id: "drets", title: "Els teus drets", paragraphs: ["Pots sol·licitar l’accés, la rectificació i la supressió de les dades, així com la limitació del tractament, l’oposició i la portabilitat quan escaiguin. Escriu al correu de protecció de dades indicat i identifica la sol·licitud; només es demanarà informació addicional d’identitat quan sigui necessària.", "Si un tractament es basa en el teu consentiment, el pots retirar en qualsevol moment sense afectar la licitud del tractament anterior. Pots reclamar davant l’Agència Espanyola de Protecció de Dades si consideres que s’han vulnerat els teus drets."] },
        ],
      },
      cookies: {
        title: "Cookies i emmagatzematge", description: "Informació sobre cookies, idioma, emmagatzematge al navegador i enllaços externs de Block n’ Roll.",
        intro: "La web està preparada per funcionar sense cookies d’analítica ni publicitat.",
        sections: [
          { id: "idioma", title: "Idioma i formulari", paragraphs: ["L’idioma es determina per l’adreça que visites: castellà a /, català a /ca i anglès a /en. Aquesta versió no necessita desar la preferència d’idioma en cookies, localStorage ni sessionStorage.", "L’esborrany del formulari es manté en memòria mentre continues a la pàgina. No es desa a l’emmagatzematge del navegador i es perd en recarregar-la o sortir-ne. Només s’envia quan prems el botó d’enviament."] },
          { id: "seguiment", title: "Analítica, publicitat i contingut extern", paragraphs: ["El codi d’aquesta versió no incorpora eines d’analítica, píxels publicitaris ni vídeos o mapes incrustats de tercers. Les fonts, les imatges i els vídeos del club se serveixen com a fitxers del mateix lloc.", "Instagram i mapes s’ofereixen mitjançant enllaços. Quan obres un servei extern, pot utilitzar cookies i tractar dades d’acord amb la seva política."] },
          { id: "tecniques", title: "Serveis tècnics i consentiment", paragraphs: ["Les tecnologies estrictament necessàries per a la comunicació o per prestar un servei expressament sol·licitat poden estar exemptes de consentiment. El proveïdor d’allotjament s’identifica a la política de privacitat.", "Aquesta web no ofereix un panell de consentiment perquè no incorpora eines opcionals d’analítica o publicitat. Pots consultar el contingut i enviar una consulta sense acceptar aquest tipus de seguiment."] },
          { id: "control", title: "Control des del navegador", paragraphs: ["Pots consultar i eliminar les cookies i les dades desades per un lloc des dels ajustos de privacitat del navegador. Si vas visitar una versió anterior que desava l’idioma, també pots eliminar aquesta preferència des d’aquests ajustos."] },
        ],
      },
    },
  },
  en: {
    navigation: "Legal information", contents: "On this page", home: "Back to the club website",
    updated: "Last reviewed", pending: "Awaiting confirmation", notApplicable: "Not applicable",
    draft: "Draft: the website operator and service provider details still need confirmation. This documentation must be completed before it is published as final.",
    identity: "Website operator and contact",
    fields: { holderName: "Website operator / data controller", taxId: "Tax identification number", address: "Registered address", registration: "Register and registration number", email: "Contact and data protection" },
    providers: "Service providers and international transfers",
    providerFields: { hosting: "Website hosting", delivery: "Enquiry delivery", inbox: "Email receipt and storage", transfers: "Processing countries and transfer safeguards" },
    aepd: "Spanish Data Protection Agency (AEPD)",
    form: {
      controller: "Data controller:",
      purpose: "We use your data to handle your enquiry or training request.",
      rights: "You can exercise your rights as described in our",
      more: "Privacy policy", newTab: "opens in another tab",
      draft: "Draft awaiting completion.",
    },
    pages: {
      notice: {
        title: "Legal notice", description: "Website operator details, contact information and terms of use for the Block n’ Roll website.",
        intro: "This website presents the activities of Block n’ Roll, a non-profit sports club, and lets you request information about training. Training fees go towards the costs of running the club’s sporting activities.",
        sections: [
          { id: "activity", title: "Information and requests", paragraphs: ["The form lets you ask questions and request a trial class or training information. Submitting it does not confirm a place, a booking or the purchase of a service.", "Published programmes, prices and conditions relate to the season stated. The club must confirm availability and the applicable conditions before an enrolment is completed. The training venue is not necessarily the website operator’s registered address."] },
          { id: "use", title: "Using the website", paragraphs: ["Use the website and contact channels lawfully and respectfully. Do not send unlawful content, impersonate others or share other people’s personal information without a valid basis."] },
          { id: "content", title: "Content and images", paragraphs: ["Text, photographs, videos, logos and other content are subject to their owners’ rights and applicable licences. Publication does not grant general permission to reuse them. To request the use of club material, write to the contact email address."] },
          { id: "links", title: "Links to other services", paragraphs: ["Links to Instagram, maps and other external websites lead to services managed by their respective operators. Their own terms and privacy policies apply when you open them."] },
          { id: "contact", title: "Corrections and contact", paragraphs: ["If you find incorrect information, an access problem or content affecting your rights, write to the email address provided. This notice does not limit your rights under applicable law."] },
        ],
      },
      privacy: {
        title: "Privacy policy", description: "How data from the Block n’ Roll contact form is used and how to exercise your rights.",
        intro: "Here we explain what happens to your data when you visit the website or send us an enquiry.",
        sections: [
          { id: "data", title: "What data is collected", paragraphs: ["The form asks for your name and email address so that we can reply. You may add a phone number and, for training enquiries, your programme, level, number of players and availability. We also receive the text of general enquiries. We cannot process the form without a name and email address.", "Your message is emailed to the club team. Hosting and email services may also process technical data, such as IP addresses and logs needed to provide and protect their services.", "Enquiries about people under 18 should be made by their parent or legal guardian. Avoid including health information, identity documents or other people’s data in free-text fields."] },
          { id: "purpose", title: "Purposes and legal bases", paragraphs: ["Trial, place and training requests are processed to take steps at your request before entering into a contract, under Article 6(1)(b) GDPR.", "Other enquiries are handled on the basis of the controller’s legitimate interest in replying to communications received, under Article 6(1)(f) GDPR. You may object to this processing on grounds relating to your particular situation.", "Form data is not used to subscribe you to advertising. Enquiry data is not used for automated decision-making or profiling."] },
          { id: "retention", title: "How long data is kept", paragraphs: ["Enquiries are kept for as long as needed to respond and carry out the follow-up you have requested. Once handling is complete, they must be deleted, except for data that must be retained with restricted access for legally required periods to address potential liability.", "If you subsequently enrol, you must be informed at that time about the processing needed to manage your relationship with the club. This form’s privacy information does not replace enrolment documentation."] },
          { id: "recipients", title: "Who can access your data", paragraphs: ["Access is available to club staff handling enquiries and the hosting and email providers involved in delivery, receipt and storage. Enquiry data is not sold. Data is disclosed to authorities where legally required.", "The providers, processing countries and safeguards for international transfers are detailed in this policy’s service providers section."] },
          { id: "rights", title: "Your rights", paragraphs: ["You may request access, correction and deletion of your data, as well as restriction, objection and portability where applicable. Write to the data protection email address provided and explain your request; further identity information will only be requested when necessary.", "Where processing relies on your consent, you may withdraw it at any time without affecting the lawfulness of earlier processing. You may complain to the Spanish Data Protection Agency if you believe your rights have been infringed."] },
        ],
      },
      cookies: {
        title: "Cookies and storage", description: "Information about cookies, language, browser storage and external links on the Block n’ Roll website.",
        intro: "The website is designed to work without analytics or advertising cookies.",
        sections: [
          { id: "language", title: "Language and the contact form", paragraphs: ["Your language is determined by the address you visit: Spanish at /, Catalan at /ca and English at /en. This version does not need to save your language preference in cookies, localStorage or sessionStorage.", "Your form draft stays in memory while you remain on the page. It is not saved in browser storage and is lost when you reload or leave. It is only sent when you press the submit button."] },
          { id: "tracking", title: "Analytics, advertising and external content", paragraphs: ["This version’s code does not include analytics tools, advertising pixels or embedded third-party videos or maps. The club’s fonts, images and videos are served as files from the website itself.", "Instagram and maps are provided as links. When you open an external service, it may use cookies and process data under its own policy."] },
          { id: "technical", title: "Technical services and consent", paragraphs: ["Technologies strictly necessary for communication or to provide a service you have expressly requested may be exempt from consent. The hosting provider is identified in the privacy policy.", "This website has no consent panel because it does not include optional analytics or advertising tools. You can read its content and send an enquiry without accepting that kind of tracking."] },
          { id: "control", title: "Browser controls", paragraphs: ["You can inspect and remove a website’s cookies and stored data in your browser’s privacy settings. If you visited an earlier version that saved your language, you can also remove that preference in those settings."] },
        ],
      },
    },
  },
};
