# AGENTS.md

## Project Summary
- Name: `my-movie-ticket`
- Type: Next.js 14 Pages Router app with TypeScript.
- Goal: Portfolio movie-ticketing service using TMDB data.
- Core stack: React 18, NextAuth, MongoDB, React Query, Emotion, Ant Design, Playwright, Jest.
- Package manager: Yarn (`yarn.lock` present).

## Architecture Pattern
Implemented layering in this repo:

`Model -> Repository -> Service -> API Route -> Container -> Presenter -> Page`

Practical mapping:
- `src/repositories/*`: database access and persistence queries.
- `src/services/*`: business/domain logic.
- `pages/api/*`: HTTP boundary and request validation.
- `src/containers/*`: data fetching and state orchestration.
- `src/components/presenters/*`: UI rendering.
- `pages/*`: route entry points.

## Important Runtime Entry Points
- `pages/_app.tsx`
  - Providers order: `SessionProvider` -> Emotion `CacheProvider` -> `QueryClientProvider` -> Antd `App` -> `Navigation`.
- `middleware.ts`
  - Redirects unauthenticated users for protected paths.
- `pages/api/auth/[...nextauth].ts`
  - NextAuth providers (Credentials/Kakao/Naver), JWT/session callbacks, role mapping.
- `lib/mongodb.ts`
  - Shared MongoDB client promise with dev hot-reload reuse.
- `next.config.js`
  - Emotion compiler settings, antd transpile modules, Sentry wrapping, optional bundle analyzer.

## Directory Map (High Signal)
```text
.
|- pages/
|  |- index.tsx
|  |- moviePage/, TVbroadcast/, bookPage/, mypage/, feedbackAdmin/, authPage/, non-member/
|  |- api/
|     |- auth/, movies/, TV/, showtimes/, booking/, bookingFetchMovies/
|     |- favorite/, profile/, adminFeedback/, non-member/, search/, top-rated/
|- src/
|  |- components/
|  |  |- presenters/ (feature UIs)
|  |  |- hoc/ (`Seo.tsx`, `withAuth.tsx`)
|  |  |- utils/
|  |- containers/ (feature state + side effects)
|  |- services/ (business logic)
|  |- repositories/ (MongoDB data access)
|- lib/
|  |- mongodb.ts, requireAdminApi.ts, logAdminAction.ts
|  |- utils/
|- queries/
|  |- movieQueries.ts
|- types/
|- scripts/
|  |- insertMovieData.ts, insertFeedbacks.ts
|- tests/ (Playwright e2e)
|- docs/ (generated JSDoc output)
```

## Main User Routes (Pages Router)
- `/` home (carousel + top-rated + help modal)
- `/moviePage`, `/moviePage/[id]`
- `/TVbroadcast`, `/TVbroadcast/[id]`
- `/bookPage`, `/bookPage/[movieId]`
- `/mypage`, `/mypage/edit`, `/mypage/favoriteList`, `/mypage/tickets`, `/mypage/feedback/*`
- `/authPage/signup`
- `/non-member`
- `/feedbackAdmin`

## API Route Domains
- Auth
  - `pages/api/auth/[...nextauth].ts`
  - `pages/api/auth/signup.ts`
- TMDB proxy/search
  - `pages/api/movies/*`, `pages/api/TV/*`, `pages/api/search/index.ts`, `pages/api/top-rated/index.tsx`
- Booking
  - `pages/api/booking/index.ts`, `pages/api/booking/[id].ts`, `pages/api/booking/myPageList.ts`
  - `pages/api/showtimes/index.ts`, `pages/api/showtimes/exists.ts`, `pages/api/showtimes/[id]/seat.ts`
  - `pages/api/bookingFetchMovies/index.ts`
- Non-member booking lookup/create
  - `pages/api/non-member/create.ts`, `pages/api/non-member/search.ts`
- Favorites
  - `pages/api/favorite/add.ts`, `remove.ts`, `status.ts`
- Profile/feedback
  - `pages/api/profile/update.ts`
  - `pages/api/profile/feedback/index.ts`, `pages/api/profile/feedback/edit/[id].ts`
- Admin feedback
  - `pages/api/adminFeedback/index.ts`, `stats.ts`, `status.ts`, `[id].ts`, `[id]/response/*`

## Data Collections Used (MongoDB)
- `users`
- `movie_movies`
- `movie_screenings`
- `movie_bookings`
- `favoriteMovies`
- `feedback`
- `non-member-user`
- `adminActions`

## Auth and Authorization Notes
- Session strategy: JWT (`next-auth`).
- Roles: `user` and `admin`.
- Middleware (`middleware.ts`) currently matches `"/mypage/:path*"` and `"/admin/:path*"`.
- Several admin APIs use `requireAdminApi`, but some endpoints rely on session checks inside handlers.

## Environment Variables (Observed in code)
Required/used keys:
- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `KAKAO_CLIENT_ID`
- `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_IMAGE_BASE_URL`
- `API_SECRET_KEY`
- `SENTRY_DSN`
- `SOCIAL_PEPPER_HMAC_SECRET`
- `ADMIN_EMAILS`
Optional/build-time:
- `ANALYZE`
- `CI`

## Commands
- Dev server: `yarn dev`
- Build: `yarn build`
- Start: `yarn start`
- Lint: `yarn lint`
- Unit/service tests (Jest): `yarn test`
- Watch tests: `yarn test:watch`
- E2E tests (Playwright): `yarn playwright test`
- Seed movie/screening data: `yarn seed`
- Feedback migration/index prep: `yarn migrate`
- Generate docs: `yarn jsdoc`

## Testing Layout
- Jest config: `jest.config.cjs`
  - Runs `src/**/*.test.ts`
  - Ignores `/tests/` (Playwright specs)
- Playwright config: `playwright.config.ts`
  - Specs in `tests/`
  - CI workflow in `.github/workflows/playwright.yml`

## Observability
- Sentry enabled in:
  - `instrumentation.ts`
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
- Next config wraps build with `withSentryConfig` and uses tunnel route `/monitoring`.

## Agent Working Conventions for This Repo
- Keep Pages Router conventions; do not introduce App Router patterns unless explicitly requested.
- Preserve container/presenter split for new UI work.
- Keep business logic in `src/services` and DB logic in `src/repositories`.
- For DB changes, use `clientPromise` from `lib/mongodb.ts`.
- Prefer existing coding style: explicit request-method guards in API routes and typed payload checks.

## Known Context Gaps / Inconsistencies to Verify Before Refactors
- Auth route naming is mixed (`/authPage/signup` exists; some code references `/auth/signup` or `/auth/signin`).
- Middleware protects `/admin/*`, while admin UI page is `/feedbackAdmin`.
- Some API files use `.tsx` extension under `pages/api` (for example `top-rated/index.tsx`).
- `.env.example` does not currently list every env var referenced in code (`API_SECRET_KEY`, `SOCIAL_PEPPER_HMAC_SECRET`, `ADMIN_EMAILS`).

## Generated/Heavy Directories
Usually avoid editing manually unless needed:
- `.next/`
- `node_modules/`
- `playwright-report/`
- `test-results/`
- `docs/` (generated output)
