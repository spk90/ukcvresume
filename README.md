# ukcvresume.co.uk

## Getting Started

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

Deploy the `dist/` folder to your static host.

## Environment variables

Create a `.env` file (don’t commit real keys):

```
VITE_ENABLE_AI=false
# Optional if enabling AI locally
# VITE_OPENAI_API_KEY=sk-...
```

## Security

- Security headers added in `index.html` (CSP, X-Frame-Options, nosniff, strict referrer).
- AI features are OFF by default via `VITE_ENABLE_AI`.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
