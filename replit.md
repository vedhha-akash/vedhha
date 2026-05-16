# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## VEDHHA Features
- **AI Chat Widget**: Floating chat button (bottom-right, above WhatsApp button) powered by OpenAI via Replit AI Integrations. Backend route: `POST /api/chat`. Component: `AIChatWidget.tsx`. System prompt includes full product catalog, pricing, delivery, return policy, and brand voice.
- **Dynamic Theme**: `ThemeContext.tsx` — genz (dark black) / gentleman (warm charcoal+gold). HamburgerMenu synced to theme.
- **Payments**: Razorpay LIVE (`rzp_live_ScBNe0Ph8IjZ9L`) + COD. OTP via Fast2SMS.
- **AI Integration env vars**: `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY` (auto-provisioned via Replit)
