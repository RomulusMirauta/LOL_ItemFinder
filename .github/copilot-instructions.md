# Copilot Instructions for LOL_ItemFinder

## Project Overview

- This is a React + TypeScript + Vite project for searching and displaying League of Legends items.
- Main app logic is in `src/App.tsx`, with UI split into components under `src/components/`.
- Static resources (images, SVGs) are stored in `src/assets/` (for app usage) and `public/` (for favicons or direct static serving).

## Architecture & Data Flow

- Entry point: `src/main.tsx` renders `App` into the DOM.
- Item data and constants are managed in `src/constants.ts` and `src/utils/itemConstants.ts`.
- API integration (e.g., Riot API) is handled in `src/api/riotApi.ts`.
- UI is composed of modular components: `ItemCard`, `ItemGrid`, `Filters`, `SearchBar`, `SortBar`, and `MainTitle`.
- Types are defined in `src/types/` for strong typing across components and utilities.

## Developer Workflows

- **Build:** Use Vite (`npm run build`) for production builds.
- **Dev Server:** Start with `npm run dev` for hot-reloading development.
- **Linting:** ESLint config is in `eslint.config.js`. Type-aware linting is recommended (see README for config).
- **Type Checking:** TypeScript config files: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`.
- **Static Assets:** Place images/icons in `src/assets/` for imports, or in `public/` for direct access (e.g., favicon).

## Project-Specific Patterns

- All major UI elements are React components in `src/components/`.
- Styles are organized in `src/styles/` and imported per-component.
- Item logic (search, filter, sort) is modularized in `src/utils/`.
- Use TypeScript types from `src/types/` for all item-related data.
- Favicon/logo for the app is referenced in `index.html` and should be placed in `public/`.

## Integration Points

- Riot API integration is in `src/api/riotApi.ts`.
- Vite config is in `vite.config.ts` for build and dev server customization.

## Examples

- To change the app logo, update the favicon reference in `index.html` and place the logo file in `public/`.
- To add a new filter, create a new component in `src/components/` and update logic in `src/utils/itemFilters.ts`.
- To add a new item property, update types in `src/types/item.ts` and constants in `src/constants.ts`.

## Key Files & Directories

- `src/App.tsx`: Main app logic
- `src/components/`: UI components
- `src/assets/`, `public/`: Static resources
- `src/utils/`: Item logic (search, filter, sort)
- `src/types/`: TypeScript types
- `src/api/riotApi.ts`: API integration
- `vite.config.ts`: Vite configuration
- `eslint.config.js`: ESLint rules
- `index.html`: HTML template and favicon

---

If any section is unclear or missing important project-specific details, please provide feedback to improve these instructions.
