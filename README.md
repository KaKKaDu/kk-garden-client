# kk-garden client

The client is the user-facing Next.js application for the kk-garden diploma
project. It is intended to present garden creation and visualisation features
while leaving business rules, validation, authorization, and derived state to
the backend.

The client is currently an early scaffold: the home page is a placeholder and
the application is not yet connected to the API. Starting the client alone
does not start the backend or provide working garden features.

UI and state foundations are installed: shadcn/ui uses the Base UI Nova preset
with neutral CSS-variable theming, and Zustand, Zod, React Hook Form, and
`@hookform/resolvers` are available for feature implementation. No
feature-specific stores or forms have been added yet. Add shadcn/ui components
with `npx shadcn add <component>`.

## Accent theming

The theme service accepts `#RGB` or `#RRGGBB` accent colors and derives the
light and dark shadcn color variables from that seed. Apply an accent from
client-side code with:

```ts
import { getThemeService } from '@/services/theme/theme.container';

getThemeService().setAccentColor('#321899');
```

For now, the root layout passes the mock default accent `#321899` through
`src/components/providers/AccentThemeProvider.tsx`. Profile preference
loading and synchronization will replace this temporary value later.

The accent drives primary, ring, surface, foreground, and sidebar colors.
Destructive colors remain conventionally red, and shadcn's chart variables
remain at their initial CSS values until the app needs charts.

## Project packages

The project is split into independently managed packages:

- `kk-client` — Next.js App Router, React, and Tailwind CSS application.
- `kk-server` — Fastify API and the authority for business logic and
  persistence. The local server listens on port `8090`; consult its setup
  instructions for required environment variables and MongoDB configuration.
- `shared` — published `@kk-garden/shared` package containing shared schemas,
  types, errors, assets, and utilities. The server currently uses it; client
  integration is pending.

## Requirements

- Node.js `20.9.0` or later
- npm

## Install and run

From this directory, install the locked dependencies and start the development
server:

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The current client
scaffold does not consume environment variables. When API integration is
added, the client convention is to read the backend URL from
`NEXT_PUBLIC_API_BASE_URL` through centralized API configuration.

To create and run a production build locally:

```sh
npm run build
npm start
```

The backend is started separately from its own package and has additional
configuration requirements.

## Development commands

```sh
npm run lint          # Check ESLint rules
npm run format        # Format client files with Prettier
npm run format:check  # Check formatting without changing files
```

Vitest and React Testing Library are not configured yet, so there is currently
no client test command.
