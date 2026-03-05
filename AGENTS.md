# AGENTS.md

## Project Snapshot
- Name: `my-movie-ticket`
- Type: Next.js 14 Pages Router + TypeScript
- Goal: Portfolio movie/TV browsing + ticketing service backed by TMDB + MongoDB
- Package manager: Yarn (`yarn.lock`)
- Core stack: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Recoil, Jest, Playwright, Sentry

## Layered Architecture
The codebase is organized as:

`Model -> Repository -> Service -> API Route -> Container -> Presenter -> Page`

Directory ownership:
- `src/repositories/*`: persistence queries and DB I/O
- `src/services/*`: domain/business logic
- `pages/api/*`: HTTP boundary and request validation
- `src/containers/*`: data fetch + state orchestration
- `src/components/presenters/*`: rendering/UI
- `pages/*`: route entry points

## Runtime Entry Points
- `pages/_app.tsx`
  - Provider chain: `SessionProvider -> CacheProvider -> QueryClientProvider -> Antd App -> Navigation`
- `middleware.ts`
  - Auth/admin gate + redirect to `/` with `reason` query (`auth` or `admin`)
- `pages/api/auth/[...nextauth].ts`
  - Credentials/Kakao/Naver auth, JWT/session callbacks, role mapping from DB/admin email list
- `lib/mongodb.ts`
  - Shared MongoDB client promise, dev global reuse, dotenv `.env.local` load
- `next.config.js`
  - Emotion compiler options, antd transpilation, bundle analyzer toggle, Sentry build wrapper
- `instrumentation.ts`
  - Runtime switch for Sentry server/edge initialization

## High-Signal Directory Map
```text
.
|- pages/
|  |- index.tsx, 404.tsx, _app.tsx, _document.tsx, _error.tsx
|  |- authPage/, bookPage/, feedbackAdmin/, moviePage/, mypage/, non-member/, TVbroadcast/
|  |- sentry-example-page.tsx
|  |- api/
|     |- adminFeedback/, auth/, booking/, bookingFetchMovies/, favorite/
|     |- movies/, non-member/, profile/, search/, showtimes/, top-rated/, TV/
|     |- sentry-example-api.ts
|- src/
|  |- components/ (presenters, hoc, utils)
|  |- containers/
|  |- repositories/
|  |- services/ (includes `src/services/__tests__`)
|- lib/ (mongodb, admin auth/action helpers, utilities)
|- queries/ (`movieQueries.ts`)
|- scripts/ (`insertMovieData.ts`, `insertFeedbacks.ts`, `run-jest.cjs`)
|- types/ (feature type definitions)
|- tests/ (Playwright specs)
|- docs/ (generated JSDoc output)
```

## Main Routes
- `/`
- `/moviePage`, `/moviePage/[id]`
- `/TVbroadcast`, `/TVbroadcast/[id]`
- `/bookPage`, `/bookPage/[movieId]`
- `/mypage`, `/mypage/edit`, `/mypage/favoriteList`, `/mypage/tickets`, `/mypage/feedback/*`
- `/authPage/signup`
- `/non-member`
- `/feedbackAdmin`
- `/sentry-example-page` (Sentry sample page; not user-facing business flow)

## API Domain Map
- Auth: `pages/api/auth/[...nextauth].ts`, `pages/api/auth/signup.ts`
- TMDB proxy/search: `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- Booking/showtimes: `pages/api/booking/*`, `pages/api/showtimes/*`, `pages/api/bookingFetchMovies/index.ts`
- Non-member booking lookup/create: `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- Favorites: `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- Profile/feedback: `pages/api/profile/update.ts`, `pages/api/profile/feedback/*`
- Admin feedback: `pages/api/adminFeedback/*`, including `[id]/response/*`, `stats.ts`, `status.ts`
- Observability example: `pages/api/sentry-example-api.ts` (intentional test error route)

## MongoDB Collections (Observed)
- `users`
- `movie_movies`
- `movie_screenings`
- `movie_bookings`
- `favoriteMovies`
- `feedback`
- `non-member-user`
- `adminActions`

## Auth/Authorization Notes
- Session strategy: JWT (`next-auth`)
- Roles: `user`, `admin`
- Social login user key is hashed via `SOCIAL_PEPPER_HMAC_SECRET` (`lib/utils/hashSocialID.ts`)
- NextAuth custom sign-in page: `/authPage/signup`
- Middleware matcher currently: `"/mypage/:path*"`, `"/feedbackAdmin/:path*"`
- `/bookPage` is intentionally excluded from middleware matcher to allow guest booking flow
- `PROTECTED_PATHS` still contains `"/bookPage"` in code, but this path is not active unless matcher is expanded
- Admin API auth style is mixed:
  - Most routes do inline `getServerSession` role checks
  - `pages/api/adminFeedback/status.ts` additionally wraps with `requireAdminApi`
- `withAuth` HOC is used on some mypage routes, but route protection is not uniformly centralized

## Data Shape Notes
- Feedback admin reply canonical field is `response` (array)
- UI/container still includes compatibility fallback for legacy `responses`
- Media type naming is mixed by source:
  - TMDB list/search payloads use `media_type`
  - Internal favorite/detail flows use `mediaType`
- Booking seat status convention: `"available"` | `"sold"`
- Booking policy: one-seat-per-request is enforced in both API and repository layers (`seats.length === 1`)

## Environment Variables (Observed in code)
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMAGE_BASE_URL`
- `API_SECRET_KEY`
- `ADMIN_EMAILS`
- `SOCIAL_PEPPER_HMAC_SECRET`
- `SENTRY_DSN`
- `ANALYZE` (optional)
- `CI` (optional)
- `NEXT_RUNTIME` (instrumentation runtime switch)
- `NODE_ENV`
- `NEXTAUTH_URL` (runtime/deploy requirement for NextAuth, even when not directly read in app code)

## Commands
- Dev: `yarn dev`
- Build: `yarn build`
- Start: `yarn start`
- Lint: `yarn lint`
- Type check: `yarn tsc --noEmit`
- Unit/service tests: `yarn test` (runs `scripts/run-jest.cjs` wrapper)
- Test watch: `yarn test:watch`
- E2E tests: `yarn playwright test`
- Seed movies/showtimes: `yarn seed`
- Feedback migration/index script: `yarn migrate`
- Generate docs: `yarn jsdoc`

## Testing Layout
- Jest: `jest.config.cjs`
  - Runs `src/**/*.test.ts`
  - Ignores `/tests/` (Playwright specs)
- Jest launcher wrapper: `scripts/run-jest.cjs`
  - Patches `strip-ansi` resolution to avoid CommonJS/ESM interop failure in local runs
- Playwright: `playwright.config.ts`
  - Specs under `tests/` (`auth.middleware.spec.ts`, `example.spec.ts`)
  - Middleware e2e targets `/mypage` and `/feedbackAdmin` routes

## Observability
- Sentry wiring:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- Build is wrapped by `withSentryConfig` in `next.config.js`
- Sentry tunnel route: `/monitoring`
- Sample Sentry test endpoints:
  - `pages/sentry-example-page.tsx`
  - `pages/api/sentry-example-api.ts`

## Current Hotspots (Static Analysis Context)
- Method guard consistency is still mixed (`400` vs `405`) across API routes
- Admin authorization style is still mixed (`getServerSession` inline checks vs `requireAdminApi` wrapper)
- `.env.example` still drifts from actual runtime keys:
  - Missing `API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`
  - Contains `TMDB_KEY` which is not used by current app/server code paths
- `pages/api/sentry-example-api.ts` intentionally throws on request; keep out production traffic paths

## Agent Conventions for This Repo
- Keep Pages Router patterns unless explicitly requested otherwise
- Preserve container/presenter split in UI changes
- Keep business logic in `src/services`, persistence in `src/repositories`
- Use `clientPromise` from `lib/mongodb.ts` for DB access
- Prefer explicit method guards + typed payload checks in API handlers
- If touching feedback reply models, update type + repository + container + presenter together

## Generated/Heavy Directories
Avoid manual edits unless required:
- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (generated)
