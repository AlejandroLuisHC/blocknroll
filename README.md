# Block n' Roll - Club de Vóley Playa Barcelona

Una landing page moderna y acogedora para el club de voleibol de playa Block n' Roll, ubicado en Barcelona, España.

## 🏐 Sobre el Club

Block n' Roll es un club de vóley playa en Barcelona creado por Sara, Jesús y David, apasionadxs del vóley playa y del rock 🎸. Ofrecemos entrenamientos dinámicos, intensos y adaptados a cada persona en un ambiente cercano, divertido y lleno de arena.

### Características del Club

- **Entrenamientos Dinámicos**: Sesiones intensas y personalizadas de 1h30
- **Grupos Reducidos**: Máximo 8 personas por pista para seguimiento cercano
- **Entrenadores Acreditados**: Certificación oficial de Vóley Playa Nivel 1
- **Sesión de Prueba Gratuita**: Para conocernos sin compromiso
- **Metodología Propia**: Enfoque integral en capacidades físicas, técnicas y tácticas
- **Comunidad Activa**: Buen rollo, ambiente familiar y mucha arena

## 🚀 Tecnologías Utilizadas

- **React 19** - Framework de JavaScript
- **TypeScript** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo
- **Bootstrap 5.3.2** - Framework de CSS para styling
- **react-i18next** - Internacionalización (Español/Inglés)
- **Lucide React** - Iconos modernos
- **Instagram Basic Display API** - Integración con Instagram para galería en tiempo real

## 📦 Instalación

1. **Clona el repositorio**

   ```bash
   git clone <repository-url>
   cd blocknroll/blocknroll
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre tu navegador**
   Navega a `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Navbar.tsx      # Barra de navegación
│   ├── Hero.tsx        # Sección principal con tema rock/vóley
│   ├── About.tsx       # Quiénes somos
│   ├── Services.tsx    # Entrenamientos y precios
│   ├── Gallery.tsx     # Galería de la comunidad
│   ├── Contact.tsx     # Formulario sin compromiso
│   └── Footer.tsx      # Pie de página
├── i18n/               # Internacionalización
│   └── locales/        # Traducciones ES/EN
├── types/              # Tipos TypeScript
├── App.tsx             # Componente principal
├── main.tsx           # Punto de entrada
└── index.css          # Estilos Bootstrap + personalizados
```

## 🎨 Diseño y Tema

### Identidad Visual

- **Colores**: Azul (voleibol) y Amarillo (arena/playa)
- **Tema**: Rock & Voleibol - "Where sand meets music"
- **Estilo**: Moderno, acogedor y comunitario
- **Emojis**: 🎸 🏐 🎵 🏖️ para reforzar la identidad rock/playa

### Enfoque

- **No comercial agresivo**: Informativo y acogedor
- **Comunidad primero**: Enfoque en la familia Block n' Roll
- **Transparencia**: Precios claros, sesión gratuita
- **Inclusividad**: Para todos los niveles y edades

## 📱 Secciones de la Landing Page

1. **Hero** - Presentación con tema rock/vóley y stats reales
2. **About** - Historia de Sara, Jesús y David
3. **Training** - Programas 1x/semana, 2x/semana y privados
4. **Gallery** - Comunidad y entrenamientos (placeholder)
5. **Contact** - Formulario sin compromiso
6. **Footer** - Información de contacto y redes

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Linting del código

## 📍 Información del Club

- **Ubicación**: CEM Eurofitness Vall d'Hebron, Barcelona
- **Dirección**: Pg. de la Vall d'Hebron, 178, Horta-Guinardó, 08035 Barcelona
- **Email**: blocknroll.bcnclub@gmail.com
- **Instagram**: @blocknrollbeachvolleybcn
- **Horarios**: Lun-Vie 18:00-22:30 (Inicio: Septiembre 2025)

## 💸 Precios

- **1 Entreno/Semana**: 35€/mes
- **2 Entrenos/Semana**: 65€/mes
- **Entrenamientos Privados**: Consultar
- **Licencia Federativa**: 35€/año (incluye seguro)

## 🚀 Despliegue

El proyecto está configurado para ser desplegado fácilmente:

1. **Netlify/Vercel**: Conecta tu repositorio
2. **GitHub Pages**: Usa `npm run build` y sube la carpeta `dist`

## 🎯 Próximas Características

- [ ] Galería real con fotos de entrenamientos
- [ ] Integración con Instagram API
- [ ] Sistema de reservas para sesiones gratuitas
- [ ] Blog sobre metodología y técnicas
- [ ] Testimonios de la comunidad

## 📞 Contacto del Club

Para más información:

- **Email**: blocknroll.bcnclub@gmail.com
- **Instagram**: @blocknrollbeachvolleybcn
- **Lema**: "We will Block n' Roll!" 🎸

## 📷 Configuración de Instagram

La galería puede mostrar automáticamente las últimas 4 publicaciones de Instagram. Para configurar esta funcionalidad:

### 1. Crear App de Instagram

1. Ve a [Facebook Developers](https://developers.facebook.com/apps/)
2. Crea una nueva app tipo "Consumer"
3. Añade el producto "Instagram Basic Display"
4. Configura las URLs de callback y permisos

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Instagram Basic Display API Configuration
VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
VITE_INSTAGRAM_USER_ID=your_instagram_user_id_here
```

### 3. Obtener Token de Acceso

```bash
# 1. Autorización (reemplaza YOUR_APP_ID y REDIRECT_URI)
https://api.instagram.com/oauth/authorize?client_id=YOUR_APP_ID&redirect_uri=REDIRECT_URI&scope=user_profile,user_media&response_type=code

# 2. Intercambiar código por token (POST request)
curl -X POST https://api.instagram.com/oauth/access_token \
  -F client_id=YOUR_APP_ID \
  -F client_secret=YOUR_APP_SECRET \
  -F grant_type=authorization_code \
  -F redirect_uri=REDIRECT_URI \
  -F code=AUTHORIZATION_CODE

# 3. Intercambiar por token de larga duración
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=YOUR_APP_SECRET&access_token=SHORT_LIVED_TOKEN"
```

### 4. Funcionalidad

- ✅ **Carga automática**: Muestra las últimas 4 publicaciones
- ✅ **Fallback inteligente**: Si no hay configuración o falla la API, usa imágenes de muestra
- ✅ **Categorización automática**: Clasifica posts por palabras clave en caption
- ✅ **Soporte multimedia**: Imágenes y videos (con thumbnails)
- ✅ **Enlaces directos**: Botón para ver publicación original en Instagram
- ✅ **Actualización manual**: Botón de refresh para contenido nuevo
- ✅ **Manejo de errores**: Estados de carga y error user-friendly

Sin configuración, la galería funcionará con imágenes de muestra automáticamente.

---

Desarrollado con ❤️ para la familia Block n' Roll
