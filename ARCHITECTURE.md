# Block n' Roll - Project Architecture

## 📁 Folder Structure

```
blocknroll/
├── api/                     # Serverless functions API (email sending)
├── emails/                # Email templates
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, docs, and other assets
│   │   ├── docs/            # PDF documents
│   │   └── img/             # Images
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── services/        # Service-specific components
│   │   └── *.tsx            # Page-specific components
│   ├── constants/           # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── i18n/                # Internationalization
│   │   └── locales/         # Translation files
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components
│   ├── routes/              # Routing configuration
│   ├── test/                # Test utilities and setup
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── .github/workflows/       # CI/CD pipelines
└── coverage/                # Test coverage reports (gitignored)
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**

- **Components**: Reusable UI building blocks
- **Pages**: Route-specific component compositions
- **Layouts**: Consistent page structure templates
- **Hooks**: Reusable stateful logic

### 2. **Scalable Routing**

- Centralized route definitions in `constants/routes.ts`
- Dedicated `routes/` folder for routing logic
- Layout-based page wrapping for consistency

### 3. **Clean Imports**

- Path aliases configured (`@`, `@components`, `@pages`, etc.)
- Barrel exports in index files
- Consistent import organization

### 4. **Type Safety**

- Comprehensive TypeScript coverage
- Centralized type definitions
- Strict TypeScript configuration

### 5. **Testing Strategy**

- Component tests co-located with components
- Integration tests in `src/test/`
- High coverage thresholds (90%+)
- Test utilities for consistent setup

## 🚀 Scalability Features

### For Multi-Page Applications:

```typescript
// Easy to add new routes
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  GALLERY: "/gallery",
  CONTACT: "/contact",
  // Future routes...
} as const;
```

### For Feature Expansion:

- **Components**: Modular and reusable
- **Hooks**: Extractable business logic
- **Types**: Centralized and extensible
- **Utils**: Shared functionality

### For Internationalization:

- React-i18next integration
- Locale-based routing ready
- Type-safe translation keys

## 🛠️ Development Workflow

### Adding New Pages:

1. Create component in `src/pages/`
2. Add route to `constants/routes.ts`
3. Update `routes/AppRoutes.tsx`
4. Export from `pages/index.ts`

### Adding New Components:

1. Create in appropriate `components/` subfolder
2. Add tests alongside component
3. Export from relevant `index.ts`
4. Document props with TypeScript interfaces

### Path Aliases Available:

- `@/` → `src/`
- `@api/` → `api/`
- `@emails/` → `emails/`
- `@components/` → `src/components/`
- `@pages/` → `src/pages/`
- `@layouts/` → `src/layouts/`
- `@hooks/` → `src/hooks/`
- `@types/` → `src/types/`
- `@utils/` → `src/utils/`
- `@constants/` → `src/constants/`
- `@assets/` → `src/assets/`
- `@i18n/` → `src/i18n/`

## 📋 Best Practices Implemented

### ✅ Code Organization

- Clear separation between pages, components, and layouts
- Consistent naming conventions
- Logical folder grouping

### ✅ Performance

- Component-level code splitting ready
- Optimized build configuration
- Asset optimization setup

### ✅ Maintainability

- Comprehensive test coverage
- Type safety throughout
- Clear documentation

### ✅ Developer Experience

- Path aliases for clean imports
- Hot module replacement
- Comprehensive linting

### ✅ CI/CD Ready

- GitHub Actions workflows
- Automated testing
- Build verification
- Coverage reporting
