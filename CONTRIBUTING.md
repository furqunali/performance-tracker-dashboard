# Contributing

Thanks for your interest in improving the Enterprise Performance Tracker! This
is a portfolio demo, but contributions and suggestions are welcome.

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

## Development workflow

1. Fork the repo and create a feature branch from `main`
   (`git checkout -b feat/short-description`).
2. Make your change, keeping the existing code style (React function
   components, Tailwind utility classes, small isolated modules).
3. Add or update tests for any logic you touch.
4. Make sure everything is green before opening a PR:

   ```bash
   npm test          # vitest run — all tests must pass
   npm run build     # production build must succeed
   ```

5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit
   messages (`feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`).
6. Open a pull request against `main` and fill out the PR template.

## Project conventions

- **State** goes through the store API in `src/data/store.js` — never mutate
  state directly or write to `localStorage` from components.
- **Colors** come from `src/lib/theme.js`. The status ramp (on-track / watch /
  at-risk) is reserved and must not be reused as a categorical hue.
- **Data** is fully synthetic. Do not add real company, person, or financial
  data to `src/data/seed.js`.

## Reporting bugs / requesting features

Please open an issue using the appropriate template under
[`.github/ISSUE_TEMPLATE`](.github/ISSUE_TEMPLATE).
