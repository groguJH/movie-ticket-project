# AGENTS.md

## Project Snapshot
- Name: `my-movie-ticket`
- Type: Next.js 14 Pages Router + TypeScript
- Goal: Portfolio movie ticketing service backed by TMDB + MongoDB
- Package manager: Yarn (`yarn.lock`)
- Core stack: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Jest, Playwright, Sentry

## Layered Architecture
The codebase is structured as:

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
  - Auth/admin gate + redirect to `/` with query reason
- `pages/api/auth/[...nextauth].ts`
  - Credentials/Kakao/Naver auth, JWT/session callbacks, role mapping
- `lib/mongodb.ts`
  - Shared MongoDB client promise, dev global reuse, dotenv `.env.local` load
- `next.config.js`
  - Emotion compiler options, transpile-modules for antd stack, Sentry wrapping, optional bundle analyzer

## High-Signal Directory Map
```text
.
|- pages/
|  |- index.tsx, 404.tsx, _app.tsx, _document.tsx, _error.tsx
|  |- authPage/, bookPage/, feedbackAdmin/, moviePage/, mypage/, non-member/, TVbroadcast/
|  |- api/
|     |- adminFeedback/, auth/, booking/, bookingFetchMovies/, favorite/
|     |- movies/, non-member/, profile/, search/, showtimes/, top-rated/, TV/
|- src/
|  |- components/ (presenters, hoc, utils)
|  |- containers/
|  |- repositories/
|  |- services/
|- lib/ (mongodb, auth/admin helpers, logging, utils)
|- queries/
|- scripts/ (seed + migration style scripts)
|- tests/ (Playwright)
|- docs/ (generated jsdoc output)
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

## API Domain Map
- Auth: `pages/api/auth/[...nextauth].ts`, `pages/api/auth/signup.ts`
- TMDB proxy/search: `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- Booking/showtimes: `pages/api/booking/*`, `pages/api/showtimes/*`, `pages/api/bookingFetchMovies/index.ts`
- Non-member booking: `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- Favorites: `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- Profile/feedback: `pages/api/profile/update.ts`, `pages/api/profile/feedback/*`
- Admin feedback: `pages/api/adminFeedback/*`, including `[id]/response/*`

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
- Middleware matcher currently: `"/mypage/:path*"`, `"/feedbackAdmin/:path*"`
- `PROTECTED_PATHS` contains `"/bookPage"` in middleware logic, but matcher does not include `/bookPage` (important when changing route protection)
- Admin API auth style is mixed:
  - Most routes do inline `getServerSession` role checks
  - `pages/api/adminFeedback/status.ts` additionally wraps with `requireAdminApi`

## Data Shape Notes
- Feedback admin reply canonical field is `response` (array)
- Some UI/container code keeps backward-compat fallback for `responses`
- If changing reply field naming, update type + repository + container + presenter together

## Environment Variables (Observed in code)
- `MONGODB_URI`
- `NEXTAUTH_URL` (NextAuth deployment/runtime requirement)
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
- `NEXT_RUNTIME` (runtime branch check in instrumentation)

## Commands
- Dev: `yarn dev`
- Build: `yarn build`
- Start: `yarn start`
- Lint: `yarn lint`
- Type check: `yarn tsc --noEmit` (used frequently during static review)
- Unit/service tests: `yarn test`
- Test watch: `yarn test:watch`
- E2E tests: `yarn playwright test`
- Seed movies/showtimes: `yarn seed`
- Feedback migration/index script: `yarn migrate`
- Generate docs: `yarn jsdoc`

## Testing Layout
- Jest: `jest.config.cjs`
  - Runs `src/**/*.test.ts`
  - Ignores `/tests/` (Playwright specs)
- Playwright: `playwright.config.ts`
  - Specs under `tests/`

## Observability
- Sentry wiring:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- Build is wrapped by `withSentryConfig` in `next.config.js`
- Sentry tunnel route: `/monitoring`

## Current Hotspots (Static Analysis Context)
- Method guard consistency is mixed (`400` vs `405`) across API routes
- `pages/api/booking/index.ts` currently has the POST method guard commented out
- `pages/api/showtimes/[id]/seat.ts` has no explicit method/id validation guard
- Local Jest runtime currently fails before test execution in some runs with `TypeError: stripAnsi is not a function`
- `.env.example` is missing some keys used by the current codebase (`API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`)

## Agent Conventions for This Repo
- Keep Pages Router patterns unless explicitly requested otherwise
- Preserve container/presenter split in UI changes
- Keep business logic in `src/services`, persistence in `src/repositories`
- Use `clientPromise` from `lib/mongodb.ts` for DB access
- Prefer explicit method guards + typed payload checks in API handlers

## Generated/Heavy Directories
Avoid manual edits unless required:
- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (generated)
