# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions CI/CD workflows for automated testing, linting, and building
  - Full CI workflow with multi-Node version testing and coverage reporting
  - Quick check workflow for faster PR validation

### Changed

- Improved code formatting consistency in GitHub Actions workflows

### Fixed

### Removed

### Security

## [0.1.0] - 2025-06-24

### Added

- Initial project setup for Block n' Roll volleyball club website
- React 19.1.0 with TypeScript support
- Vite build system with development server
- Multi-language support (Spanish, English, Catalan) using react-i18next
- Modern responsive UI with Bootstrap 5.3.2
- Component library with reusable UI components:
  - Hero section with club branding
  - About section with club information
  - Services section with training programs
  - Contact form with validation
  - Language selector for internationalization
  - Modern cards and pricing components
  - Gallery component for photos
- Testing infrastructure with Vitest and React Testing Library
- ESLint configuration for code quality
- TypeScript configuration for type safety
- Contact form functionality with custom hooks
- PDF download functionality for training information
- Social media integration components
- Responsive navigation with mobile support

### Development

- Comprehensive test suite with unit and integration tests
- Test coverage reporting with @vitest/coverage-v8
- Development tools including Vitest UI for test debugging
- Hot module replacement for efficient development
- TypeScript strict mode for better code quality

### Dependencies

- React 19.1.0 and React DOM 19.1.0
- React Router DOM 7.6.2 for navigation
- i18next ecosystem for internationalization
- Lucide React for modern icons
- Flag Icons for language selection
- Bootstrap for responsive design
- Comprehensive development toolchain with Vite, TypeScript, and ESLint

[unreleased]: https://github.com/yourusername/blocknroll/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/blocknroll/releases/tag/v0.1.0
