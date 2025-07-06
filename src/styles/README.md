# Block n' Roll CSS Architecture

This directory contains the modular CSS architecture for the Block n' Roll website. The styles are organized for better maintainability, scalability, and readability.

## Directory Structure

```
src/styles/
├── global/                 # Global styles and design tokens
│   ├── design-tokens.css   # CSS custom properties and brand colors
│   ├── base.css           # Base HTML elements and reset
│   ├── typography.css     # Typography system
│   └── index.css          # Global styles index
├── components/            # Component-specific styles
│   ├── hero.css          # Hero component styles
│   ├── navbar.css        # Navigation styles
│   ├── buttons.css       # Button system
│   ├── cards.css         # Card components
│   ├── forms.css         # Form elements
│   └── index.css         # Components index
├── utils/                # Utility classes and responsive design
│   ├── utilities.css     # Utility classes
│   ├── responsive.css    # Responsive design system
│   └── index.css         # Utils index
└── index.css             # Main stylesheet entry point
```

## Design System

### Brand Colors

- `--block-main`: Primary brand color (#ffa52d)
- `--block-main-dark`: Darker variant (#ee811e)
- `--block-red`: Accent color (#9b2915)
- `--block-blue`: Secondary color (#1b9aaa)
- `--block-cream`: Background color (#edf4ed)
- `--block-black`: Text color (#131719)

### Typography

- **Base Font**: Inter
- **Heading Font**: Space Grotesk
- **Brand Font**: Outfit
- **Title Font**: Feast of Flesh BB
- **Subtitle Font**: Amatic SC

### Spacing Scale

- `--space-xs`: 0.5rem
- `--space-sm`: 0.75rem
- `--space-md`: 1rem
- `--space-lg`: 1.5rem
- `--space-xl`: 2rem
- `--space-2xl`: 3rem
- `--space-3xl`: 4rem
- `--space-4xl`: 6rem

## Usage

### Importing Styles in Components

Each component should import its specific CSS file:

```tsx
import "../styles/components/hero.css";
```

### Global Styles

Global styles are automatically imported through the main `src/index.css` file, which imports:

1. Design tokens and base styles
2. Component styles
3. Utility classes and responsive design

### Adding New Components

1. Create a new CSS file in `src/styles/components/`
2. Add the import to `src/styles/components/index.css`
3. Import the CSS file in your component

### Adding New Utilities

1. Add utility classes to `src/styles/utils/utilities.css`
2. Add responsive variants to `src/styles/utils/responsive.css`

## Best Practices

1. **Use Design Tokens**: Always use CSS custom properties for colors, spacing, and typography
2. **Component-Specific Styles**: Keep styles close to their components
3. **Responsive Design**: Use the provided responsive breakpoints
4. **Accessibility**: Include focus states and reduced motion preferences
5. **Performance**: Use efficient selectors and avoid deep nesting

## Responsive Breakpoints

- **Extra Small**: 320px - 575px (phones)
- **Small**: 576px - 767px (landscape phones)
- **Medium**: 768px - 991px (tablets)
- **Large**: 992px - 1199px (desktops)
- **Extra Large**: 1200px - 1399px (large desktops)
- **Ultra Large**: 1400px+ (ultra-wide screens)

## Accessibility Features

- Reduced motion support
- High contrast mode support
- Touch device optimizations
- Focus management
- Screen reader friendly

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
