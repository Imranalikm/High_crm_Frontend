# LiveTrader Admin Architecture

## Structure

- `src/app`: app bootstrap, providers, route setup, guards, layout shell
- `src/config`: centralized routes, sidebar, permissions, constants, env access
- `src/components`: reusable UI, common admin building blocks, tables, cards, modals
- `src/features`: domain-owned modules with local pages, services, hooks, data, types, and validations
- `src/pages`: thin route wrappers that keep URL ownership separate from feature internals
- `src/api`: shared HTTP client and endpoint plumbing

## Feature Rules

- Put shared UI in `src/components`, not inside a feature.
- Put feature-owned screens and business logic in the owning `src/features/<feature>`.
- Keep route definitions aligned with the page wrapper names under `src/pages`.
- Prefer `*.service.js` for orchestration, `*.workspace.js` for table/dashboard configs, and `*.constants.js` for static enums or option lists.

## Current Splits

- KYC is isolated under `src/features/kyc` while keeping the `/users/kyc` URL.
- Admin management is split into `src/features/roles-permissions` and `src/features/audit-logs`.
- Trading, copy trading, IB system, prop trading, finance, reports, support, and settings all own their service layer inside their feature folder.
