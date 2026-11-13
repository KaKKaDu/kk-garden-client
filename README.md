# kk-garden client

The client is the user-facing Next.js application for the kk-garden diploma
project. It is intended to present garden creation and visualisation features
while leaving business rules, validation, authorization, and derived state to
the backend.

The client is currently an early scaffold: the home page is a placeholder and
garden features are not yet connected to the API. Its stateless auth service
does call the backend's Better Auth endpoints. Starting the client alone does
not start the backend or provide working garden features.

Authentication supports email OTP, Google/GitHub, passkeys, and sign-out.
Session checks for Server Components forward the incoming HTTP-only cookie to
the backend and return a narrow, validated session shape; no session data is
persisted in browser storage.

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

const themeResult = getThemeService().setAccentColor('#321899');
if (!themeResult.success) {
  console.error(themeResult.errors);
}
```

`setAccentColor` returns the shared `SuccessDataAny` result; check `success`
before assuming the theme was applied.

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
  types, errors, assets, and utilities. Both the server and client consume it;
  broader client contract integration will follow as features are added.

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

Open [http://localhost:3000](http://localhost:3000). Client auth services read
the backend origin from `NEXT_PUBLIC_API_BASE_URL` through the container-managed
`EnvService` and `ApiService` (typically `http://localhost:8090` for local
development). Next.js inlines this `NEXT_PUBLIC_*` value into the client build,
so configure it before building and never put secrets in it.
The `dev`, `build`, and `start` scripts validate the configured environment
first; run `npm run env-validate` to validate it independently.
Authentication uses Better Auth's HTTP-only session cookie; Server Components
can read the current session from the backend without persisting session data
in browser storage.
For local browser authentication, the server's comma-separated
`CLIENT_ORIGINS` must include the exact client origin `http://localhost:3000`.
Origins such as `http://127.0.0.1:3000` are distinct; restart the server after
changing the allowlist.

To create and run a production build locally:

```sh
npm run build
npm start
```

The backend is started separately from its own package and has additional
configuration requirements.

## Development commands

```sh
npm run env-validate
npm run check        # Run ESLint and TypeScript checks
npm run lint          # Check ESLint rules
npm run typescript    # Run the TypeScript check
npm run format        # Format client files with Prettier
npm run format:check  # Check formatting without changing files
```

Vitest and React Testing Library are not configured yet, so there is currently
no client test command.
