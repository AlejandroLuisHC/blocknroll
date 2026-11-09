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

### Edit season information in Vercel

1. In the `blocknroll` project, open **Storage** and upload the guide and rules from `src/assets/docs/` to a **public Blob** store. Copy both public URLs.
2. In **Global Config**, add the `clubSeason` item shown below to the store's **Items** editor. Replace both PDF URLs with the actual Blob URLs and save. Connect the store to the project so Vercel provides the server-side `GLOBAL_CONFIG` variable.
3. Deploy the integration once. For future changes, edit `clubSeason` and save it in the dashboard. To replace a PDF, upload the new version under a new filename and update its URL in the same item.

```json
{
  "clubSeason": {
    "startsOn": "2026-09",
    "endsOn": "2027-06",
    "prices": {
      "one_per_week": 40,
      "two_per_week": 75,
      "coachSupplement": 5,
      "annualLicence": 37,
      "processingFeePercent": 4
    },
    "documents": {
      "guide": "https://<store-id>.public.blob.vercel-storage.com/guia-club-2026-27.pdf",
      "rules": "https://<store-id>.public.blob.vercel-storage.com/normativa-club-2026-27.pdf"
    }
  }
}
```

Enter dates as `YYYY-MM` and prices as numbers in euros. Enter the payment fee as a percentage, for example `4` for 4%. Dates and prices are formatted in the visitor's selected language. The public response is cached at Vercel for up to 30 seconds. Local previews and deployments without a connected store use the bundled season. If a connected store is unavailable or its data is invalid, the site displays a contact option for pricing and hides the PDF links until it can load valid content.

## 📷 Instagram Integration *(to-do)*

The gallery should automatically display Instagram posts when configured:

### Features:
   - ✅ Automatic post loading
   - ✅ Smart fallback to sample images
   - ✅ Media type support (images/videos)
   - ✅ Error handling and loading states
   - ✅ Manual refresh capability
   - ✅ Redirect to post/account

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
- [ ] SEO optimization
- [ ] Blog functionality 
- [ ] Payment integration (?)
- [ ] Member dashboard (?)
- [ ] Events calendar/management (?)
- [ ] Analytics integration (?)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with love ❤️ for the Block n' Roll club and the beach volleyball community.
