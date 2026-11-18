# Block n' Roll - Beach Volleyball Club Website

A modern and welcoming landing page built with React and TypeScript.

## 🏐 About This Project

This is a responsive, multilingual website designed specifically for Block n' Roll beach volleyball club.

### Key Features

- **Modern Design**: Clean, responsive layout optimized for all devices
- **Multilingual Support**: Built-in internationalization (Spanish/English/Catalan)
- **Service Showcase**: Flexible sections for training programs and pricing
- **Dynamic Gallery**: Future Instagram integration with smart fallback to sample images
- **Contact Section**: User-friendly contact and inquiry section with email sending service
- **Performance Optimized**: Fast loading with modern build tools

## 🚀 Technologies Used

- **React 19** - Modern React framework
- **TypeScript** - Static type checking
- **Vite** - Fast build tool and development server
- **Bootstrap** - CSS framework for responsive design
- **react-i18next** - Internationalization library
- **Vitest** - Testing framework
- **Vercel** - Serverless functions and deployment
- **Nodemailer** - Email sending library
- **Maileroo** - SMTP provider
- **React Email** - Email templates

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd blocknroll
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Main Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation bar
│   ├── Hero.tsx        # Hero section with stats
│   ├── About.tsx       # About section
│   ├── Services.tsx    # Training programs and pricing
│   ├── Gallery.tsx     # Dynamic photo gallery
│   ├── Contact.tsx     # Contact form
│   ├── Footer.tsx      # Footer component
│   └── ui/             # Reusable UI components
├── i18n/               # Internationalization
│   └── locales/        # Translation files (ES/EN/CA)
├── styles/             # CSS modules and styling
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── layouts/            # Page layouts
├── pages/              # Page components
└── routes/             # Application routing
```

## 🎨 Design System

### Design Principles

- **Community First**: Focus on building relationships over sales
- **Accessibility**: Designed for all skill levels and backgrounds
- **Transparency**: Clear information and straightforward communication
- **Mobile-First**: Responsive design optimized for all devices

## 📱 Website Sections

1. **Hero** - Eye-catching introduction with key statistics
2. **About** - Club story and team information
3. **Services** - Training programs and pricing options
4. **Gallery** - Community photos and activities
5. **Contact** - Contact form and location information
6. **Footer** - Additional information and social links

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## 🌐 Customization

### Content Localization

The project supports multiple languages through `react-i18next`. Translation files are located in `src/i18n/locales/`:

- `es.json` - Spanish translations
- `en.json` - English translations
- `ca.json` - Catalan translations

### Styling

Styles are organized using CSS modules:

- `src/styles/global/` - Global styles and design tokens
- `src/styles/components/` - Component-specific styles
- `src/styles/utils/` - Utility classes and responsive helpers

## Search visibility and multilingual pages

`pnpm build` creates complete HTML pages for Spanish (`/`), Catalan (`/ca`) and English (`/en`) before generating the sitemap and robots file. React hydrates the same content in the browser. The language selector changes the URL and metadata without clearing the contact draft. Direct visits use the URL language, regardless of browser settings or a previously saved preference. Crawlable language links also appear in the footer.

The build includes localized titles, descriptions, Open Graph and Twitter metadata, canonical URLs, reciprocal `hreflang` links and JSON-LD for the sports organization, website and page. The training venue is represented as a location, not as an assertion that the club owns the facility. Current prices and documents continue to load from `/api/club-season`; they are deliberately excluded from the static structured data so changes in Vercel do not leave outdated price claims in metadata.

The production origin defaults to the project's verified domain, `https://blocknroll.vercel.app`. Set `VITE_SITE_URL` to the final HTTPS origin if the club moves to a custom domain. Redirect the previous domain to the new one through Vercel and update the Search Console property when moving.

Vercel preview builds automatically receive `noindex`. Set `VITE_NOINDEX=true` for any other staging build. Leave it false in production. `vercel.json` serves the generated language pages with clean URLs, normalizes trailing slashes and redirects `/es` to `/`. Unknown production paths use the generated `404.html`; there is intentionally no catch-all rewrite that would turn missing pages into successful homepages.

### Checks

- `pnpm check:seo` checks the existing production output. It also runs automatically at the end of `pnpm build`.
- It validates content without JavaScript, all three languages, canonical and alternate URLs, structured data, image/script/style references, the sitemap and the noindex 404 page.
- `pnpm test:cover` covers language navigation, back navigation, contact draft retention, metadata updates, invalid canonical configuration and the existing email flow.
- The build-only React renderer lives in `.prerender/`, which is ignored by Git and is outside Vercel's `dist` output. No server-rendering dependency is sent to the browser.

### After publishing

1. Confirm `/`, `/ca`, `/en`, `/robots.txt` and `/sitemap.xml` respond successfully on the production domain. Check an invented path returns HTTP 404. Verify production pages do not contain `noindex`.
2. Verify the production URL-prefix property in [Google Search Console](https://search.google.com/search-console). For HTML-tag verification, put Google's public token in `VITE_GOOGLE_SITE_VERIFICATION` and deploy. DNS verification is another option for a custom domain.
3. Submit `https://blocknroll.vercel.app/sitemap.xml` (or the equivalent on the configured custom domain), inspect the three language URLs and request indexing.
4. Validate the published structured data in [Schema Markup Validator](https://validator.schema.org/) and inspect the rendered page with Search Console. Markup describes the club; it does not guarantee an enhanced search result.
5. Use the same club name, training address and production website in the club's Instagram bio and other existing official profiles. Maintain an eligible Google Business Profile if the club has one, with accurate contact and location details.
6. Track indexed pages, non-brand queries, impressions, clicks and enquiries. Review queries around vóley playa Barcelona, vòlei platja Barcelona, beach volleyball Barcelona and Vall d’Hebron using actual Search Console data before creating additional pages.

These account-level actions and production publication are separate from the local code changes. No Search Console verification token or indexing submission is fabricated or assumed.

## Liga de Clubes

The league is available at `/liga-clubes`, `/ca/lliga-clubs` and `/en/clubs-league`, with a link in the main navigation and footer. It uses the existing visual system, a team filter, upcoming fixtures, results and expandable lineups. Missing scores are pending, not zero. Past fixtures without both scores remain pending results. An optional `ESTADO` column accepts `Aplazada` or `Cancelada`.

`GET /api/clubs-league` reads the existing `clubSeason` item using the server-only `GLOBAL_CONFIG` (or `EDGE_CONFIG`) connection. Set `clubSeason.documents.clubs_league_data` to the public Vercel Blob URL of the `.xlsx`. The function fetches and parses that workbook on the server with ExcelJS; the reader credential and Excel parser are not sent to the browser. The other `clubSeason` fields retain their existing behavior.

The supported fixture format is the attached single-sheet workbook: headers in row 1, one encounter per row. Sheet names and column order do not matter. The reader trims header whitespace and ignores case and accents. Required headers are `FECHA`, `EQUIPO` and `OPONENTE`; only rows with all three values and a valid date are published. Optional columns are `HORA`, `VENUE` (or `SEDE`), `PARTIDOS GANADOS`, `PARTIDOS PERDIDOS`, `PAREJA 1`, `PAREJA 2`, `PAREJA 3`, `DIRECCION`, `JORNADA`, `FASE` and `ESTADO`. Pair cells are displayed as entered, so they can be updated to reflect substitutions. Dates can be real Excel dates, `YYYY-MM-DD` or `DD/MM/YYYY`; times can be Excel times or `HH:mm`. Scores must be non-negative whole numbers. Formulas use their saved results; the server does not recalculate Excel formulas.

The optional `Clasificacion` (or `Clasificación`) sheet takes `POSICION` and `EQUIPO`, plus optional `COMPETICION` (or `CODIGO COMPETICION`), `CATEGORIA`, `GRUPO`, `PUNTOS`, `PARTIDOS JUGADOS`, `PARTIDOS GANADOS`, `PARTIDOS PERDIDOS`. Tables are grouped by competition, category and group. Without that sheet, the page shows standings awaiting publication. Standings are never inferred from partial fixtures.

To update the league, upload the updated file to Blob and update its URL in Global Config if it changes. No rebuild is required. An open, visible page refreshes every minute and when returning to the tab; successful API/file reads are cached for up to 30 seconds. Blob downloads include a refresh query to avoid keeping the browser's old copy after overwriting a pathname. Vercel notes that Blob overwrites can still take up to 60 seconds to propagate through its CDN: [Blob caching documentation](https://vercel.com/docs/vercel-blob). A failed refresh preserves the last loaded data with a visible notice. No configured document produces an unpublished state; an invalid/unavailable file produces a retryable error. Files are limited to 5 MiB and 5,000 rows per sheet.

For a local preview using a workbook without a Vercel runtime, start Vite with `CLUBS_LEAGUE_FILE` set to an absolute workbook path (PowerShell: `$env:CLUBS_LEAGUE_FILE='C:\\path\\league.xlsx'; pnpm dev`). This override exists only in the development middleware. Without it, the middleware uses the server connection from the environment or `.env`. Keep real workbooks outside the repository; Excel files are ignored by Git.

League tests create fictitious workbooks directly in memory with `src/test/helpers/league-workbook.js`. They do not require an Excel file on disk or access live league data. API downloads are mocked; the parser still reads actual XLSX bytes generated by ExcelJS, covering dates, times, incomplete results, lineups and standings.

## 📷 Instagram Integration *(to-do)*

The gallery should automatically display Instagram posts when configured:

### Features:
   - ✅ Automatic post loading
   - ✅ Smart fallback to sample images
   - ✅ Media type support (images/videos)
   - ✅ Error handling and loading states
   - ✅ Manual refresh capability
   - ✅ Redirect to post/account

## Legal information

Legal notice, privacy and browser-storage pages are available in all three languages. The contact form includes a privacy summary. Legal identity and email-provider details are still unverified: complete `src/config/legal.ts` and follow [the publication notes](docs/legal-launch.md) before treating these documents as final. Draft pages are marked visibly, use `noindex` and are excluded from the sitemap. Language selection now uses the URL without storing a browser preference.

## 📧 Email Sending

Emails are sent from a Serverless Function (`api/send-email.js`) using Nodemailer over SMTP.

Note: Works with any SMTP provider (e.g., Maileroo, Gmail, etc.) by setting the variables accordingly.

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and utility function tests
- **Coverage Reports**: Detailed test coverage analysis

Run tests with:

```bash
npm run test
npm run test:coverage
```

## 🎯 To-Do List

- [ ] Instagram app integration
- [x] Technical SEO and multilingual prerendering
- [ ] Search Console verification and sitemap submission after publication
- [ ] Blog functionality (?)
- [ ] Payment integration (?)
- [ ] Member dashboard (?)
- [ ] Events calendar/management (?)
- [ ] Analytics integration (?)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with love ❤️ for the Block n' Roll club and the beach volleyball community.
